# ✅ Correct Database Connection Details

## 🔍 Found Information:

- **Hostname:** `jc48w0kggo0s88sog4s8oo8c`
- **Port (from app container):** `3000` (mapped from internal 5432)
- **Username:** `postgres`
- **Password:** `djGChyScbr4zMfmQDqiyK7GtkkPzKpb5uUBLcZDfnrT1xOQ3hwWPe1gYPjGyInTQ`
- **Database:** `postgres`

---

## ✅ Step 1: Test Connection with postgres User

```bash
# Use the correct hostname and port 3000
export DATABASE_URL="postgresql://postgres:djGChyScbr4zMfmQDqiyK7GtkkPzKpb5uUBLcZDfnrT1xOQ3hwWPe1gYPjGyInTQ@jc48w0kggo0s88sog4s8oo8c:3000/postgres"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"
```

---

## ✅ Step 2: Create tourworld_user and tourworld_tourism Database

If connection works, create the proper user and database:

```bash
# Connect and create user/database
node -e "
const {Pool}=require('pg');
const p=new Pool({connectionString:'postgresql://postgres:djGChyScbr4zMfmQDqiyK7GtkkPzKpb5uUBLcZDfnrT1xOQ3hwWPe1gYPjGyInTQ@jc48w0kggo0s88sog4s8oo8c:3000/postgres'});
(async()=>{
  try{
    await p.query('CREATE USER tourworld_user WITH PASSWORD \\'TourWorld2025!Secure\\';');
    console.log('✅ User created');
    await p.query('CREATE DATABASE tourworld_tourism OWNER tourworld_user;');
    console.log('✅ Database created');
    await p.query('GRANT ALL PRIVILEGES ON DATABASE tourworld_tourism TO tourworld_user;');
    console.log('✅ Permissions granted');
    p.end();
  }catch(e){
    if(e.message.includes('already exists')){console.log('⚠️ Already exists:',e.message);}else{console.error('❌',e.message);}
    p.end();
  }
})();
"
```

---

## ✅ Step 3: Use tourworld_user DATABASE_URL

After creating user/database:

```bash
# Use tourworld_user credentials
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:3000/tourworld_tourism"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"

# Create tables
npx prisma db push --accept-data-loss

# Seed database
node seed-now.js
```

**Run Step 1 first to test the connection!** 🚀

