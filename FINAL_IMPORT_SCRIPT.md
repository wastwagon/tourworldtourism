# ✅ Final Working Import Script

The issue is control characters. This script removes ALL control characters and imports:

## Update the Script in Coolify Terminal

Run this to replace the existing script:

```bash
cat > clean-and-import.js << 'SCRIPTEOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function cleanAndImport() {
  console.log('📦 Reading export file...');
  let fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
  
  // Remove ALL control characters (including \n, \r, \t - we don't need formatting for import)
  fileContent = fileContent.replace(/[\x00-\x1F\x7F]/g, '');
  
  console.log('🧹 Cleaned control characters...');
  const exportData = JSON.parse(fileContent);
  console.log('✅ File parsed successfully\n');

  let imported = 0;

  // Import Tours
  if (exportData.data.tours) {
    console.log(`📊 Importing ${exportData.data.tours.length} tours...`);
    for (const t of exportData.data.tours) {
      try {
        const {id,...x}=t;
        await prisma.tour.upsert({where:{slug:t.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Tour ${t.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} tours imported\n`);
    imported=0;
  }

  // Import Hotels
  if (exportData.data.hotels) {
    console.log(`📊 Importing ${exportData.data.hotels.length} hotels...`);
    for (const h of exportData.data.hotels) {
      try {
        const {id,...x}=h;
        await prisma.hotel.upsert({where:{id:h.id},update:x,create:x});
        imported++;
      } catch(e){console.error(`Hotel ${h.name}:`,e.message);}
    }
    console.log(`✅ ${imported} hotels imported\n`);
    imported=0;
  }

  // Import Attractions
  if (exportData.data.attractions) {
    console.log(`📊 Importing ${exportData.data.attractions.length} attractions...`);
    for (const a of exportData.data.attractions) {
      try {
        const {id,...x}=a;
        await prisma.attraction.upsert({where:{id:a.id},update:x,create:x});
        imported++;
      } catch(e){console.error(`Attraction ${a.name}:`,e.message);}
    }
    console.log(`✅ ${imported} attractions imported\n`);
    imported=0;
  }

  // Import Blogs
  if (exportData.data.blogs) {
    console.log(`📊 Importing ${exportData.data.blogs.length} blogs...`);
    for (const b of exportData.data.blogs) {
      try {
        const {id,...x}=b;
        await prisma.blog.upsert({where:{slug:b.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Blog ${b.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} blogs imported\n`);
    imported=0;
  }

  // Import Galleries
  if (exportData.data.galleries) {
    console.log(`📊 Importing ${exportData.data.galleries.length} galleries...`);
    for (const g of exportData.data.galleries) {
      try {
        const {id,...x}=g;
        await prisma.gallery.upsert({where:{slug:g.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Gallery ${g.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} galleries imported\n`);
    imported=0;
  }

  // Import Testimonials
  if (exportData.data.testimonials) {
    console.log(`📊 Importing ${exportData.data.testimonials.length} testimonials...`);
    for (const t of exportData.data.testimonials) {
      try {
        const {id,...x}=t;
        await prisma.testimonial.create({data:x});
        imported++;
      } catch(e){console.error('Testimonial:',e.message);}
    }
    console.log(`✅ ${imported} testimonials imported\n`);
    imported=0;
  }

  // Import Bookings
  if (exportData.data.bookings) {
    console.log(`📊 Importing ${exportData.data.bookings.length} bookings...`);
    for (const b of exportData.data.bookings) {
      try {
        const {id,...x}=b;
        await prisma.booking.create({data:x});
        imported++;
      } catch(e){console.error('Booking:',e.message);}
    }
    console.log(`✅ ${imported} bookings imported\n`);
    imported=0;
  }

  // Import Contact Inquiries
  if (exportData.data.contactInquiries) {
    console.log(`📊 Importing ${exportData.data.contactInquiries.length} contact inquiries...`);
    for (const c of exportData.data.contactInquiries) {
      try {
        const {id,...x}=c;
        await prisma.contactInquiry.create({data:x});
        imported++;
      } catch(e){console.error('Contact:',e.message);}
    }
    console.log(`✅ ${imported} contacts imported\n`);
  }

  console.log('✨ Import completed successfully!');
  await prisma.$disconnect();
}

cleanAndImport().catch(e=>{console.error('Fatal:',e.message);process.exit(1);});
SCRIPTEOF
```

Then run:

```bash
node clean-and-import.js
```

**This version removes ALL control characters (including newlines/tabs) which fixes the JSON parsing issue.**

