#!/bin/bash
# This script can be copied and run in Coolify Terminal
# It will create the export file from base64 and import it

# Base64 encoded export file (will be provided)
EXPORT_B64=""

# Decode and create file
echo "$EXPORT_B64" | base64 -d > local-db-export-final.json

# Verify file
if [ ! -f "local-db-export-final.json" ]; then
  echo "❌ Failed to create export file"
  exit 1
fi

echo "✅ Export file created"
ls -lh local-db-export-final.json

# Import
echo ""
echo "📊 Starting import..."
cat local-db-export-final.json | node scripts/import-to-production.js

echo ""
echo "✅ Import completed!"

