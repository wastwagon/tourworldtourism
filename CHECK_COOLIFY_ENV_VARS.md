# 🔍 Check Coolify Environment Variables

## ❌ Issue: Database Connection Failing

The `DATABASE_URL` we're setting manually might be wrong. Coolify should have the correct one already configured.

---

## ✅ Solution: Use Coolify's DATABASE_URL

### Step 1: Check Environment Variables in Coolify

1. **Go to your application in Coolify**
2. **Click on "Environment Variables"** (or "Variables" tab)
3. **Look for `DATABASE_URL`** - it should already be set by Coolify
4. **Copy the exact value**

### Step 2: Use That DATABASE_URL

```bash
# Check what DATABASE_URL is currently set in Coolify
# (It should be visible in the Environment Variables section)

# If you see it there, use that exact value:
export DATABASE_URL="<paste-the-exact-value-from-coolify>"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"

# If connection works, create tables
npx prisma db push --accept-data-loss
```

---

## 🔍 Alternative: Check if Database is Linked

In Coolify:
1. Go to your **application**
2. Check if there's a **"Linked Resources"** or **"Database"** section
3. Make sure the database is **linked** to your application
4. If not linked, **link it** - this will automatically set `DATABASE_URL`

---

## 🎯 Most Likely Issue

The `DATABASE_URL` in Coolify's environment variables is probably different from what we're manually setting. **Use the one from Coolify's UI!**

**Check Coolify's Environment Variables and use that DATABASE_URL!** 🚀

