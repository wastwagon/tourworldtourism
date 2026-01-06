# 🔧 Fix Build Error: Remove url from schema.prisma

## ❌ Build Error:

```
error: The datasource property `url` is no longer supported in schema files.
--> prisma/schema.prisma:10
  |
9 | provider = "postgresql"
10 | url = env("DATABASE_URL")
```

**Problem:** Prisma 7.x doesn't allow `url` in `schema.prisma` - it should only be in `prisma.config.ts`.

---

## ✅ Fix Applied Locally

I've removed the `url` line from `prisma/schema.prisma`. Now you need to:

### Step 1: Push to GitHub

```bash
# Push the fix to GitHub
git push origin main
```

Or use GitHub Desktop to push the commit.

---

## ✅ Verify Files Are Correct

**prisma/schema.prisma** should have:
```prisma
datasource db {
  provider = "postgresql"
}
```
(No `url` line!)

**prisma.config.ts** should have:
```typescript
datasource: {
  url: process.env["DATABASE_URL"],
}
```
(This is correct!)

---

## ✅ After Pushing

1. **Coolify will automatically detect the new commit**
2. **Redeploy** (or wait for auto-deploy)
3. **Build should succeed** now!

**Push the fix to GitHub and redeploy!** 🚀

