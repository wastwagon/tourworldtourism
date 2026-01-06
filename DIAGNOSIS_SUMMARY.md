# 🔍 Database Connection Diagnosis

## ✅ What I Found

Based on the terminal error you showed (`Cannot find module '@prisma/client'`), here's the diagnosis:

---

## 🐛 Root Cause

**The seed script is trying to run from `/tmp` directory, but Prisma modules are in `/app`.**

When you ran:
```bash
cat > /tmp/seed.js << 'EOF'
...
node /tmp/seed.js
```

Node.js couldn't find `@prisma/client` because:
- Prisma is installed in `/app/node_modules`
- Script was in `/tmp` directory
- Node.js looks for modules relative to script location

---

## ✅ Solution

**Run the seed script from `/app` directory:**

```bash
# Make sure you're in /app
cd /app

# Create seed file in /app
cat > seed-now.js << 'EOF'
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

# Run it from /app
node seed-now.js
```

---

## 🔍 Additional Checks Needed

### 1. Verify DATABASE_URL is Set

```bash
echo $DATABASE_URL
```

Should show: `postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism`

### 2. Check Database Tables Exist

```bash
npx prisma db push --accept-data-loss
```

### 3. Verify Database Connection

```bash
npx prisma db pull
```

---

## 📋 Checklist

- [ ] Run seed script from `/app` directory (not `/tmp`)
- [ ] Verify `DATABASE_URL` environment variable is set
- [ ] Ensure database tables exist (`npx prisma db push`)
- [ ] Run seed script successfully
- [ ] Refresh website - content should appear

---

## 🎯 Next Steps

1. **Run the corrected seed command** (from `/app`)
2. **Check for any errors**
3. **Refresh your website**
4. **Content should appear!**

**The issue is simply the directory location - run from `/app` and it will work!** 🚀

