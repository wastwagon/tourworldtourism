# 🔧 Fixed Seed Command - Run from /app Directory

## ✅ Run This Instead

The script needs to run from `/app` where node_modules are. Use this:

```bash
cd /app && cat > seed-now.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
EOF
node seed-now.js
```

---

## 🔍 Or Check Where You Are First

```bash
# Check current directory
pwd

# Should be /app, if not:
cd /app

# Then check if node_modules exists
ls -la node_modules/@prisma 2>/dev/null || echo "Prisma not found in node_modules"

# If Prisma exists, run the seed from /app
```

---

## ✅ Alternative: Use npx to find Prisma

```bash
cd /app
npx prisma db seed
```

Or check if the original seed file exists:

```bash
ls -la prisma/seed.ts
```

If it exists, we might be able to use it differently.

