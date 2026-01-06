# 🔧 Fix Prisma DATABASE_URL Error

## ❌ Error: "The datasource.url property is required"

**Meaning:** Prisma can't find DATABASE_URL when running `db push`.

---

## 🔧 Solution: Set DATABASE_URL Before Running

Run this command with DATABASE_URL explicitly set:

```bash
# Set DATABASE_URL and run db push in one command
DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism" npx prisma db push --accept-data-loss
```

---

## 📋 Complete Sequence

Run these commands:

```bash
# 1. Set DATABASE_URL (make sure it's exported)
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 2. Verify it's set
echo $DATABASE_URL

# 3. Create tables
npx prisma db push --accept-data-loss

# 4. Seed database
node seed-now.js
```

---

## 🔍 Check Prisma Schema

The schema should have:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

If it's missing `url = env("DATABASE_URL")`, that's the issue.

---

## ✅ Quick Fix

**Run this:**
```bash
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"
npx prisma db push --accept-data-loss
```

**Then:**
```bash
node seed-now.js
```

---

## 🆘 If Still Not Working

Check if Prisma schema has the url:

```bash
cat prisma/schema.prisma | grep -A 3 "datasource"
```

Should show:
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Run the export command first, then db push!** 🚀

