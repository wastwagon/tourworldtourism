# ✅ Create Tables and Seed Database

## ✅ Step 1: Switch to tourworld_user and Create Tables

```bash
# Use tourworld_user credentials
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism"

# Test connection
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{console.log('✅ Connected!');p.end();}).catch(e=>{console.error('❌',e.message);p.end();});"

# Create tables with Prisma
npx prisma db push --accept-data-loss
```

---

## ✅ Step 2: Seed Database

After tables are created successfully:

```bash
# Seed with sample data
node seed-now.js
```

---

## 🎯 Expected Results

After `npx prisma db push`:
- ✅ Should see: `✔ Database synchronized`
- ✅ Tables created: tours, hotels, blogs, galleries, bookings, etc.

After `node seed-now.js`:
- ✅ Sample tours, hotels, and blogs created
- ✅ Your website should now show content!

**Run Step 1 now!** 🚀

