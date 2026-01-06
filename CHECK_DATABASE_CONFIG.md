# 🔍 Check Database Configuration

## ✅ You're in the Right Place!

You're viewing the database configuration. Now let's find the correct connection details.

---

## 📋 Steps to Find Correct DATABASE_URL

### Step 1: Check "General" Tab

1. **Click on "General"** in the left sub-menu (under Configuration)
2. **Look for:**
   - Port mapping (e.g., `5432:5432` or `3000:5432`)
   - Internal port (should be `5432` for PostgreSQL)
   - Connection string or connection details

### Step 2: Check Application's Linked Resources

1. **Go back to your application** (not the database)
2. **Look for "Linked Resources"** or **"Database"** section
3. **Check if this database is linked**
4. If linked, Coolify should show the correct `DATABASE_URL` there

### Step 3: Check Database "Environment Variables" Tab

1. **In the database configuration** (where you are now)
2. **Click "Environment Variables"** in the left sub-menu
3. **Look for connection-related variables** like:
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - Or a connection string

---

## 🎯 Most Likely Fix

The database port is probably `5432`, not `3000`. Try this:

```bash
# Use port 5432 (standard PostgreSQL port)
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"
```

**Check the "General" tab and share what port configuration you see!** 🚀

