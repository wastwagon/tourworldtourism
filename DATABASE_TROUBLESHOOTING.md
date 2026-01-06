# 🔧 Database Connection Troubleshooting

## ✅ Good News!

Your **frontend is running!** 🎉  
The issue is just database connection/data.

---

## 🔍 Common Issues & Fixes

### Issue 1: Database Not Connected

**Check:**
1. In Coolify → Your Application → **"Logs"** tab
2. Look for database connection errors
3. Check if you see: `Can't reach database server` or `Connection refused`

**Fix:**
- Verify `DATABASE_URL` is correct in Environment Variables
- Make sure database service name matches: `postgresql-database-jc48w0kggo0s88sog4s8008c`

---

### Issue 2: Database Needs Migrations

**Problem:** Database exists but schema isn't created yet.

**Fix:**
1. In Coolify → Your Application → **"Terminal"** tab
2. Run:
   ```bash
   npx prisma db push --accept-data-loss
   ```
3. Wait for it to complete
4. Refresh your website

---

### Issue 3: Database is Empty

**Problem:** Database connected but no data.

**Fix:**
1. In Coolify → Your Application → **"Terminal"** tab
2. Run:
   ```bash
   npm run db:seed
   ```
3. This will add sample tours, hotels, blogs, etc.

---

### Issue 4: Wrong DATABASE_URL Format

**Check your DATABASE_URL in Coolify:**
- Go to: Application → Environment Variables
- Verify it's exactly:
  ```
  postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism
  ```

**If using service connection:**
- The host might be just: `postgresql-database-jc48w0kggo0s88sog4s8008c` (without port)
- Or: `postgresql-database-jc48w0kggo0s88sog4s8008c:5432`

---

## 🎯 Step-by-Step Fix

### Step 1: Check Application Logs

1. In Coolify → Your Application → **"Logs"** tab
2. Look for errors related to:
   - Database connection
   - Prisma
   - `DATABASE_URL`

**Share the errors you see** and I'll help fix them!

---

### Step 2: Run Database Migrations

1. In Coolify → Your Application → **"Terminal"** tab
2. Run:
   ```bash
   npx prisma db push --accept-data-loss
   ```
3. This creates all tables (tours, hotels, blogs, galleries, etc.)

---

### Step 3: Seed Database (Add Sample Data)

1. Still in Terminal
2. Run:
   ```bash
   npm run db:seed
   ```
3. This adds sample content

---

### Step 4: Verify Connection

Check logs again - should see:
- ✅ Database connected
- ✅ Tables created
- ✅ Data seeded

---

## 🔍 Quick Diagnostic Commands

Run these in your application Terminal in Coolify:

**Check if database is accessible:**
```bash
npx prisma db pull
```

**Check Prisma connection:**
```bash
npx prisma studio
```
(This opens a database viewer - but might not work in Coolify terminal)

**Check environment variables:**
```bash
echo $DATABASE_URL
```

---

## 📋 Checklist

- [ ] Check application logs for errors
- [ ] Verify DATABASE_URL is correct
- [ ] Run `npx prisma db push --accept-data-loss`
- [ ] Run `npm run db:seed` (optional - adds sample data)
- [ ] Refresh website
- [ ] Check if content appears

---

## 🆘 What to Share

If still not working, share:
1. **Error messages** from Logs tab
2. **Output** from `npx prisma db push`
3. **DATABASE_URL** format (you can mask the password)

**Let's get your database connected!** 🚀

