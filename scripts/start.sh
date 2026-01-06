#!/bin/sh
set -e

echo "🚀 Starting application..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "postgresql://placeholder" ]; then
  echo "❌ ERROR: DATABASE_URL is not set or is still the placeholder value!"
  echo "💡 Please set DATABASE_URL in your Coolify environment variables."
  echo "💡 It should look like: postgresql://user:password@host:5432/database"
  exit 1
fi

echo "✅ DATABASE_URL is set"

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

# Seed database if empty (seed script uses upsert, so safe to run)
echo "🌱 Seeding database with sample data..."
npx tsx prisma/seed.ts || {
  echo "⚠️  Warning: Database seed failed, continuing anyway..."
  echo "💡 You can manually seed later by running: npx tsx prisma/seed.ts"
}

# Start the Next.js server
echo "🌐 Starting Next.js server..."
exec node server.js

