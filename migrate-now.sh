#!/bin/bash

# Quick Migration Script
# This script will migrate your local database to production

set -e

echo "🚀 Database Migration Script"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ DATABASE_URL is not set!${NC}"
  echo ""
  echo -e "${YELLOW}📋 To get your production DATABASE_URL:${NC}"
  echo "   1. Go to Coolify: http://31.97.57.75:8000"
  echo "   2. Navigate to: Projects → 'My first project' → 'production' → Your Application"
  echo "   3. Click: 'Environment Variables' tab"
  echo "   4. Find: DATABASE_URL"
  echo "   5. Copy the full value"
  echo ""
  echo -e "${BLUE}Then run:${NC}"
  echo "   export DATABASE_URL='postgresql://user:password@host:5432/database'"
  echo "   ./migrate-now.sh"
  echo ""
  exit 1
fi

# Set local database URL (default)
LOCAL_DB_URL="${LOCAL_DATABASE_URL:-postgresql://postgres:password@localhost:5436/tourworld_tourism}"

echo -e "${GREEN}✅ Production DATABASE_URL is set${NC}"
echo -e "${BLUE}📍 Local database:${NC} $LOCAL_DB_URL"
echo -e "${BLUE}📍 Production database:${NC} ${DATABASE_URL//:[^:@]*@/:****@}"
echo ""

# Confirm
echo -e "${YELLOW}⚠️  This will migrate ALL data from local to production!${NC}"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Migration cancelled."
  exit 0
fi

# Create export file
EXPORT_FILE="local-db-export-$(date +%Y%m%d-%H%M%S).json"

echo ""
echo -e "${GREEN}Step 1: Exporting from local database...${NC}"
export DATABASE_URL="$LOCAL_DB_URL"
node scripts/export-local-db.js > "$EXPORT_FILE" 2>&1

if [ ! -s "$EXPORT_FILE" ]; then
  echo -e "${RED}❌ Export file is empty!${NC}"
  echo "Check your local database connection."
  exit 1
fi

echo -e "${GREEN}✅ Export completed: $EXPORT_FILE${NC}"
echo ""

# Import to production
echo -e "${GREEN}Step 2: Importing to production database...${NC}"
export DATABASE_URL="$DATABASE_URL"
cat "$EXPORT_FILE" | node scripts/import-to-production.js 2>&1

echo ""
echo -e "${GREEN}✨ Migration Complete!${NC}"
echo ""
echo "📁 Export file saved as: $EXPORT_FILE (keep as backup)"
echo ""
echo "🔍 Next steps:"
echo "   1. Check your production site: http://tourworldtourism.com"
echo "   2. Verify all content is showing"
echo "   3. Check that images are loading"

