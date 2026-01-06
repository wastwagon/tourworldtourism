# 🔧 Fix: Database Connection Issue

## ✅ Good News: Prisma Config Works!

The error changed - now it's a database connection issue, not a config issue.

---

## 🔍 Troubleshooting Steps

### Step 1: Verify DATABASE_URL

```bash
# Check current DATABASE_URL
echo $DATABASE_URL
```

### Step 2: Test Database Connection

```bash
# Test if we can reach the database
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"
```

### Step 3: Try Different Hostnames

In Coolify, containers might need to use the service name instead of `localhost`:

```bash
# Option A: Try the service name (from earlier, it was postgresql-database-...)
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism"

# Option B: Try localhost with port 5432 (standard PostgreSQL port)
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism"

# Option C: Check what port the database is actually on
# (In Coolify, check the database service's port mapping)
```

### Step 4: Check Database Service Status

In Coolify dashboard:
1. Go to your database service
2. Check if it's running
3. Check the port mapping (might be `5432:5432` or `3000:5432`)

---

## 🎯 Most Likely Fix

The database might need the service name instead of `localhost`:

```bash
# Use the database service name
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism"

# Try db push again
npx prisma db push --accept-data-loss
```

**Run the test command first to see what works!** 🚀

