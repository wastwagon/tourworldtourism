#!/bin/bash
# Inline import script - paste this entire script into Coolify Terminal
# It includes the base64 dump inline

set -e

echo "🚀 Inline PostgreSQL Dump Import"
echo "================================"

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set!"
    exit 1
fi

echo "✅ DATABASE_URL found"
echo ""

# The base64 encoded dump (will be inserted here)
# For now, we'll create a script that reads from a file or accepts input

echo "📦 Creating import script..."
cat > /tmp/import-dump.sh << 'IMPORTEOF'
#!/bin/bash
# This will be created in Coolify

# Method 1: If base64 file is uploaded
if [ -f "tourworld-dump-20260106-132703.sql.base64.txt" ]; then
    echo "📦 Found base64 file, decoding..."
    base64 -d tourworld-dump-20260106-132703.sql.base64.txt > /tmp/dump.sql
elif [ -f "tourworld-dump.sql" ]; then
    echo "📦 Found SQL file, using it..."
    cp tourworld-dump.sql /tmp/dump.sql
else
    echo "❌ No dump file found!"
    echo "Please upload the base64 file or SQL file first"
    exit 1
fi

# Import
if command -v psql &> /dev/null; then
    echo "📥 Importing with psql..."
    psql "$DATABASE_URL" < /tmp/dump.sql
elif command -v docker &> /dev/null; then
    echo "📥 Importing with Docker..."
    docker run --rm -i postgres:16 psql "$DATABASE_URL" < /tmp/dump.sql
else
    echo "❌ Need psql or docker"
    exit 1
fi

echo "✅ Import complete!"
IMPORTEOF

chmod +x /tmp/import-dump.sh
echo "✅ Script created at /tmp/import-dump.sh"
echo ""
echo "To use:"
echo "1. Upload tourworld-dump-20260106-132703.sql.base64.txt to Coolify"
echo "2. Run: /tmp/import-dump.sh"
echo ""
echo "OR paste the base64 content and run:"
echo "  base64 -d > tourworld-dump.sql << 'EOF'"
echo "  [paste base64 here]"
echo "  EOF"
echo "  psql \$DATABASE_URL < tourworld-dump.sql"

