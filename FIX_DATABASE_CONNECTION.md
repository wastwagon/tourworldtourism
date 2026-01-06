# 🔧 Fix Database Connection Error

## ❌ Error: `getaddrinfo EAI_AGAIN`

**Meaning:** The application cannot resolve the database hostname `postgresql-database-jc48w0kggo0s88sog4s8008c`

---

## 🔍 Step 1: Check DATABASE_URL

Run this in your terminal:

```bash
echo $DATABASE_URL
```

**Share the output** - I need to see the exact format.

---

## 🔍 Step 2: Check Database Status

The database hostname might be wrong. In Coolify, try these:

### Option A: Use `localhost` instead of service name

If your database is on the same server, try:

```bash
# Check what DATABASE_URL currently is
echo $DATABASE_URL

# The hostname might need to be 'localhost' instead of the service name
# Or it might need the full container name
```

### Option B: Check Database Container Name

In Coolify:
1. Go to your database resource
2. Check the actual container/service name
3. It might be different from what's in DATABASE_URL

---

## 🔧 Step 3: Fix DATABASE_URL Format

The issue is likely the **hostname** in your DATABASE_URL. Try these formats:

### Format 1: Use `localhost` (if database is on same server)
```
postgresql://tourworld_user:TourWorld2025!Secure@localhost:5432/tourworld_tourism
```

### Format 2: Use actual container name
Check what the database container is actually called in Coolify.

### Format 3: Use internal Docker network name
If services are linked, it might need a different format.

---

## 🎯 Quick Fix - Check Database Connection

Run these commands to diagnose:

```bash
# 1. Check DATABASE_URL
echo $DATABASE_URL

# 2. Try to ping the database hostname
ping -c 1 postgresql-database-jc48w0kggo0s88sog4s8008c || echo "Hostname not resolvable"

# 3. Check if database port is accessible
nc -zv postgresql-database-jc48w0kggo0s88sog4s8008c 5432 || echo "Port not accessible"

# 4. Try with localhost instead
nc -zv localhost 5432 || echo "Localhost port not accessible"
```

---

## 🔧 Solution: Update DATABASE_URL in Coolify

1. **Go to:** Coolify → Your Application → Environment Variables
2. **Find:** `DATABASE_URL`
3. **Check the hostname** - it might need to be:
   - `localhost` (if database is on same server)
   - The actual container name
   - Or a different format

**Share what `echo $DATABASE_URL` shows** and I'll help you fix it!

---

## 📋 Common DATABASE_URL Formats in Coolify

**Format 1 (Service name - might not work):**
```
postgresql://user:pass@postgresql-database-xxx:5432/dbname
```

**Format 2 (localhost - if same server):**
```
postgresql://user:pass@localhost:5432/dbname
```

**Format 3 (Container name):**
```
postgresql://user:pass@container-name:5432/dbname
```

**Format 4 (With port mapping):**
```
postgresql://user:pass@localhost:3000/dbname
```
(If database port is mapped to 3000)

---

## 🆘 What I Need

1. **Output of:** `echo $DATABASE_URL`
2. **Database status** (is it running in Coolify?)
3. **Database port mapping** (what port is it on?)

**Share these and I'll give you the exact fix!** 🚀

