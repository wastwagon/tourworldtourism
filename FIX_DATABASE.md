# 🔧 Fix Database Content Not Showing

## ✅ Frontend is Running!

The issue is that your database needs:
1. **Schema created** (tables don't exist yet)
2. **Data seeded** (database is empty)

---

## 🎯 Quick Fix (2 Steps)

### Step 1: Create Database Tables

**In Coolify:**
1. Go to your application
2. Click **"Terminal"** tab
3. Run this command:
   ```bash
   npx prisma db push --accept-data-loss
   ```
4. Wait for it to complete (takes 30-60 seconds)
5. You should see: `✔ Database synchronized`

---

### Step 2: Add Sample Data (Optional)

**Still in Terminal, run:**
```bash
npm run db:seed
```

This adds sample:
- Tours
- Hotels
- Blogs
- Galleries
- Testimonials

---

## ✅ After Running Commands

1. **Refresh your website** (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
2. **Content should appear!** 🎉

---

## 🔍 If Still Not Working

### Check Application Logs

1. In Coolify → Your Application → **"Logs"** tab
2. Look for errors like:
   - `Can't reach database server`
   - `Connection refused`
   - `relation "tours" does not exist`

### Verify DATABASE_URL

1. Go to: Application → Environment Variables
2. Check `DATABASE_URL` is:
   ```
   postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism
   ```

### Test Database Connection

In Terminal, run:
```bash
npx prisma db pull
```

If this works, database is connected. If it fails, share the error.

---

## 📋 What Each Command Does

**`npx prisma db push`**
- Creates all database tables
- Syncs your Prisma schema to the database
- Creates: tours, hotels, blogs, galleries, bookings, etc.

**`npm run db:seed`**
- Adds sample data to your database
- Makes your website show content
- Optional but recommended for testing

---

## 🆘 Need Help?

Share:
1. **Output** from `npx prisma db push`
2. **Any errors** from Logs tab
3. **What you see** on your website

**Let's get your database working!** 🚀

