# 🎯 Final Simple Import - Use JSON File

The SQL approach is too complex. Use the JSON file instead.

## Step 1: Create JSON File in Coolify

**Paste this in Coolify Terminal:**

```bash
cat > local-db-export-final.json << 'JSONEOF'
[paste the JSON content here - I just copied it to your clipboard]
JSONEOF
```

## Step 2: Run Import Script

**Paste this:**

```bash
cat > import-json.js << 'SCRIPTEOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  console.log('🚀 Importing from JSON...\n');
  
  const data = JSON.parse(fs.readFileSync('local-db-export-final.json', 'utf8'));
  
  let imported = 0;
  
  // Tours
  if (data.data.tours) {
    console.log(`📊 Importing ${data.data.tours.length} tours...`);
    for (const t of data.data.tours) {
      const {id, ...x} = t;
      try {
        await prisma.tour.upsert({where:{slug:t.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Tour ${t.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} tours imported\n`);
    imported=0;
  }
  
  // Hotels
  if (data.data.hotels) {
    console.log(`📊 Importing ${data.data.hotels.length} hotels...`);
    for (const h of data.data.hotels) {
      const {id, ...x} = h;
      try {
        await prisma.hotel.upsert({where:{id:h.id},update:x,create:x});
        imported++;
      } catch(e){console.error(`Hotel ${h.name}:`,e.message);}
    }
    console.log(`✅ ${imported} hotels imported\n`);
    imported=0;
  }
  
  // Attractions
  if (data.data.attractions) {
    console.log(`📊 Importing ${data.data.attractions.length} attractions...`);
    for (const a of data.data.attractions) {
      const {id, ...x} = a;
      try {
        await prisma.attraction.upsert({where:{id:a.id},update:x,create:x});
        imported++;
      } catch(e){console.error(`Attraction ${a.name}:`,e.message);}
    }
    console.log(`✅ ${imported} attractions imported\n`);
    imported=0;
  }
  
  // Blogs
  if (data.data.blogs) {
    console.log(`📊 Importing ${data.data.blogs.length} blogs...`);
    for (const b of data.data.blogs) {
      const {id, ...x} = b;
      try {
        await prisma.blog.upsert({where:{slug:b.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Blog ${b.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} blogs imported\n`);
    imported=0;
  }
  
  // Galleries
  if (data.data.galleries) {
    console.log(`📊 Importing ${data.data.galleries.length} galleries...`);
    for (const g of data.data.galleries) {
      const {id, ...x} = g;
      try {
        await prisma.gallery.upsert({where:{slug:g.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Gallery ${g.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} galleries imported\n`);
    imported=0;
  }
  
  // Testimonials
  if (data.data.testimonials) {
    console.log(`📊 Importing ${data.data.testimonials.length} testimonials...`);
    for (const t of data.data.testimonials) {
      const {id, ...x} = t;
      try {
        await prisma.testimonial.create({data:x});
        imported++;
      } catch(e){console.error('Testimonial:',e.message);}
    }
    console.log(`✅ ${imported} testimonials imported\n`);
    imported=0;
  }
  
  // Bookings
  if (data.data.bookings) {
    console.log(`📊 Importing ${data.data.bookings.length} bookings...`);
    for (const b of data.data.bookings) {
      const {id, ...x} = b;
      try {
        await prisma.booking.create({data:x});
        imported++;
      } catch(e){console.error('Booking:',e.message);}
    }
    console.log(`✅ ${imported} bookings imported\n`);
    imported=0;
  }
  
  // Contact Inquiries
  if (data.data.contactInquiries) {
    console.log(`📊 Importing ${data.data.contactInquiries.length} contact inquiries...`);
    for (const c of data.data.contactInquiries) {
      const {id, ...x} = c;
      try {
        await prisma.contactInquiry.create({data:x});
        imported++;
      } catch(e){console.error('Contact:',e.message);}
    }
    console.log(`✅ ${imported} contacts imported\n`);
  }
  
  console.log('✨ Import completed!');
  
  // Verify
  const [tours, hotels, galleries] = await Promise.all([
    prisma.tour.count(),
    prisma.hotel.count(),
    prisma.gallery.count(),
  ]);
  console.log(`\n✅ Tours: ${tours}, Hotels: ${hotels}, Galleries: ${galleries}`);
  
  await prisma.$disconnect();
}

importData().catch(e=>{
  console.error('❌ Fatal:',e.message);
  process.exit(1);
});
SCRIPTEOF

node import-json.js
```

---

**This is the simplest approach - JSON is easier to parse than SQL COPY format!**

The JSON content is in your clipboard - just paste it after `JSONEOF`.


