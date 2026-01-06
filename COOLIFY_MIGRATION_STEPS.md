# 🚀 Complete Database Migration in Coolify

## Current Status
✅ Application is running  
✅ Database is connected  
⚠️ Database is empty - needs migration  

## Quick Migration Steps

### Step 1: Upload Export File to Coolify

**Option A: Via Coolify Terminal (Recommended)**

1. **Go to Coolify**: `http://31.97.57.75:8000`
2. **Navigate to**: Projects → "My first project" → "production" → Your Application
3. **Click**: "Terminal" tab
4. **Create the file**:
   ```bash
   nano local-db-export-final.json
   ```
5. **Copy contents** from your local `local-db-export-final.json` file
6. **Paste** into the terminal editor
7. **Save**: Press `Ctrl+X`, then `Y`, then `Enter`

**Option B: Via File Upload (if available)**
- Use Coolify's file upload feature if available
- Upload `local-db-export-final.json`

### Step 2: Run Import Command

In Coolify Terminal, run:

```bash
cat local-db-export-final.json | node scripts/import-to-production.js
```

### Step 3: Verify Import

Check what was imported:

```bash
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count(),p.gallery.count()]).then(([t,h,a,b,g])=>console.log('✅ Tours:',t,'Hotels:',h,'Attractions:',a,'Blogs:',b,'Galleries:',g));"
```

**Expected Results:**
- Tours: 12
- Hotels: 5
- Attractions: 18
- Blogs: 9
- Galleries: 3 (with 83 total images)

### Step 4: Verify Site

After migration:
1. **Check your site**: `http://tourworldtourism.com` (once DNS/Traefik routes correctly)
2. **Verify content is showing**
3. **Check images are loading**

---

## 📋 What Gets Migrated

- ✅ 12 tours (with images, itineraries, prices)
- ✅ 5 hotels
- ✅ 18 attractions
- ✅ 9 blogs
- ✅ 3 galleries (83 total gallery images)
- ✅ 5 testimonials
- ✅ 1 booking
- ✅ 1 contact inquiry
- ✅ Newsletter subscriptions

**Note**: Images are already in `public/images/` and deployed with your code.

---

## 🆘 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm install
npx prisma generate
```

### "Export file not found"
Make sure you uploaded `local-db-export-final.json` to Coolify first.

### Import errors
Some data may have imported successfully. Check the verification command to see what's in the database.

---

## ✅ After Migration

Your site should show:
- All tours on the homepage
- All hotels
- All attractions
- All blogs
- All gallery images
- All testimonials

**Ready to migrate?** Upload the export file and run the import command!

