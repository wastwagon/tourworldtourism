#!/bin/bash
# Run this script in Coolify Terminal
# The DATABASE_URL is already set in the environment

echo "🚀 Importing database in Coolify..."
echo ""

# Check if export file exists
if [ ! -f "local-db-export-clean.json" ]; then
  echo "❌ Export file not found!"
  echo "💡 Please upload local-db-export-clean.json to Coolify first"
  exit 1
fi

# Import the data
cat local-db-export-clean.json | node scripts/import-to-production.js

echo ""
echo "✅ Import completed!"
echo "🔍 Check your production site to verify content"

