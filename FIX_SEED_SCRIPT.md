# 🔧 Fix Seed Script Connection

## ❌ Issue: Seed Script Can't Connect

The seed script might not be reading `DATABASE_URL` correctly. Let's check and fix it.

---

## ✅ Solution: Verify DATABASE_URL is Set

```bash
# First, verify DATABASE_URL is still set
echo $DATABASE_URL

# If it's not set, set it again
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism"

# Verify it's set correctly
echo $DATABASE_URL

# Now try seed again
node seed-now.js
```

---

## ✅ Alternative: Create Seed Script Directly

If the seed-now.js file has issues, create a fresh one:

```bash
# Create a fresh seed script
cat > seed-now.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set!');
  process.exit(1);
}

console.log('🔗 Using DATABASE_URL:', databaseUrl.replace(/:[^:@]+@/, ':****@'));

const pool = new Pool({ connectionString: databaseUrl });
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
        itinerary: [{ day: 1, title: 'Accra City Tour', activities: ['Independence Square', 'Makola Market', 'Jamestown'], meals: 'L', accommodation: 'N/A' }],
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
        description: 'A luxurious hotel in the heart of Accra.',
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
        excerpt: 'Discover the most beautiful destinations in Ghana.',
        content: 'Ghana is a country rich in history, culture, and natural beauty...',
        author: 'TOURWORLD TOURISM',
        category: 'Tourism',
        tags: ['Ghana', 'Travel'],
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
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  }
})();
EOF

# Set DATABASE_URL
export DATABASE_URL="postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism"

# Run seed
node seed-now.js
```

**Try verifying DATABASE_URL first, then recreate the seed script if needed!** 🚀

