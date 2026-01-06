#!/bin/bash
# Run this in Coolify Terminal to check database status

echo "🔍 Checking Database Status"
echo "=========================="
echo ""

node -e "
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

Promise.all([
  p.tour.count(),
  p.hotel.count(),
  p.attraction.count(),
  p.blog.count(),
  p.gallery.count(),
  p.testimonial.count(),
  p.booking.count(),
  p.contactInquiry.count(),
  p.newsletter.count(),
  p.user.count()
]).then(([tours, hotels, attractions, blogs, galleries, testimonials, bookings, contacts, newsletters, users]) => {
  console.log('📊 Current Database Contents:');
  console.log('   Tours:', tours, '/ 12 expected');
  console.log('   Hotels:', hotels, '/ 5 expected');
  console.log('   Attractions:', attractions, '/ 18 expected');
  console.log('   Blogs:', blogs, '/ 9 expected');
  console.log('   Galleries:', galleries, '/ 3 expected');
  console.log('   Testimonials:', testimonials, '/ 5 expected');
  console.log('   Bookings:', bookings, '/ 1 expected');
  console.log('   Contact Inquiries:', contacts, '/ 1 expected');
  console.log('   Newsletters:', newsletters);
  console.log('   Users:', users);
  console.log('');
  
  const totalExpected = 12 + 5 + 18 + 9 + 3 + 5 + 1 + 1;
  const totalCurrent = tours + hotels + attractions + blogs + galleries + testimonials + bookings + contacts;
  
  if (totalCurrent === totalExpected) {
    console.log('✅ All content imported successfully!');
  } else {
    console.log('⚠️  Missing content. Run import:');
    console.log('   cat local-db-export-final.json | node scripts/import-to-production.js');
  }
  
  p.\$disconnect();
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
"

