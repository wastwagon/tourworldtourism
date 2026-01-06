#!/bin/bash
# PostgreSQL Dump Migration Script
# More reliable than JSON export/import

set -e

echo "🚀 PostgreSQL Dump Migration"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
LOCAL_DB_URL="${LOCAL_DATABASE_URL:-postgresql://postgres:password@localhost:5436/tourworld_tourism}"
DUMP_FILE="tourworld-dump-$(date +%Y%m%d-%H%M%S).sql"
BASE64_FILE="${DUMP_FILE}.base64.txt"

# Step 1: Export from local database
echo -e "\n${YELLOW}Step 1: Exporting from local database...${NC}"
echo "Database: ${LOCAL_DB_URL}"

# Extract connection details
DB_HOST=$(echo $LOCAL_DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $LOCAL_DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $LOCAL_DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo $LOCAL_DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $LOCAL_DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"

# Check if pg_dump is available
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}❌ pg_dump not found!${NC}"
    echo "Install it with:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql-client"
    echo "  Or use Docker (see script comments)"
    exit 1
fi

# Export database
echo -e "\n${GREEN}Creating SQL dump...${NC}"
PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --format=plain \
  --no-owner \
  --no-acl \
  --verbose \
  > "$DUMP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dump created: $DUMP_FILE${NC}"
    echo "Size: $(du -h "$DUMP_FILE" | cut -f1)"
else
    echo -e "${RED}❌ Dump failed!${NC}"
    exit 1
fi

# Step 2: Create base64 encoded version
echo -e "\n${YELLOW}Step 2: Creating base64 encoded file...${NC}"
base64 "$DUMP_FILE" > "$BASE64_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Base64 file created: $BASE64_FILE${NC}"
    echo "Size: $(du -h "$BASE64_FILE" | cut -f1)"
else
    echo -e "${RED}❌ Base64 encoding failed!${NC}"
    exit 1
fi

# Step 3: Instructions
echo -e "\n${GREEN}✅ Export completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Copy the base64 file content to Coolify Terminal:"
echo "   cat $BASE64_FILE"
echo ""
echo "2. In Coolify Terminal, decode and import:"
echo "   base64 -d > tourworld-dump.sql << 'EOF'"
echo "   [paste base64 content here]"
echo "   EOF"
echo ""
echo "3. Import into production database:"
echo "   psql \$DATABASE_URL < tourworld-dump.sql"
echo ""
echo "   OR if psql is not available, use Docker:"
echo "   docker run --rm -i postgres:15 psql \$DATABASE_URL < tourworld-dump.sql"
echo ""
echo -e "${GREEN}Files created:${NC}"
echo "  - $DUMP_FILE (SQL dump)"
echo "  - $BASE64_FILE (base64 encoded, ready to copy)"

