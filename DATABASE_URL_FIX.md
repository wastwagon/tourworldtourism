# 🔧 Fix DATABASE_URL Connection Issue

## ❌ Current Problem

**DATABASE_URL:** `postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism`

**Error:** `getaddrinfo EAI_AGAIN` - Cannot resolve hostname

**Reason:** The service name `postgresql-database-jc48w0kggo0s88sog4s8008c` is not resolving from within the application container.

---

## 🔍 Diagnosis Steps

Run these in your terminal to find the correct connection:

```bash
# 1. Check if localhost works
nc -zv localhost 5432

# 2. Check what ports are listening
netstat -tuln | grep 5432 || ss -tuln | grep 5432

# 3. Check Docker network
cat /etc/hosts | grep postgresql

# 4. Try to find database container
docker ps | grep postgres || echo "Docker commands not available"
```

---

## 🔧 Solution Options

### Option 1: Use `localhost` (Most Likely)

If database is on the same server, update DATABASE_URL to:

```
postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism
```

**To update:**
1. Go to Coolify → Your Application → Environment Variables
2. Find `DATABASE_URL`
3. Change hostname from `postgresql-database-jc48w0kggo0s88sog4s8008c` to `localhost`
4. Save
5. Restart application

---

### Option 2: Check Database Port Mapping

In Coolify:
1. Go to Database → Configuration → Network
2. Check "Ports Mappings"
3. If it shows `3000:5432`, use `localhost:3000` instead

---

### Option 3: Use Internal Docker Network Name

If services are linked, try:

```
postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism
```

(Without the `postgresql-database-` prefix)

---

## 🎯 Quick Test

Try updating DATABASE_URL temporarily in terminal:

```bash
# Test with localhost
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism"

# Try connection
node -e "const {PrismaClient}=require('@prisma/client');const {Pool}=require('pg');const {PrismaPg}=require('@prisma/adapter-pg');const p=new Pool({connectionString:process.env.DATABASE_URL});const a=new PrismaPg(p);const pr=new PrismaClient({adapter:a});pr.\$connect().then(()=>{console.log('✅ Connected!');pr.\$disconnect();}).catch(e=>{console.error('❌',e.message);pr.\$disconnect();});"
```

If this works, update it in Coolify Environment Variables!

---

## 📋 Most Likely Fix

**Change DATABASE_URL from:**
```
postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism
```

**To:**
```
postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism
```

**Then restart your application in Coolify!**

---

## 🆘 Need Help?

Run the test command above and share the result. If `localhost` works, that's your fix! 🚀

