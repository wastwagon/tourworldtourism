# 🚀 Import PostgreSQL Dump into Coolify

## Files Created

✅ **SQL Dump**: `tourworld-dump-20260106-132703.sql` (196KB)
✅ **Base64 Encoded**: `tourworld-dump-20260106-132703.sql.base64.txt`

## Step 1: Copy Base64 Content to Coolify

On your local machine, display the base64 content:

```bash
cat tourworld-dump-20260106-132703.sql.base64.txt
```

**Copy the entire output** (it's one long string).

## Step 2: In Coolify Terminal

### Option A: Using psql (if available)

```bash
# 1. Decode the base64 file
base64 -d > tourworld-dump.sql << 'EOF'
[paste the entire base64 content here]
EOF

# 2. Verify it decoded correctly
head -20 tourworld-dump.sql

# 3. Import into production database
psql $DATABASE_URL < tourworld-dump.sql
```

### Option B: Using Docker (if psql not available)

```bash
# 1. Decode the base64 file
base64 -d > tourworld-dump.sql << 'EOF'
[paste the entire base64 content here]
EOF

# 2. Import using Docker
docker run --rm -i -e PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') \
  postgres:16 psql "$DATABASE_URL" < tourworld-dump.sql
```

### Option C: Using Node.js (if Docker not available)

```bash
# 1. Decode the base64 file
base64 -d > tourworld-dump.sql << 'EOF'
[paste the entire base64 content here]
EOF

# 2. Import using Node.js (slower but works)
node -e "
const {execSync}=require('child_process');
const fs=require('fs');
const sql=fs.readFileSync('tourworld-dump.sql','utf8');
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
// Split SQL into statements and execute
const statements=sql.split(';').filter(s=>s.trim());
for(const stmt of statements){
  try{
    await prisma.\$executeRawUnsafe(stmt);
  }catch(e){
    console.error('Error:',e.message);
  }
}
prisma.\$disconnect();
"
```

## Step 3: Verify Import

After import, verify the data:

```bash
# Count records
node -e "
const {PrismaClient}=require('@prisma/client');
const p=new PrismaClient();
Promise.all([
  p.tour.count(),
  p.hotel.count(),
  p.attraction.count(),
  p.blog.count(),
  p.gallery.count(),
  p.testimonial.count()
]).then(([tours,hotels,attractions,blogs,galleries,testimonials])=>{
  console.log('Tours:',tours);
  console.log('Hotels:',hotels);
  console.log('Attractions:',attractions);
  console.log('Blogs:',blogs);
  console.log('Galleries:',galleries);
  console.log('Testimonials:',testimonials);
  p.\$disconnect();
});
"
```

Expected counts:
- Tours: 12
- Hotels: 5
- Attractions: 18
- Blogs: 9
- Galleries: 3 (with 88 images total)
- Testimonials: 5

## Troubleshooting

### If base64 decode fails:
- Make sure you copied the **entire** base64 string
- No line breaks or extra spaces
- The string should start with something like `LS0tIFBvc3RncmVT...`

### If import fails:
- Check `$DATABASE_URL` is set correctly
- Verify database is accessible: `echo $DATABASE_URL`
- Try importing in smaller chunks if the file is too large

### If you get permission errors:
- The dump uses `--no-owner --no-acl` flags, so it should work
- If issues persist, check database user permissions

## Success! 🎉

Once imported, your production site should show all your local content!

