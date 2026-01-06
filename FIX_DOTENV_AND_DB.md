# 🔧 Fix: dotenv Missing + Database Connection

## ❌ Issues:
1. `dotenv/config` module not found
2. Database connection terminated (tables don't exist yet)

---

## ✅ Solution: Use JavaScript Config Without dotenv

Prisma will read `DATABASE_URL` from environment variables automatically:

```bash
# Create JavaScript config (no dotenv needed)
cat > prisma.config.js << 'EOF'
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
EOF

# Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# Verify DATABASE_URL is set
echo $DATABASE_URL

# Now try db push
npx prisma db push --accept-data-loss
```

---

## 📋 Complete Sequence

```bash
# 1. Remove TypeScript config (if exists)
rm -f prisma.config.ts

# 2. Create JavaScript config (no dotenv dependency)
cat > prisma.config.js << 'EOF'
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
EOF

# 3. Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 4. Verify it's set
echo "DATABASE_URL: $DATABASE_URL"

# 5. Create tables
npx prisma db push --accept-data-loss

# 6. Seed database (after tables are created)
node seed-now.js
```

**Run these commands!** 🚀

