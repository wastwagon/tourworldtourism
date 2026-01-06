# 🔧 Robust Import Script (Handles Control Characters)

The JSON file has control characters that need aggressive cleaning. Use this improved script:

## Create Robust Import Script

In Coolify Terminal, run:

```bash
cat > robust-import.js << 'SCRIPTEOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  console.log('📦 Reading export file...');
  let content = fs.readFileSync('local-db-export-final.json', 'utf8');
  
  // Aggressive cleaning
  content = content
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/\u2028/g, '')
    .replace(/\u2029/g, '')
    .replace(/[\uFEFF]/g, '');
  
  console.log('🧹 Cleaning control characters...');
  
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    console.error('❌ Parse error:', e.message);
    // Try fixing common issues
    content = content.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    data = JSON.parse(content);
  }
  
  console.log('✅ Parsed successfully\n');

  // Import Tours
  if (data.data.tours) {
    console.log(`📊 Importing ${data.data.tours.length} tours...`);
    for (const t of data.data.tours) {
      try {
        const {id,...x}=t;
        if(x.description)x.description=x.description.replace(/[\x00-\x1F\x7F]/g,'');
        await prisma.tour.upsert({where:{slug:t.slug},update:x,create:x});
      } catch(e){console.error('Tour error:',t.slug,e.message);}
    }
    console.log('✅ Tours done\n');
  }

  // Import Hotels
  if (data.data.hotels) {
    console.log(`📊 Importing ${data.data.hotels.length} hotels...`);
    for (const h of data.data.hotels) {
      try {
        const {id,...x}=h;
        await prisma.hotel.upsert({where:{id:h.id},update:x,create:x});
      } catch(e){console.error('Hotel error:',h.name,e.message);}
    }
    console.log('✅ Hotels done\n');
  }

  // Import Attractions
  if (data.data.attractions) {
    console.log(`📊 Importing ${data.data.attractions.length} attractions...`);
    for (const a of data.data.attractions) {
      try {
        const {id,...x}=a;
        await prisma.attraction.upsert({where:{id:a.id},update:x,create:x});
      } catch(e){console.error('Attraction error:',a.name,e.message);}
    }
    console.log('✅ Attractions done\n');
  }

  // Import Blogs (clean content)
  if (data.data.blogs) {
    console.log(`📊 Importing ${data.data.blogs.length} blogs...`);
    for (const b of data.data.blogs) {
      try {
        const {id,...x}=b;
        if(x.content)x.content=x.content.replace(/[\x00-\x1F\x7F]/g,'');
        if(x.excerpt)x.excerpt=x.excerpt.replace(/[\x00-\x1F\x7F]/g,'');
        await prisma.blog.upsert({where:{slug:b.slug},update:x,create:x});
      } catch(e){console.error('Blog error:',b.slug,e.message);}
    }
    console.log('✅ Blogs done\n');
  }

  // Import Galleries
  if (data.data.galleries) {
    console.log(`📊 Importing ${data.data.galleries.length} galleries...`);
    for (const g of data.data.galleries) {
      try {
        const {id,...x}=g;
        await prisma.gallery.upsert({where:{slug:g.slug},update:x,create:x});
      } catch(e){console.error('Gallery error:',g.slug,e.message);}
    }
    console.log('✅ Galleries done\n');
  }

  // Import Testimonials
  if (data.data.testimonials) {
    console.log(`📊 Importing ${data.data.testimonials.length} testimonials...`);
    for (const t of data.data.testimonials) {
      try {
        const {id,...x}=t;
        if(x.testimonial)x.testimonial=x.testimonial.replace(/[\x00-\x1F\x7F]/g,'');
        await prisma.testimonial.create({data:x});
      } catch(e){console.error('Testimonial error:',e.message);}
    }
    console.log('✅ Testimonials done\n');
  }

  // Import Bookings
  if (data.data.bookings) {
    console.log(`📊 Importing ${data.data.bookings.length} bookings...`);
    for (const b of data.data.bookings) {
      try {
        const {id,...x}=b;
        await prisma.booking.create({data:x});
      } catch(e){console.error('Booking error:',e.message);}
    }
    console.log('✅ Bookings done\n');
  }

  // Import Contact Inquiries
  if (data.data.contactInquiries) {
    console.log(`📊 Importing ${data.data.contactInquiries.length} contact inquiries...`);
    for (const c of data.data.contactInquiries) {
      try {
        const {id,...x}=c;
        await prisma.contactInquiry.create({data:x});
      } catch(e){console.error('Contact error:',e.message);}
    }
    console.log('✅ Contacts done\n');
  }

  console.log('✨ Import completed!');
  await prisma.$disconnect();
}

importData().catch(e=>{console.error('Fatal:',e.message);process.exit(1);});
SCRIPTEOF
```

Then run:

```bash
node robust-import.js
```

This script has more aggressive cleaning and handles errors better.

