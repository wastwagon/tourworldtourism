#!/bin/sh
set -e

echo "🚀 Starting application..."

# Check if DATABASE_URL is set and not a placeholder
if [ -z "$DATABASE_URL" ] || echo "$DATABASE_URL" | grep -qiE "(placeholder|not.*set|example|localhost:5432.*placeholder)"; then
  echo "❌ ERROR: DATABASE_URL is not set or is still a placeholder value!"
  echo "💡 Current value: '$DATABASE_URL'"
  echo "💡 Please set DATABASE_URL in your Coolify environment variables."
  echo "💡 It should look like: postgresql://user:password@host:5432/database"
  echo "💡 Make sure both 'Available at Buildtime' and 'Available at Runtime' are checked!"
  echo "💡 The value must start with 'postgres://' or 'postgresql://'"
  exit 1
fi

# Additional validation: must start with postgres:// or postgresql://
if ! echo "$DATABASE_URL" | grep -qE "^postgres(ql)?://"; then
  echo "❌ ERROR: DATABASE_URL format is invalid!"
  echo "💡 Current value: '$DATABASE_URL'"
  echo "💡 It must start with 'postgres://' or 'postgresql://'"
  exit 1
fi

echo "✅ DATABASE_URL is set"

# Ensure upload directories exist with proper permissions
echo "📁 Ensuring upload directories exist..."
node scripts/ensure-upload-dirs.js || {
  echo "⚠️  Directory check failed, continuing..."
}

# Prisma Client should already be generated during build
# Skip generation to avoid permission issues with global Prisma
echo "📦 Prisma Client should already be generated from build..."

# Push database schema (creates tables if they don't exist)
echo "🗄️  Syncing database schema..."
npx prisma db push --accept-data-loss || {
  echo "⚠️  Warning: Database schema sync failed"
  echo "💡 This might be okay if the database is already set up"
}

echo "✅ Database setup complete"

# Auto-import data if database is empty
echo "🔍 Checking if database needs data import..."
node scripts/auto-import-data.js || {
  echo "⚠️  Auto-import skipped or failed, continuing startup..."
}

# Start the Next.js server
echo "🌐 Starting Next.js server..."
exec node server.js

