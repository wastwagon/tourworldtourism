# 🚀 Import Database NOW - Coolify Terminal

Your application is running but database is empty. Import the data:

## Step 1: Check if SQL file exists

```bash
ls -lh tourworld-dump.sql
```

If it exists, proceed to Step 2. If not, you need to decode the base64 file first.

## Step 2: Import using psql

```bash
psql $DATABASE_URL < tourworld-dump.sql
```

**If psql is not available**, use Docker:

```bash
docker run --rm -i postgres:16 psql $DATABASE_URL < tourworld-dump.sql
```

## Step 3: Verify Import

After import completes, verify the data:

```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count(),p.gallery.count(),p.testimonial.count()]).then(([t,h,a,b,g,te])=>{console.log('✅ Tours:',t);console.log('✅ Hotels:',h);console.log('✅ Attractions:',a);console.log('✅ Blogs:',b);console.log('✅ Galleries:',g);console.log('✅ Testimonials:',te);p.\$disconnect();});"
```

Expected results:
- ✅ Tours: 12
- ✅ Hotels: 5
- ✅ Attractions: 18
- ✅ Blogs: 9
- ✅ Galleries: 3
- ✅ Testimonials: 5

## Troubleshooting

### If psql command shows nothing:
- The import might be running silently
- Wait a few seconds, then check with the verify command above
- Or try with verbose output: `psql $DATABASE_URL -v ON_ERROR_STOP=1 < tourworld-dump.sql`

### If psql not found:
Use Docker method above.

### If import fails:
Check the error message and try:
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;" || docker run --rm postgres:16 psql $DATABASE_URL -c "SELECT 1;"
```

