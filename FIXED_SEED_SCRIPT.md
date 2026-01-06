# ✅ Fixed Seed Script - Matches Schema

## ❌ Issue: Field Names Don't Match Schema

The schema uses:
- `durationDays` (not `duration`)
- `durationNights` (required)
- `pricePerPerson` (not `price`)
- `availableDates` (not `dates`)
- `itinerary` format might be different

---

## ✅ Fixed Seed Script

```bash
# Create fixed seed script
cat > seed-simple.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set!');
  process.exit(1);
}

console.log('🔗 Connecting to database...');

const pool = new Pool({ 
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    console.log('🌱 Creating sample data...');
    
    const tour = await prisma.tour.create({
      data: {
        title: 'Discover Accra - Capital City Tour',
        slug: 'discover-accra-capital-city-tour',
        description: 'Explore the vibrant capital city of Ghana, Accra, with its rich history, bustling markets, and modern attractions.',
        durationDays: 1,
        durationNights: 0,
        regions: ['Greater Accra'],
        tourType: 'Historical',
        highlights: ['Visit Independence Square', 'Explore Makola Market', 'See Jamestown Lighthouse'],
        inclusions: ['Transportation', 'Lunch', 'Tour guide'],
        exclusions: ['Personal expenses', 'Tips'],
        itinerary: [{
          day: 1,
          title: 'Accra City Tour',
          activities: ['Independence Square', 'Makola Market', 'Jamestown'],
          meals: 'L',
          accommodation: 'N/A'
        }],
        hotels: [],
        pricePerPerson: 150,
        availableDates: ['2025-02-01', '2025-02-15'],
        featured: true,
        status: 'active',
        featuredImage: '/images/tours/accra-tour.jpg',
        galleryImages: []
      }
    });
    console.log('✅ Tour created:', tour.title);

    const hotel = await prisma.hotel.create({
      data: {
        name: 'Accra Luxury Hotel',
        location: 'Accra, Ghana',
        region: 'Greater Accra',
        description: 'A luxurious hotel in the heart of Accra with modern amenities and excellent service.',
        featured: true,
        rating: 4.5,
        featuredImage: '/images/hotels/accra-luxury.jpg'
      }
    });
    console.log('✅ Hotel created:', hotel.name);

    const blog = await prisma.blog.create({
      data: {
        title: 'Top 10 Must-Visit Places in Ghana',
        slug: 'top-10-must-visit-places-ghana',
        excerpt: 'Discover the most beautiful and culturally rich destinations in Ghana.',
        content: 'Ghana is a country rich in history, culture, and natural beauty. Here are the top 10 places you must visit...',
        author: 'TOURWORLD TOURISM',
        category: 'Tourism',
        tags: ['Ghana', 'Travel', 'Destinations'],
        featured: true,
        published: true,
        featuredImage: '/images/blogs/ghana-places.jpg'
      }
    });
    console.log('✅ Blog created:', blog.title);

    console.log('🎉 Database seeded successfully!');
    await prisma.$disconnect();
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  }
})();
EOF

# Run the fixed seed script
node seed-simple.js
```

**Run this fixed version!** 🚀

