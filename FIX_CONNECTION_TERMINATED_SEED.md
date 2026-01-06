# 🔧 Fix Connection Terminated in Seed Script

## ❌ Issue: Connection Terminated Unexpectedly

The connection is being dropped. Let's verify DATABASE_URL and test connection first.

---

## ✅ Solution: Verify and Test Connection

```bash
# 1. Verify DATABASE_URL is still set
echo $DATABASE_URL

# 2. If not set, set it again
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism"

# 3. Test connection first
node -e "
const {Pool}=require('pg');
const p=new Pool({
  connectionString:process.env.DATABASE_URL,
  connectionTimeoutMillis:10000,
  idleTimeoutMillis:30000
});
p.query('SELECT 1')
  .then((r)=>{console.log('✅ Connection test passed!');p.end();})
  .catch(e=>{console.error('❌ Connection test failed:',e.message);p.end();process.exit(1);});
"

# 4. If connection test passes, try seed with better connection handling
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
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 1
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['error', 'warn']
});

(async () => {
  try {
    // Test connection first
    await prisma.$connect();
    console.log('✅ Connected to database');
    
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
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
})();
EOF

# 5. Run seed
node seed-simple.js
```

**Run these commands step by step!** 🚀

