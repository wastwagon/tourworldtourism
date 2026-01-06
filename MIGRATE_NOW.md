# 🚀 Quick Start: Migrate Your Database NOW

## Step 1: Make sure local database is running

```bash
docker-compose up -d
```

## Step 2: Run the migration

```bash
# Set your production database URL (get this from Coolify)
export DATABASE_URL="postgresql://tourworld_user:password@host:5432/tourworld_tourism"

# Run the automated migration script
./scripts/migrate-database.sh
```

That's it! The script will:
1. ✅ Export all data from your local database
2. ✅ Import everything to production
3. ✅ Create a backup file

---

## 📋 What Gets Migrated

- ✅ All tours (with images, itineraries, prices)
- ✅ All hotels
- ✅ All attractions
- ✅ All blogs
- ✅ All galleries
- ✅ All testimonials
- ✅ All bookings
- ✅ All contact inquiries
- ✅ Newsletter subscriptions

**Images:** Already in `public/images/` - they'll be deployed with your code!

---

## 🔍 Get Your Production DATABASE_URL

1. Go to Coolify → Your Application
2. Click on "Environment Variables"
3. Find `DATABASE_URL`
4. Copy the value

It should look like:
```
postgresql://tourworld_user:password@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism
```

---

## ⚡ Alternative: Manual Steps

If you prefer step-by-step:

```bash
# 1. Export from local
npm run db:export > export.json

# 2. Import to production (set DATABASE_URL first!)
export DATABASE_URL="your-production-url"
cat export.json | npm run db:import
```

---

## ✅ After Migration

1. **Push images to git** (if not already):
   ```bash
   git add public/images/
   git commit -m "Add images"
   git push
   ```

2. **Redeploy in Coolify** (images will be included)

3. **Verify** your production site shows all content!

---

## 🆘 Need Help?

See `DATABASE_MIGRATION_GUIDE.md` for detailed instructions and troubleshooting.

