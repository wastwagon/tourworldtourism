# 🔧 Fix: prisma.config.ts Missing in Container

## ❌ Error: "The datasource.url property is required in your Prisma config file"

**Problem:** `prisma.config.ts` exists locally but isn't copied to the Docker container.

---

## ✅ Quick Fix (Run in Container Terminal)

Create `prisma.config.ts` directly in the container:

```bash
# Create prisma.config.ts in /app
cat > prisma.config.ts << 'EOF'
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
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

# Verify it was created
cat prisma.config.ts

# Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# Now try db push
npx prisma db push --accept-data-loss
```

---

## 🔄 Permanent Fix (For Next Deployment)

The Dockerfile has been updated to copy `prisma.config.ts` to the container. After you push this change, future deployments will include it automatically.

---

## 📋 Complete Sequence

```bash
# 1. Create prisma.config.ts
cat > prisma.config.ts << 'EOF'
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
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

# 2. Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 3. Create tables
npx prisma db push --accept-data-loss

# 4. Seed database
node seed-now.js
```

**Run the commands above in your container terminal!** 🚀

