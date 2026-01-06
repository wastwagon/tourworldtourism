# 🚀 Quick Import into Coolify - Copy & Paste Ready

## Method 1: Upload Base64 File (Recommended)

### Step 1: Upload the base64 file to Coolify

The file `tourworld-dump-20260106-132703.sql.base64.txt` needs to be uploaded to Coolify.

**Option A: Via Coolify File Manager** (if available)
- Navigate to your application in Coolify
- Look for "Files" or "File Manager" option
- Upload `tourworld-dump-20260106-132703.sql.base64.txt`

**Option B: Create file in Coolify Terminal**
```bash
# In Coolify Terminal, create the file
cat > tourworld-dump-20260106-132703.sql.base64.txt << 'ENDOFFILE'
[paste the entire content from tourworld-dump-20260106-132703.sql.base64.txt]
ENDOFFILE
```

### Step 2: Run Import Script

```bash
# Decode and import
base64 -d tourworld-dump-20260106-132703.sql.base64.txt > tourworld-dump.sql

# Import
psql $DATABASE_URL < tourworld-dump.sql

# OR if psql not available:
docker run --rm -i postgres:16 psql $DATABASE_URL < tourworld-dump.sql
```

---

## Method 2: Direct Copy-Paste (One Command)

Copy this entire block and paste into Coolify Terminal:

```bash
# Import PostgreSQL dump
base64 -d > /tmp/dump.sql << 'DUMPEOF'
[paste entire content from tourworld-dump-20260106-132703.sql.base64.txt here - it's 256KB, one long string]
DUMPEOF

# Verify it decoded
head -5 /tmp/dump.sql

# Import
psql $DATABASE_URL < /tmp/dump.sql || docker run --rm -i postgres:16 psql $DATABASE_URL < /tmp/dump.sql

# Verify import
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count(),p.gallery.count(),p.testimonial.count()]).then(([t,h,a,b,g,te])=>{console.log('✅ Tours:',t);console.log('✅ Hotels:',h);console.log('✅ Attractions:',a);console.log('✅ Blogs:',b);console.log('✅ Galleries:',g);console.log('✅ Testimonials:',te);p.\$disconnect();});"
```

---

## Method 3: Using the Import Script

If you uploaded the base64 file, run:

```bash
# Make script executable
chmod +x COOLIFY_IMPORT_SCRIPT.sh

# Run it
./COOLIFY_IMPORT_SCRIPT.sh
```

---

## File Locations

**On your local machine:**
- `tourworld-dump-20260106-132703.sql` (196KB) - SQL dump
- `tourworld-dump-20260106-132703.sql.base64.txt` (256KB) - Base64 encoded

**To get the base64 content:**
```bash
cat tourworld-dump-20260106-132703.sql.base64.txt
```

Copy the entire output (it's one long string, ~262,000 characters).

---

## Troubleshooting

### If base64 decode fails:
- Make sure you copied the **entire** string
- No line breaks in the middle
- Should start with something like `LS0tIFBvc3RncmVT...`

### If import fails:
- Check `echo $DATABASE_URL` shows correct connection
- Try with Docker: `docker run --rm -i postgres:16 psql $DATABASE_URL < /tmp/dump.sql`
- Check database is accessible

### If file is too large for paste:
- Use Method 1 (upload file)
- Or split into chunks (not recommended, use upload instead)

---

## Expected Results

After successful import:
- ✅ 12 Tours
- ✅ 5 Hotels  
- ✅ 18 Attractions
- ✅ 9 Blogs
- ✅ 3 Galleries (with 88 images)
- ✅ 5 Testimonials
- ✅ 1 Booking
- ✅ 1 Contact Inquiry

---

**Ready to import!** 🚀

