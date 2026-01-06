# 🔧 Fix "Connection terminated unexpectedly"

## ❌ Error: Connection terminated unexpectedly

**Meaning:** Connection starts but then drops. Usually means:
1. Database tables don't exist yet (need migrations)
2. Database connection pool issue
3. Database not fully ready

---

## 🔧 Solution: Create Tables First

Run migrations **before** seeding:

```bash
# 1. Create database tables first
npx prisma db push --accept-data-loss

# 2. Wait for it to complete (should see "Database synchronized")

# 3. Then run seed script
node seed-now.js
```

---

## 📋 Complete Sequence

Run these commands in order:

```bash
# Step 1: Create tables
npx prisma db push --accept-data-loss

# Step 2: Verify tables exist
npx prisma db pull

# Step 3: Seed database
node seed-now.js
```

---

## 🔍 If db push fails

Check if DATABASE_URL is correct:

```bash
echo $DATABASE_URL
```

Should be: `postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism`

---

## ✅ Expected Output

After `npx prisma db push --accept-data-loss`:
- `✔ Database synchronized`
- `The following models have been created:`
- Lists all tables (tours, hotels, blogs, etc.)

Then `node seed-now.js` should work!

---

## 🎯 Quick Fix

**Run this first:**
```bash
npx prisma db push --accept-data-loss
```

**Then run:**
```bash
node seed-now.js
```

**The tables need to exist before you can insert data!** 🚀

