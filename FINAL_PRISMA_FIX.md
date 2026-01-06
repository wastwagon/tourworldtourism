# 🔧 Final Fix: Prisma Config Module

## ✅ Solution 1: Install Prisma Locally (Recommended)

```bash
# 1. Remove broken config files
rm -f prisma.config.ts prisma.config.js

# 2. Install prisma locally (needed for prisma/config module)
npm install prisma@^7.2.0

# 3. Create JavaScript config (now prisma/config will be available)
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

# 4. Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 5. Create tables
npx prisma db push --accept-data-loss
```

---

## ✅ Solution 2: Add URL to schema.prisma (Simpler)

If Prisma 7.x accepts url in schema when no config exists:

```bash
# 1. Remove config files
rm -f prisma.config.ts prisma.config.js

# 2. Add url to schema.prisma
sed -i '/provider = "postgresql"/a\  url      = env("DATABASE_URL")' prisma/schema.prisma

# 3. Verify it was added
cat prisma/schema.prisma | grep -A 3 "datasource"

# 4. Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 5. Create tables
npx prisma db push --accept-data-loss
```

---

## 🎯 Try Solution 1 First!

**Run Solution 1 commands in your container terminal!** 🚀

