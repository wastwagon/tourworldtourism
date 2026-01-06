# 🔧 Update DATABASE_URL in Coolify

## Current DATABASE_URL (Not Working)
```
postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism
```

**Problem:** Hostname `postgresql-database-jc48w0kggo0s88sog4s8008c` is not resolving.

---

## ✅ Solution: Update to Use `localhost`

### Step 1: Test First (In Terminal)

Run this to test if localhost works:

```bash
# Test with localhost
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism"

# Try to connect
node -e "const {PrismaClient}=require('@prisma/client');const {Pool}=require('pg');const {PrismaPg}=require('@prisma/adapter-pg');const p=new Pool({connectionString:process.env.DATABASE_URL});const a=new PrismaPg(p);const pr=new PrismaClient({adapter:a});pr.\$connect().then(()=>{console.log('✅ Connected!');pr.\$disconnect();}).catch(e=>{console.error('❌',e.message);pr.\$disconnect();});"
```

**If this works**, proceed to Step 2.

---

### Step 2: Update in Coolify

1. **Go to:** Coolify → Your Application (`wastwagon/tourworldtourism:main-...`)
2. **Click:** "Environment Variables" tab (left sidebar)
3. **Find:** `DATABASE_URL` variable
4. **Click:** "Update" button
5. **Change the value to:**
   ```
   postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism
   ```
6. **Click:** "Save" or "Update"
7. **Restart** your application (click "Restart" or "Deploy")

---

### Step 3: Test Again

After restart, run:

```bash
node seed-now.js
```

---

## 🔍 Alternative: Check Database Port Mapping

If `localhost:5432` doesn't work:

1. **Go to:** Coolify → Your Database → Configuration → Network
2. **Check:** "Ports Mappings"
3. **If it shows:** `3000:5432` (or similar)
4. **Use:** `localhost:3000` instead of `localhost:5432`

**Updated DATABASE_URL would be:**
```
postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism
```

---

## 📋 Quick Checklist

- [ ] Test `localhost` connection in terminal
- [ ] Update `DATABASE_URL` in Coolify Environment Variables
- [ ] Change hostname to `localhost`
- [ ] Save changes
- [ ] Restart application
- [ ] Run `node seed-now.js` again
- [ ] Verify content appears on website

---

## 🎯 Most Likely Fix

**Change DATABASE_URL from:**
```
postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism
```

**To:**
```
postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism
```

**Then restart your application!**

---

## 🆘 If Still Not Working

Share:
1. Result of the test command
2. Database port mapping (from Database → Configuration → Network)
3. Any error messages

**Let's get this fixed!** 🚀

