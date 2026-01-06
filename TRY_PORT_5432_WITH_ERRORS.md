# 🔧 Try Port 5432 with Better Error Handling

## ❌ Port 3000 Failed

Let's try port 5432 (internal port) and see the actual error:

---

## ✅ Step 1: Try Port 5432

```bash
# Try with internal port 5432
export DATABASE_URL="postgresql://postgres:djGChyScbr4zMfmQDqiyK7GtkkPzKpb5uUBLcZDfnrT1xOQ3hwWPe1gYPjGyInTQ@jc48w0kggo0s88sog4s8oo8c:5432/postgres"

# Test with detailed error output
node -e "
const {Pool}=require('pg');
const p=new Pool({
  connectionString:process.env.DATABASE_URL,
  connectionTimeoutMillis:5000
});
p.query('SELECT 1')
  .then((r)=>{console.log('✅ Connected! Result:',r.rows[0]);p.end();})
  .catch(e=>{
    console.error('❌ Error:',e.message);
    console.error('Code:',e.code);
    console.error('Full error:',JSON.stringify(e,null,2));
    p.end();
    process.exit(1);
  });
"
```

---

## ✅ Step 2: Check if Containers Can Communicate

If port 5432 also fails, the containers might not be on the same network. Check:

```bash
# Check if we can resolve the hostname
nslookup jc48w0kggo0s88sog4s8oo8c

# Or try ping
ping -c 1 jc48w0kggo0s88sog4s8oo8c
```

---

## 🎯 Most Important: Link Database in Coolify

**In Coolify → Your Application:**
1. Go to **"Environment Variables"** tab
2. Look for **"Linked Resources"** or **"Database"** section
3. **Link your PostgreSQL database** - this will automatically set the correct `DATABASE_URL`

**Try port 5432 first, then check Coolify's Linked Resources!** 🚀

