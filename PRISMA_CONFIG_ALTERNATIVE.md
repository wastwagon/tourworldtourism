# 🔧 Alternative: JavaScript Config File

If TypeScript config doesn't work, use JavaScript instead:

## Option 1: JavaScript Config (If TypeScript Fails)

```bash
# Create prisma.config.js instead (JavaScript, no compilation needed)
cat > prisma.config.js << 'EOF'
require("dotenv/config");
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

# Try db push
npx prisma db push --accept-data-loss
```

## Option 2: Use DATABASE_URL Directly (Prisma 7.x Alternative)

Prisma 7.x might also accept DATABASE_URL via environment variable:

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# Try with explicit URL flag
npx prisma db push --accept-data-loss --schema=prisma/schema.prisma
```

Try Option 1 first if TypeScript config fails!

