# 🖥️ Terminal Commands for Coolify

## ✅ Quick Fix for Database Content

You're connected to your application terminal. Run these commands:

---

## Step 1: Check DATABASE_URL

```bash
echo $DATABASE_URL
```

**Expected:** Should show your database connection string  
**If wrong:** Check Environment Variables in Coolify

---

## Step 2: Create Database Tables

```bash
npx prisma db push --accept-data-loss
```

**Wait for:** `✔ Database synchronized`

---

## Step 3: Seed Database (Add Content)

**Option A: Use JavaScript version (Recommended - works without tsx):**
```bash
npm run db:seed:js
```

**Option B: If tsx is available:**
```bash
npm run db:seed
```

**Wait for:** `🎉 Database seeded successfully!`

---

## Step 4: Verify

```bash
# Check if tables exist
npx prisma db pull

# Or check Prisma Studio (might not work in terminal)
npx prisma studio
```

---

## 🔧 If Commands Fail

### Error: "tsx: not found"
**Solution:** Use `npm run db:seed:js` instead

### Error: "DATABASE_URL not set"
**Solution:** 
1. Go to Coolify → Application → Environment Variables
2. Add/check `DATABASE_URL`

### Error: "Can't reach database server"
**Solution:**
1. Check database is running (Coolify → Database → Status)
2. Verify `DATABASE_URL` hostname matches database service name

---

## 📋 Complete Command Sequence

Copy and paste these one by one:

```bash
# 1. Check connection
echo $DATABASE_URL

# 2. Create tables
npx prisma db push --accept-data-loss

# 3. Add sample data
npm run db:seed:js

# 4. Done! Refresh your website
```

---

## ✅ Success Indicators

After running commands, you should see:
- ✅ `Database synchronized`
- ✅ `Database seeded successfully!`
- ✅ Your website shows tours, hotels, blogs

**Try `npm run db:seed:js` now!** 🚀

