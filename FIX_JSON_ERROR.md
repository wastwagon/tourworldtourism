# 🔧 Fix JSON Control Character Error

The JSON file has control characters that need to be cleaned. Use this script:

## Solution: Create Clean Import Script

In Coolify Terminal, create this script:

```bash
cat > clean-and-import.js << 'SCRIPTEOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function cleanAndImport() {
  console.log('📦 Reading and cleaning export file...');
  let fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
  fileContent = fileContent.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  const exportData = JSON.parse(fileContent);
  console.log('✅ File cleaned and parsed\n');

  // Import Tours
  if (exportData.data.tours) {
    console.log(`📊 Importing ${exportData.data.tours.length} tours...`);
    for (const tour of exportData.data.tours) {
      try {
        const { id, ...tourData } = tour;
        await prisma.tour.upsert({ where: { slug: tour.slug }, update: tourData, create: tourData });
      } catch (e) { console.error(`Error: ${tour.slug}`, e.message); }
    }
    console.log('✅ Tours imported\n');
  }

  // Import Hotels
  if (exportData.data.hotels) {
    console.log(`📊 Importing ${exportData.data.hotels.length} hotels...`);
    for (const hotel of exportData.data.hotels) {
      try {
        const { id, ...hotelData } = hotel;
        await prisma.hotel.upsert({ where: { id: hotel.id }, update: hotelData, create: hotelData });
      } catch (e) { console.error(`Error: ${hotel.name}`, e.message); }
    }
    console.log('✅ Hotels imported\n');
  }

  // Import Attractions
  if (exportData.data.attractions) {
    console.log(`📊 Importing ${exportData.data.attractions.length} attractions...`);
    for (const attraction of exportData.data.attractions) {
      try {
        const { id, ...attractionData } = attraction;
        await prisma.attraction.upsert({ where: { id: attraction.id }, update: attractionData, create: attractionData });
      } catch (e) { console.error(`Error: ${attraction.name}`, e.message); }
    }
    console.log('✅ Attractions imported\n');
  }

  // Import Blogs
  if (exportData.data.blogs) {
    console.log(`📊 Importing ${exportData.data.blogs.length} blogs...`);
    for (const blog of exportData.data.blogs) {
      try {
        const { id, ...blogData } = blog;
        await prisma.blog.upsert({ where: { slug: blog.slug }, update: blogData, create: blogData });
      } catch (e) { console.error(`Error: ${blog.slug}`, e.message); }
    }
    console.log('✅ Blogs imported\n');
  }

  // Import Galleries
  if (exportData.data.galleries) {
    console.log(`📊 Importing ${exportData.data.galleries.length} galleries...`);
    for (const gallery of exportData.data.galleries) {
      try {
        const { id, ...galleryData } = gallery;
        await prisma.gallery.upsert({ where: { slug: gallery.slug }, update: galleryData, create: galleryData });
      } catch (e) { console.error(`Error: ${gallery.slug}`, e.message); }
    }
    console.log('✅ Galleries imported\n');
  }

  // Import Testimonials
  if (exportData.data.testimonials) {
    console.log(`📊 Importing ${exportData.data.testimonials.length} testimonials...`);
    for (const testimonial of exportData.data.testimonials) {
      try {
        const { id, ...testimonialData } = testimonial;
        await prisma.testimonial.create({ data: testimonialData });
      } catch (e) { console.error('Error:', e.message); }
    }
    console.log('✅ Testimonials imported\n');
  }

  // Import Bookings
  if (exportData.data.bookings) {
    console.log(`📊 Importing ${exportData.data.bookings.length} bookings...`);
    for (const booking of exportData.data.bookings) {
      try {
        const { id, ...bookingData } = booking;
        await prisma.booking.create({ data: bookingData });
      } catch (e) { console.error('Error:', e.message); }
    }
    console.log('✅ Bookings imported\n');
  }

  // Import Contact Inquiries
  if (exportData.data.contactInquiries) {
    console.log(`📊 Importing ${exportData.data.contactInquiries.length} contact inquiries...`);
    for (const inquiry of exportData.data.contactInquiries) {
      try {
        const { id, ...inquiryData } = inquiry;
        await prisma.contactInquiry.create({ data: inquiryData });
      } catch (e) { console.error('Error:', e.message); }
    }
    console.log('✅ Contact inquiries imported\n');
  }

  console.log('✨ Import completed!');
  await prisma.$disconnect();
}

cleanAndImport().catch(e => { console.error('Fatal error:', e); process.exit(1); });
SCRIPTEOF
```

Then run:

```bash
node clean-and-import.js
```

This script will:
1. Clean control characters from the JSON
2. Parse it safely
3. Import all data

---

**Copy the entire script above and paste it into Coolify Terminal!**

