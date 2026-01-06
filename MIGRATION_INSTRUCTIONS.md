# 🚀 Complete Database Migration Instructions

## Current Status
✅ **Export file created**: `local-db-export-final.json` (223KB)  
✅ **Contains**: 12 tours, 5 hotels, 18 attractions, 9 blogs, 3 galleries, 5 testimonials, 1 booking, 1 contact inquiry  
⚠️ **Issue**: Production database is internal to Coolify's Docker network - cannot access from local machine

## Solution: Run Migration in Coolify Terminal

### Step 1: Upload Export File to Coolify

**Option A: Via Coolify File Manager**
1. Go to: `http://31.97.57.75:8000`
2. Navigate to: Projects → "My first project" → "production" → Your Application
3. Click: "Persistent Storage" or file browser
4. Upload: `local-db-export-final.json`

**Option B: Via Coolify Terminal (Copy/Paste)**
1. Go to: Your Application → "Terminal" tab
2. Create the file: `nano local-db-export-final.json`
3. Copy the contents of `local-db-export-final.json` from your local machine
4. Paste into the terminal editor
5. Save and exit (Ctrl+X, then Y, then Enter)

### Step 2: Run Import in Coolify Terminal

In Coolify Terminal, run:

```bash
# The DATABASE_URL is already set in the environment
cat local-db-export-final.json | node scripts/import-to-production.js
```

### Step 3: Verify Import

Check what was imported:

```bash
# In Coolify terminal
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count()]).then(([t,h,a,b])=>console.log('✅ Tours:',t,'Hotels:',h,'Attractions:',a,'Blogs:',b));"
```

Expected results:
- Tours: 12
- Hotels: 5
- Attractions: 18
- Blogs: 9

---

## 📋 What Gets Migrated

- ✅ All tours (12) - with images, itineraries, prices
- ✅ All hotels (5)
- ✅ All attractions (18)
- ✅ All blogs (9)
- ✅ All galleries (3)
- ✅ All testimonials (5)
- ✅ All bookings (1)
- ✅ All contact inquiries (1)
- ✅ Newsletter subscriptions

**Note**: Images are already in `public/images/` and will be deployed with your code.

---

## 🔍 After Migration

1. **Check your production site**: `http://tourworldtourism.com` (once DNS propagates)
2. **Verify all content is showing**
3. **Check that images are loading correctly**
4. **Test all features** (tours, bookings, etc.)

---

## 🆘 Troubleshooting

### "Cannot find module '@prisma/client'"
Run in Coolify terminal:
```bash
npm install
npx prisma generate
```

### "Export file not found"
Make sure you uploaded `local-db-export-final.json` to Coolify first.

### Import errors
Check the error messages - some data may have imported successfully. Verify what's in the database using the verification command above.

---

**Ready to migrate?** Upload the export file to Coolify and run the import command in Coolify Terminal!

