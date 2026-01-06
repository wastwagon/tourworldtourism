# 🔄 Database Migration via Coolify Terminal

The production database hostname (`jc48w0kggo0s88sog4s8oo8c`) is internal to Coolify's Docker network and not accessible from your local machine.

## Solution: Run Migration from Coolify Terminal

### Step 1: Export from Local (Already Done ✅)

You already have the export file: `local-db-export-clean.json`

### Step 2: Upload Export File to Coolify

1. **Go to Coolify**: `http://31.97.57.75:8000`
2. **Navigate to**: Projects → "My first project" → "production" → Your Application
3. **Click**: "Terminal" tab
4. **Upload the export file** or copy its contents

### Step 3: Run Import in Coolify Terminal

In the Coolify terminal, run:

```bash
# The DATABASE_URL is already set in the environment
# Upload your local-db-export-clean.json file first

# Then run:
cat local-db-export-clean.json | node scripts/import-to-production.js
```

### Alternative: Use Coolify's File Manager

1. **Go to**: Your Application → "Persistent Storage" or file browser
2. **Upload**: `local-db-export-clean.json`
3. **Use Terminal** to run the import script

---

## 📋 What Was Already Imported

Based on the partial import, some data may have been imported before the connection errors. Check your production site to see what's there.

---

## 🔍 Verify Import

After running the import in Coolify terminal, check:

```bash
# In Coolify terminal
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count()]).then(([t,h,a])=>console.log('Tours:',t,'Hotels:',h,'Attractions:',a));"
```

---

## 🆘 If Still Having Issues

The database connection string might need to use `localhost` or `127.0.0.1` when connecting from within the Coolify container. Check the actual DATABASE_URL in Coolify Environment Variables - it might be different when accessed from inside the container.

