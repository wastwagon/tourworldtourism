# 🚀 Import Data in Coolify (Script Not Available)

Since `scripts/import-to-production.js` is not in the container, use this inline method:

## Method: Create Import Script Directly in Container

### Step 1: Create the import script

In Coolify Terminal, run:

```bash
cat > import-inline.js << 'SCRIPTEOF'
```

Then paste the contents of `import-inline.js` (I'll provide it below), and end with:

```bash
SCRIPTEOF
```

### Step 2: Run the import

```bash
node import-inline.js
```

### Step 3: Verify

```bash
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count(),p.gallery.count()]).then(([t,h,a,b,g])=>console.log('✅ Tours:',t,'Hotels:',h,'Attractions:',a,'Blogs:',b,'Galleries:',g));"
```

---

## Alternative: One-Line Import (Simpler)

Since you already have the export file, you can use this one-liner:

```bash
node -e "const {PrismaClient}=require('@prisma/client'); const fs=require('fs'); const p=new PrismaClient(); const d=JSON.parse(fs.readFileSync('local-db-export-final.json','utf8')); Promise.all(d.data.tours.map(t=>{const{id,...x}=t;return p.tour.upsert({where:{slug:t.slug},update:x,create:x})})).then(()=>Promise.all(d.data.hotels.map(h=>{const{id,...x}=h;return p.hotel.upsert({where:{id:h.id},update:x,create:x})}))).then(()=>Promise.all(d.data.attractions.map(a=>{const{id,...x}=a;return p.attraction.upsert({where:{id:a.id},update:x,create:x})}))).then(()=>Promise.all(d.data.blogs.map(b=>{const{id,...x}=b;return p.blog.upsert({where:{slug:b.slug},update:x,create:x})}))).then(()=>Promise.all(d.data.galleries.map(g=>{const{id,...x}=g;return p.gallery.upsert({where:{slug:g.slug},update:x,create:x})}))).then(()=>{console.log('✅ Import complete');p.\$disconnect()});"
```

This one-liner will import tours, hotels, attractions, blogs, and galleries.

---

**Try the one-liner first - it's simpler!**

