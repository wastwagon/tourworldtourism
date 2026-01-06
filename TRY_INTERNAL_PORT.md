# 🔧 Try Internal Port 5432

## ❌ Connection Failed with Port 3000

The port mapping `3000:5432` might mean:
- `3000` = external port (from host)
- `5432` = internal port (from other containers)

Let's try port `5432` instead:

---

## ✅ Step 1: Try Port 5432

```bash
# Try with internal port 5432
export DATABASE_URL="postgresql://postgres:djGChyScbr4zMfmQDqiyK7GtkkPzKpb5uUBLcZDfnrT1xOQ3hwWPe1gYPjGyInTQ@jc48w0kggo0s88sog4s8oo8c:5432/postgres"

# Test connection with better error handling
node -e "
const {Pool}=require('pg');
const p=new Pool({connectionString:process.env.DATABASE_URL});
p.query('SELECT 1')
  .then((r)=>{console.log('✅ Connected! Result:',r.rows[0]);p.end();})
  .catch(e=>{console.error('❌ Error:',e.message);console.error('Code:',e.code);p.end();process.exit(1);});
"
```

---

## ✅ Alternative: Check Network Configuration

If port 5432 doesn't work, the containers might not be on the same network. Check:

1. **In Coolify → Your Application:**
   - Look for "Linked Resources" or "Database" section
   - Make sure the database is **linked** to your application
   - Linking should automatically configure the connection

2. **Or use the service name format:**
   ```bash
   # Sometimes Coolify uses service names differently
   export DATABASE_URL="postgresql://postgres:djGChyScbr4zMfmQDqiyK7GtkkPzKpb5uUBLcZDfnrT1xOQ3hwWPe1gYPjGyInTQ@postgresql-database-jc48w0kggo0s88sog4s8oo8c:5432/postgres"
   ```

**Try port 5432 first!** 🚀

