# 🔧 Fix: localhost:3000 Won't Work in Docker

## ❌ Problem: `localhost:3000` in DATABASE_URL

In Docker containers, `localhost` refers to the container itself, not other containers. The database is in a different container, so we need the correct hostname and port.

---

## ✅ Solution: Check Database Configuration

### Step 1: Check Database Service in Coolify

1. **Go to your database service** (not the application)
2. **Check the port mapping** - should be something like `5432:5432` or `3000:5432`
3. **Note the internal port** (usually `5432` for PostgreSQL)

### Step 2: Check if Database is Linked

1. **Go to your application**
2. **Look for "Linked Resources"** or **"Database"** section
3. **Make sure the database is linked** to your application
4. If linked, Coolify should automatically set the correct `DATABASE_URL`

### Step 3: Try Correct DATABASE_URL

Based on Coolify's typical setup, try:

```bash
# Option 1: Use service name with port 5432 (standard PostgreSQL)
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"

# Option 2: If database has a different internal name, check Coolify's database service
# The hostname should match the database service name exactly
```

---

## 🔍 What to Check in Coolify

1. **Database Service:**
   - What's the service name?
   - What port is it exposing internally? (should be 5432)
   - Is it running?

2. **Application → Linked Resources:**
   - Is the database listed as a linked resource?
   - If not, link it - this will auto-configure DATABASE_URL

---

## 🎯 Most Likely Fix

The port should be `5432` (PostgreSQL default), not `3000`. Try:

```bash
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism"
```

**Check your database service configuration in Coolify and share what you find!** 🚀

