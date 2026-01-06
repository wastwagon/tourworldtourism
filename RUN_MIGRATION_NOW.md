# 🚀 Run Database Migration NOW

## Current Status
✅ Application is running in production  
✅ Database is connected  
⚠️ Production database is empty - needs your local content  

## Step 1: Get Your Production DATABASE_URL

From your Coolify logs, I can see your database connection. You need the full connection string:

1. **Go to Coolify**: `http://31.97.57.75:8000`
2. **Navigate to**: Projects → "My first project" → "production" → Your Application
3. **Click**: "Environment Variables" tab
4. **Find**: `DATABASE_URL`
5. **Copy the full value**

It should look like:
```
postgresql://tourworld_user:password@jc48w0kggo0s88sog4s8oo8c:5432/postgres
```

**OR** if you see it in the logs, it's:
```
postgresql://...@jc48w0kggo0s88sog4s8oo8c:5432/postgres
```

## Step 2: Check Local Database Connection

Your local database should be accessible at:
```
postgresql://postgres:password@localhost:5436/tourworld_tourism
```

**If using Docker Compose:**
```bash
docker-compose up -d
```

**If using local PostgreSQL:**
Make sure PostgreSQL is running and accessible.

## Step 3: Run the Migration

### Option A: Automated Script (Recommended)

```bash
# Set your production DATABASE_URL (from Step 1)
export DATABASE_URL="postgresql://user:password@jc48w0kggo0s88sog4s8oo8c:5432/postgres"

# Set local database URL (if different)
export LOCAL_DATABASE_URL="postgresql://postgres:password@localhost:5436/tourworld_tourism"

# Run migration
./scripts/migrate-database.sh
```

### Option B: Manual Steps

```bash
# 1. Export from local
export LOCAL_DATABASE_URL="postgresql://postgres:password@localhost:5436/tourworld_tourism"
node scripts/export-local-db.js > local-db-export.json

# 2. Import to production
export DATABASE_URL="postgresql://user:password@jc48w0kggo0s88sog4s8oo8c:5432/postgres"
cat local-db-export.json | node scripts/import-to-production.js
```

## Step 4: Verify Migration

After migration completes, check:
1. ✅ Tours are showing on production site
2. ✅ Images are loading (they're in `public/images/`)
3. ✅ All content is present

## 🆘 Troubleshooting

### "Cannot connect to local database"
- Check if PostgreSQL is running: `docker-compose ps` or check PostgreSQL service
- Verify connection string matches your setup
- Default local: `postgresql://postgres:password@localhost:5436/tourworld_tourism`

### "Cannot connect to production database"
- Double-check DATABASE_URL from Coolify Environment Variables
- Make sure the database is accessible from your network
- Check firewall settings if needed

### "Export file is empty"
- Verify local database has data
- Check connection string is correct
- Run: `node scripts/export-local-db.js` to see detailed output

---

**Ready to migrate?** Get your production DATABASE_URL from Coolify and run the migration script!

