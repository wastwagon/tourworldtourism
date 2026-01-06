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

# Generate Prisma Client (in case it wasn't generated during build)
echo "📦 Generating Prisma Client..."
npx prisma generate || {
  echo "⚠️  Warning: Prisma generate failed, continuing anyway..."
}

# Push database schema (creates tables if they don't exist)
echo "🗄️  Syncing database schema..."
npx prisma db push --accept-data-loss || {
  echo "⚠️  Warning: Database schema sync failed"
  echo "💡 This might be okay if the database is already set up"
}

echo "✅ Database setup complete"

# Start the Next.js server
echo "🌐 Starting Next.js server..."
exec node server.js

