# 🚀 Import Database in Coolify - Simple Method

After deployment, the import script is available. Just run:

## Quick Import (After Deployment)

**In Coolify Terminal, run:**

```bash
npm run db:import:coolify
```

**OR directly:**

```bash
./scripts/import-dump-in-coolify.sh
```

## What It Does

1. ✅ Checks if SQL dump file exists
2. ✅ If not, looks for base64 file and decodes it
3. ✅ Imports into production database
4. ✅ Verifies import with record counts

## Manual Steps (If Script Doesn't Work)

### Step 1: Upload Base64 File

Upload `tourworld-dump-20260106-132703.sql.base64.txt` to `/app/` in Coolify.

### Step 2: Create SQL File

```bash
node scripts/create-dump-from-base64.js
```

### Step 3: Import

```bash
./scripts/import-dump-in-coolify.sh
```

## Expected Results

After import:
- ✅ 12 Tours
- ✅ 5 Hotels
- ✅ 18 Attractions
- ✅ 9 Blogs
- ✅ 3 Galleries (88 images)
- ✅ 5 Testimonials

---

**That's it!** After you push and deploy, just run the script in Coolify Terminal.

