# 🔧 Fix: Use schema.prisma URL (No Config File Needed)

## ✅ Solution: Add URL Back to schema.prisma

Prisma 7.x will accept `url` in `schema.prisma` if there's no config file. Let's remove the config file and add url to schema:

```bash
# 1. Remove config files (they're causing issues)
rm -f prisma.config.ts prisma.config.js

# 2. Add url back to schema.prisma
cat >> prisma/schema.prisma << 'EOF'

# Add url to datasource (temporary fix for Prisma 7.x)
EOF

# Actually, let's use sed to add it properly
sed -i '/datasource db {/,/}/ { /provider = "postgresql"/a\
  url      = env("DATABASE_URL")
}' prisma/schema.prisma

# 3. Verify it was added
cat prisma/schema.prisma | grep -A 3 "datasource"

# 4. Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 5. Create tables
npx prisma db push --accept-data-loss
```

---

## ✅ Simpler: Manual Edit

```bash
# 1. Remove config files
rm -f prisma.config.ts prisma.config.js

# 2. Edit schema.prisma manually
# Change this:
# datasource db {
#   provider = "postgresql"
# }
# 
# To this:
# datasource db {
#   provider = "postgresql"
#   url      = env("DATABASE_URL")
# }

# 3. Use sed to add it:
sed -i '/provider = "postgresql"/a\  url      = env("DATABASE_URL")' prisma/schema.prisma

# 4. Verify
cat prisma/schema.prisma | head -12

# 5. Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# 6. Create tables
npx prisma db push --accept-data-loss
```

**Try this approach!** 🚀

