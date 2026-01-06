# ✅ Use Correct Database Connection

## 🔍 What I Found:

1. **Ports Mappings:** `3000:5432` - Database port 5432 is mapped to port 3000
2. **Postgres URL (internal):** Shows the correct internal hostname (starts with `jc48w0kggo0s88...`)
3. **Username:** `postgres` (shown in General tab)
4. **Initial Database:** `postgres`

---

## ✅ Solution: Use Internal Hostname

### Step 1: Get the Full Internal Hostname

1. **Click the eye icon** next to "Postgres URL (internal)" to reveal the full URL
2. **Copy the hostname** (the part after `@` and before `:5432` or `:3000`)
3. It should look like: `jc48w0kggo0s88sog4s8008c` (or similar)

### Step 2: Use Correct DATABASE_URL

The hostname in the internal URL is what you need. Try:

```bash
# Use the hostname from "Postgres URL (internal)" (the part after @)
# Replace <hostname> with the actual hostname from the internal URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@<hostname>:3000/tourworld_tourism"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"
```

---

## 🔍 Important Notes:

1. **Hostname:** Use the hostname from "Postgres URL (internal)", NOT `localhost`
2. **Port:** Use `3000` (as shown in Ports Mappings)
3. **Username/Database:** If `tourworld_user` and `tourworld_tourism` don't exist, you may need to:
   - Use `postgres` user and `postgres` database first
   - Or create the user/database

---

## 🎯 Quick Test with postgres User

If the above doesn't work, try with the default `postgres` user:

```bash
# Get the full internal URL (click eye icon to reveal password)
# Then use that exact URL, but replace the database name if needed
export DATABASE_URL="postgresql://postgres:<password-from-internal-url>@<hostname>:3000/postgres"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"
```

**Click the eye icon to reveal the full internal URL and share the hostname!** 🚀

