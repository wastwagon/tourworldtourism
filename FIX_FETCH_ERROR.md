# 🔧 Fix: "Failed to fetch tours" Error

## ❌ Issue: Frontend Can't Fetch Data

The website is showing "Error: Failed to fetch tours" - this means the API can't connect to the database.

---

## ✅ Solution: Check and Fix DATABASE_URL

### Step 1: Verify DATABASE_URL in Coolify

1. **Go to Coolify → Your Application → Environment Variables**
2. **Check if `DATABASE_URL` exists**
3. **If it doesn't exist or is wrong, set it to:**
   ```
   postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism
   ```
4. **Save** and **restart the application**

---

### Step 2: Check Application Logs

1. **Go to Coolify → Your Application → Logs**
2. **Look for errors like:**
   - `Can't reach database server`
   - `Connection refused`
   - `DATABASE_URL is not set`
   - `relation "tours" does not exist`

---

### Step 3: Verify Database Connection in Container

If you have terminal access, test the connection:

```bash
# In Coolify terminal, test connection
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism"
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT COUNT(*) FROM tours').then(r=>{console.log('✅ Tours count:',r.rows[0].count);p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"
```

---

## 🎯 Most Likely Cause

The `DATABASE_URL` is not set in Coolify's Environment Variables, so the application can't connect to the database.

**Update DATABASE_URL in Coolify Environment Variables and restart the application!** 🚀

