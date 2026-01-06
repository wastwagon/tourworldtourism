# 🔧 Simple Seed Fix

## ❌ Issue: dotenv Not Loading

The seed script uses `require('dotenv').config()` which might not work in the container. Let's verify DATABASE_URL and create a simpler seed.

---

## ✅ Solution: Verify and Use DATABASE_URL Directly

```bash
# 1. Verify DATABASE_URL is set
echo $DATABASE_URL

# 2. If not set, set it again
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism"

# 3. Create a simpler seed script (without dotenv)
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
        shortDescription: 'Experience the heart of Ghana\'s capital city',
        duration: '1 Day',
        price: 150,
        featuredImage: '/images/tours/accra-tour.jpg',
        images: ['/images/tours/accra-tour.jpg'],
        featured: true,
        status: 'active',
        highlights: ['Visit Independence Square', 'Explore Makola Market', 'See Jamestown Lighthouse'],
        inclusions: ['Transportation', 'Lunch', 'Tour guide'],
        exclusions: ['Personal expenses', 'Tips'],
        itinerary: [{
          day: 1,
          title: 'Accra City Tour',
          description: 'Full day exploring Accra\'s main attractions',
          activities: ['Independence Square', 'Makola Market', 'Jamestown']
        }],
        dates: [{
          date: new Date('2025-02-01'),
          available: true,
          price: 150
        }]
      }
    });
    console.log('✅ Tour created:', tour.title);

    const hotel = await prisma.hotel.create({
      data: {
        name: 'Accra Luxury Hotel',
        slug: 'accra-luxury-hotel',
        description: 'A luxurious hotel in the heart of Accra with modern amenities and excellent service.',
        location: 'Accra, Ghana',
        featuredImage: '/images/hotels/accra-luxury.jpg',
        images: ['/images/hotels/accra-luxury.jpg'],
        featured: true,
        status: 'active',
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym'],
        priceRange: '$$$',
        rating: 4.5
      }
    });
    console.log('✅ Hotel created:', hotel.name);

    const blog = await prisma.blog.create({
      data: {
        title: 'Top 10 Must-Visit Places in Ghana',
        slug: 'top-10-must-visit-places-ghana',
        excerpt: 'Discover the most beautiful and culturally rich destinations in Ghana.',
        content: 'Ghana is a country rich in history, culture, and natural beauty. Here are the top 10 places you must visit...',
        featuredImage: '/images/blogs/ghana-places.jpg',
        author: 'TOURWORLD TOURISM',
        category: 'Tourism',
        tags: ['Ghana', 'Travel', 'Destinations'],
        featured: true,
        published: true
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

# 4. Run the simple seed script
node seed-simple.js
```

**Run these commands!** 🚀

