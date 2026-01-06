# 🔧 Fix ECONNREFUSED Error

## ❌ Current Error

**Error:** `ECONNREFUSED` on `localhost:5432`

**Meaning:** `localhost` resolves, but port 5432 isn't accessible or the database isn't listening there.

---

## 🔍 Diagnosis Steps

Run these commands to find the correct port:

```bash
# 1. Check what ports are listening
netstat -tuln | grep 5432 || ss -tuln | grep 5432

# 2. Check if database is accessible on different ports
nc -zv localhost 3000 2>&1
nc -zv localhost 5432 2>&1

# 3. Check environment variables for database port
env | grep -i postgres
env | grep -i database

# 4. Check Docker network (if available)
cat /etc/hosts | grep -i postgres
```

---

## 🔧 Solution: Check Database Port Mapping

The database port mapping might be different. Earlier we saw it was `3000:5432`.

### Try Port 3000 Instead:

```bash
# Test with port 3000
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism"

# Test connection
node -e "const {PrismaClient}=require('@prisma/client');const {Pool}=require('pg');const {PrismaPg}=require('@prisma/adapter-pg');const p=new Pool({connectionString:process.env.DATABASE_URL});const a=new PrismaPg(p);const pr=new PrismaClient({adapter:a});pr.\$connect().then(()=>{console.log('✅ Connected!');pr.\$disconnect();}).catch(e=>{console.error('❌',e.message);pr.\$disconnect();});"
```

---

## 🎯 Most Likely Fix

**If database port mapping is `3000:5432`, use:**

```
postgresql://tourworld_user:TourWorld2025!Secure@localhost:3000/tourworld_tourism
```

**Update DATABASE_URL in Coolify to use port 3000 instead of 5432!**

---

## 📋 Steps to Fix

1. **Check database port mapping** in Coolify:
   - Go to Database → Configuration → Network
   - Check "Ports Mappings"
   - Note the external port (likely `3000`)

2. **Update DATABASE_URL** in Coolify:
   - Application → Environment Variables → DATABASE_URL
   - Change port from `5432` to `3000` (or whatever the mapping shows)
   - Save

3. **Restart application**

4. **Run seed again**

---

## 🔍 Alternative: Use Docker Network Name

If port mapping doesn't work, try the container name directly:

```bash
# Try with just the container ID (without postgresql-database- prefix)
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism"
```

---

## 🆘 What I Need

1. **Database port mapping** (from Database → Configuration → Network)
2. **Result of:** `netstat -tuln | grep 5432` or `ss -tuln | grep 5432`
3. **Result of:** `nc -zv localhost 3000`

**Share these and I'll give you the exact DATABASE_URL to use!** 🚀

