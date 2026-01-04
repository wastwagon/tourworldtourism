# Database Setup Guide

## 🎯 Quick Solution: Use a Cloud Database (Recommended)

Since you're deploying to Render anyway, the easiest solution is to use a cloud database:

### Option 1: Supabase (Free Tier) - Easiest ⭐

1. **Sign up**: Go to [supabase.com](https://supabase.com) and create a free account
2. **Create project**: Click "New Project"
3. **Get connection string**: 
   - Go to Project Settings → Database
   - Copy the "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
4. **Update .env**:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
5. **Sync schema**:
   ```bash
   npx prisma db push
   npm run db:generate
   ```

### Option 2: Neon (Free Tier) - Also Easy

1. **Sign up**: Go to [neon.tech](https://neon.tech) and create a free account
2. **Create project**: Click "Create Project"
3. **Get connection string**: Copy the connection string from the dashboard
4. **Update .env**: Paste the connection string
5. **Sync schema**: Same as above

### Option 3: Render Database (When You Deploy)

When you deploy to Render using the blueprint, it will automatically create a PostgreSQL database. You can use that connection string locally too.

## 🖥️ Local Setup: Install PostgreSQL

If you prefer to run PostgreSQL locally:

### macOS (Using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create database
createdb tourworld_tourism

# Update .env (default port is 5432, not 5436)
DATABASE_URL="postgresql://postgres@localhost:5432/tourworld_tourism"
```

**Note**: Your `.env` currently uses port 5436. You may need to:
- Change port to 5432 (default PostgreSQL port)
- Or configure PostgreSQL to run on 5436

### macOS (Using Postgres.app)

1. Download [Postgres.app](https://postgresapp.com/)
2. Install and launch
3. Click "Initialize" to create a new server
4. Update `.env` with the connection string shown

### Docker (If You Have Docker)

```bash
# Start PostgreSQL container
docker run --name tourworld-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=tourworld_tourism \
  -p 5436:5432 \
  -d postgres:14

# Your .env should work as-is:
# DATABASE_URL="postgresql://postgres:password@localhost:5436/tourworld_tourism"
```

## 🔧 After Database Setup

Once you have a database (cloud or local):

```bash
# 1. Sync the database schema
npx prisma db push

# 2. Generate Prisma client
npm run db:generate

# 3. (Optional) Seed the database
npm run db:seed

# 4. Restart your dev server
npm run dev
```

## ✅ Verify Database Connection

```bash
# Test connection
npx prisma db execute --stdin <<< "SELECT 1;"

# Or open Prisma Studio to see your database
npm run db:studio
```

## 🚨 Current Issue

Your `.env` file points to:
```
postgresql://postgres:password@localhost:5436/tourworld_tourism
```

But PostgreSQL is not running on port 5436. You need to either:
1. **Start PostgreSQL** on port 5436, OR
2. **Use a cloud database** (recommended), OR
3. **Change the port** in `.env` to match your PostgreSQL installation

## 💡 Recommendation

**For now**: Use Supabase (free, easy, works immediately)
**For production**: Use Render's database (automatically set up when you deploy)

