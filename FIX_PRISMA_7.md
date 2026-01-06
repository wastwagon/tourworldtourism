# 🔧 Fix Prisma 7.x Configuration

## ❌ Error: "The datasource property `url` is no longer supported"

**Meaning:** Prisma 7.x changed - `url` should NOT be in `schema.prisma`, only in `prisma.config.ts`

---

## ✅ Solution: Remove url from schema.prisma

The schema file should only have:
```prisma
datasource db {
  provider = "postgresql"
}
```

The `url` is already in `prisma.config.ts` (which is correct for Prisma 7.x).

---

## 🔧 Fix in Container

Run this in your terminal:

```bash
# Remove the duplicate url lines from schema
sed -i '/url.*env("DATABASE_URL")/d' prisma/schema.prisma

# Verify it's fixed (should only show provider, no url)
cat prisma/schema.prisma | grep -A 2 "datasource"

# Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# Now try db push
npx prisma db push --accept-data-loss
```

---

## 📋 Complete Fix Sequence

```bash
# 1. Fix schema (remove url lines)
sed -i '/url.*env("DATABASE_URL")/d' prisma/schema.prisma

# 2. Verify (should only show "provider = postgresql")
cat prisma/schema.prisma | grep -A 2 "datasource"

# 3. Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 4. Create tables
npx prisma db push --accept-data-loss

# 5. Seed database
node seed-now.js
```

---

## ✅ Expected Output

After fixing schema:
```
datasource db {
  provider = "postgresql"
}
```

(No `url` line - that's correct for Prisma 7.x!)

**Run the fix command and try again!** 🚀

