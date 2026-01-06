# 🚀 Complete Database Migration Guide

This guide will help you migrate **all content** from your local PostgreSQL database to production, including:
- ✅ All tours, hotels, attractions, blogs, galleries
- ✅ Testimonials, bookings, contact inquiries
- ✅ Newsletter subscriptions
- ✅ Images and media files

---

## 📋 Prerequisites

1. **Local database is running** (Docker PostgreSQL)
   ```bash
   docker-compose up -d
   ```

2. **Production database is accessible** (Coolify database)

3. **Node.js and dependencies installed**
   ```bash
   npm install
   ```

---

## 🎯 Quick Migration (Automated)

### Option 1: One-Command Migration (Recommended)

```bash
# Set your production database URL
export DATABASE_URL="postgresql://user:password@host:5432/database"

# Run the migration script
./scripts/migrate-database.sh
```

The script will:
1. ✅ Export all data from local database
2. ✅ Import to production database
3. ✅ Verify images are in place
4. ✅ Create a backup export file

---

## 📝 Step-by-Step Manual Migration

### Step 1: Export from Local Database

```bash
# Make sure local database is running
docker-compose ps

# Set local database URL (if different from default)
export LOCAL_DATABASE_URL="postgresql://postgres:password@localhost:5436/tourworld_tourism"

# Export all data
node scripts/export-local-db.js > local-db-export.json

# Verify export file was created
ls -lh local-db-export.json
```

**What gets exported:**
- ✅ Tours (all fields)
- ✅ Hotels
- ✅ Attractions
- ✅ Blogs
- ✅ Galleries
- ✅ Testimonials
- ✅ Bookings
- ✅ Contact Inquiries
- ✅ Newsletter Subscriptions
- ✅ Users (without passwords - security)

---

### Step 2: Import to Production Database

```bash
# Set production database URL
export DATABASE_URL="postgresql://tourworld_user:password@host:5432/tourworld_tourism"

# Import the data
cat local-db-export.json | node scripts/import-to-production.js
```

**What happens:**
- ✅ Uses `upsert` - won't create duplicates
- ✅ Preserves relationships (tours → bookings)
- ✅ Handles errors gracefully
- ✅ Shows progress for each table

---

### Step 3: Verify Images

Images are already in your `public/images/` directory and will be deployed with your code. To verify:

```bash
# Count images
find public/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | wc -l

# List image directories
ls -la public/images/
```

**Image locations:**
- `public/images/tours/` - Tour images
- `public/images/hotels/` - Hotel images
- `public/images/galleries/` - Gallery images
- `public/images/blogs/` - Blog images
- `public/images/attractions/` - Attraction images

---

## 🔧 Migration from Coolify Terminal

If you need to run migration from Coolify's terminal/SSH:

### Step 1: Upload Export File

```bash
# On your local machine, copy the export file
scp local-db-export.json user@your-server:/tmp/
```

### Step 2: Run Import in Coolify

```bash
# SSH into your Coolify server or use Coolify terminal
cd /path/to/your/app

# Set production DATABASE_URL (should already be set)
echo $DATABASE_URL

# Import the data
cat /tmp/local-db-export.json | node scripts/import-to-production.js
```

---

## 📊 What Gets Migrated

| Table | Migrated | Notes |
|-------|----------|-------|
| Tours | ✅ Yes | All fields, including images, itineraries |
| Hotels | ✅ Yes | All fields |
| Attractions | ✅ Yes | All fields |
| Blogs | ✅ Yes | All fields, including content |
| Galleries | ✅ Yes | All images and metadata |
| Testimonials | ✅ Yes | All testimonials |
| Bookings | ✅ Yes | Linked to tours |
| Contact Inquiries | ✅ Yes | All inquiries |
| Newsletter | ✅ Yes | All subscriptions |
| Users | ⚠️ Partial | Passwords excluded (security) |

---

## 🔒 Security Notes

1. **Passwords are NOT exported** - Users will need to reset passwords or be recreated
2. **Export files contain sensitive data** - Keep them secure
3. **Production DATABASE_URL** - Never commit this to git

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Local:**
```bash
# Check if Docker container is running
docker ps | grep tourworld-postgres

# Check logs
docker logs tourworld-postgres

# Test connection
docker exec -it tourworld-postgres psql -U postgres -d tourworld_tourism -c "SELECT 1;"
```

**Production:**
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"
```

### Error: "Duplicate key" or "Unique constraint"

The import script uses `upsert`, so this shouldn't happen. If it does:
- The data might already be imported
- Check the production database first
- You can safely re-run the import (it uses upsert)

### Images Not Showing

1. **Verify images are in git:**
   ```bash
   git ls-files public/images/ | head -20
   ```

2. **Push images to repository:**
   ```bash
   git add public/images/
   git commit -m "Add images"
   git push
   ```

3. **Redeploy in Coolify** - Images will be included in deployment

---

## ✅ Verification Checklist

After migration, verify:

- [ ] Tours page shows all tours
- [ ] Tour detail pages load correctly
- [ ] Images display properly
- [ ] Hotels page shows all hotels
- [ ] Blogs page shows all blogs
- [ ] Galleries display correctly
- [ ] Testimonials are visible
- [ ] Search and filters work
- [ ] Booking functionality works

---

## 📁 Backup

The export script creates a timestamped backup file:
```
local-db-export-YYYYMMDD-HHMMSS.json
```

**Keep this file safe!** It contains all your data and can be used to:
- Restore data if needed
- Migrate to another database
- Create additional backups

---

## 🎉 Success!

Once migration is complete:
1. ✅ All your content is in production
2. ✅ Images are deployed with your code
3. ✅ Everything should work exactly as local

**Need help?** Check the error messages - they're usually self-explanatory!

