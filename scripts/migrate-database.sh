#!/bin/bash
# Complete database migration script
# Exports from local PostgreSQL and imports to production

set -e

echo "🚀 Starting Complete Database Migration"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if LOCAL_DATABASE_URL is set
if [ -z "$LOCAL_DATABASE_URL" ]; then
  LOCAL_DATABASE_URL="postgresql://postgres:password@localhost:5436/tourworld_tourism"
  echo -e "${YELLOW}⚠️  LOCAL_DATABASE_URL not set, using default:${NC}"
  echo "   $LOCAL_DATABASE_URL"
  echo ""
fi

# Check if DATABASE_URL is set (production)
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ ERROR: DATABASE_URL (production) is not set!${NC}"
  echo "💡 Please set DATABASE_URL to your production database connection string."
  echo ""
  echo "Example:"
  echo "  export DATABASE_URL='postgresql://user:pass@host:5432/database'"
  exit 1
fi

EXPORT_FILE="local-db-export-$(date +%Y%m%d-%H%M%S).json"

echo "📋 Migration Plan:"
echo "   1. Export data from local database"
echo "   2. Import data to production database"
echo "   3. Verify images are in place"
echo ""

# Step 1: Export from local
echo -e "${GREEN}Step 1: Exporting from local database...${NC}"
export DATABASE_URL="$LOCAL_DATABASE_URL"
node scripts/export-local-db.js > "$EXPORT_FILE"

if [ ! -s "$EXPORT_FILE" ]; then
  echo -e "${RED}❌ Export file is empty!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Export saved to: $EXPORT_FILE${NC}"
echo ""

# Step 2: Import to production
echo -e "${GREEN}Step 2: Importing to production database...${NC}"
echo -e "${YELLOW}⚠️  This will modify your production database!${NC}"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Migration cancelled."
  exit 0
fi

cat "$EXPORT_FILE" | node scripts/import-to-production.js

echo ""
echo -e "${GREEN}✅ Import completed!${NC}"
echo ""

# Step 3: Verify images
echo -e "${GREEN}Step 3: Verifying images...${NC}"
if [ -d "public/images" ]; then
  IMAGE_COUNT=$(find public/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.heic" \) | wc -l | tr -d ' ')
  echo "✅ Found $IMAGE_COUNT images in public/images/"
  echo "💡 Make sure these images are deployed to production (they should be in your git repo)"
else
  echo -e "${YELLOW}⚠️  public/images directory not found${NC}"
fi

echo ""
echo -e "${GREEN}✨ Migration Complete!${NC}"
echo ""
echo "📁 Export file saved as: $EXPORT_FILE"
echo "💡 Keep this file as a backup"
echo ""
echo "🔍 Next steps:"
echo "   1. Verify your production site shows all content"
echo "   2. Check that images are loading correctly"
echo "   3. Test all features (tours, bookings, etc.)"

