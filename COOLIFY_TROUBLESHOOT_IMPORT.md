# 🔧 Troubleshooting Import in Coolify

If `psql $DATABASE_URL < tourworld-dump.sql` shows nothing:

## Check 1: Is psql available?

```bash
which psql
```

If not found, use Docker instead.

## Check 2: Try with Docker

```bash
docker run --rm -i postgres:16 psql $DATABASE_URL < tourworld-dump.sql
```

## Check 3: Verify DATABASE_URL

```bash
echo $DATABASE_URL
```

Make sure it's set correctly.

## Check 4: Test Connection First

```bash
# Test with psql
psql $DATABASE_URL -c "SELECT 1;"

# OR with Docker
docker run --rm postgres:16 psql $DATABASE_URL -c "SELECT 1;"
```

## Check 5: Import with Verbose Output

```bash
# With psql (verbose)
psql $DATABASE_URL -v ON_ERROR_STOP=1 < tourworld-dump.sql

# OR with Docker (verbose)
docker run --rm -i postgres:16 psql $DATABASE_URL -v ON_ERROR_STOP=1 < tourworld-dump.sql
```

## Check 6: Import in Smaller Chunks

If the file is too large, try importing table by table:

```bash
# Extract just schema
grep -E "(CREATE|ALTER)" tourworld-dump.sql > schema.sql
psql $DATABASE_URL < schema.sql

# Extract just data (COPY statements)
grep -E "^COPY|^\\\\\." tourworld-dump.sql > data.sql
psql $DATABASE_URL < data.sql
```

## Check 7: Check File Size

```bash
ls -lh tourworld-dump.sql
wc -l tourworld-dump.sql
```

Make sure it's not empty or corrupted.

## Check 8: Manual Import with Node.js

If psql and Docker don't work:

```bash
node -e "
const {execSync}=require('child_process');
const fs=require('fs');
const sql=fs.readFileSync('tourworld-dump.sql','utf8');
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

// Split by semicolons and execute
const statements=sql.split(';').filter(s=>s.trim()&&!s.trim().startsWith('--'));
let count=0;
for(const stmt of statements){
  try{
    if(stmt.trim()){
      await prisma.\$executeRawUnsafe(stmt);
      count++;
      if(count%10===0)process.stdout.write('.');
    }
  }catch(e){
    console.error('Error at statement',count,':',e.message);
  }
}
console.log('\\n✅ Imported',count,'statements');
prisma.\$disconnect();
"
```

