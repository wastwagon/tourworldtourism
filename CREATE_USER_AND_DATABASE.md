# ✅ Connection Works! Now Create User & Database

## ✅ Step 1: Create tourworld_user and tourworld_tourism Database

```bash
# Create user and database
node -e "
const {Pool}=require('pg');
const p=new Pool({connectionString:'postgresql://postgres:djGChyScbr4zMfmQDqiyK7GtkkPzKpb5uUBLcZDfnrT1xOQ3hwWPe1gYPjGyInTQ@jc48w0kggo0s88sog4s8oo8c:5432/postgres'});
(async()=>{
  try{
    await p.query('CREATE USER tourworld_user WITH PASSWORD \\'TourWorld2025!Secure\\';');
    console.log('✅ User created');
  }catch(e){
    if(e.message.includes('already exists')){console.log('⚠️ User already exists');}else{console.error('❌ User error:',e.message);}
  }
  try{
    await p.query('CREATE DATABASE tourworld_tourism OWNER tourworld_user;');
    console.log('✅ Database created');
  }catch(e){
    if(e.message.includes('already exists')){console.log('⚠️ Database already exists');}else{console.error('❌ Database error:',e.message);}
  }
  try{
    await p.query('GRANT ALL PRIVILEGES ON DATABASE tourworld_tourism TO tourworld_user;');
    console.log('✅ Permissions granted');
  }catch(e){
    console.error('❌ Permission error:',e.message);
  }
  p.end();
})();
"
```

---

## ✅ Step 2: Use tourworld_user and Create Tables

```bash
# Use tourworld_user credentials
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"

# Create tables with Prisma
npx prisma db push --accept-data-loss
```

---

## ✅ Step 3: Seed Database

```bash
# Seed with sample data
node seed-now.js
```

**Run Step 1 first!** 🚀

