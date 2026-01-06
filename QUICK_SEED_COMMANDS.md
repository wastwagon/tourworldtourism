# 🚀 Quick Seed Commands - Run Directly in Terminal

## ✅ Run These Commands in Coolify Terminal

Since the seed script file isn't deployed yet, run these commands directly:

---

## Step 1: Create Database Tables (if not done)

```bash
npx prisma db push --accept-data-loss
```

---

## Step 2: Seed Database - Copy & Paste This Entire Block

Run this complete command block in your terminal:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    // Create sample tour
    const tour = await prisma.tour.create({
      data: {
        title: 'Discover Accra - Capital City Tour',
        slug: 'discover-accra-capital-city-tour',
        description: 'Explore the vibrant capital city of Ghana, Accra, with its rich history, bustling markets, and modern attractions.',
        shortDescription: 'Experience the heart of Ghana capital city',
        duration: '1 Day',
        price: 150,
        featuredImage: '/images/tours/accra-tour.jpg',
        images: ['/images/tours/accra-tour.jpg'],
        featured: true,
        status: 'active',
        highlights: ['Visit Independence Square', 'Explore Makola Market', 'See Jamestown Lighthouse'],
        inclusions: ['Transportation', 'Lunch', 'Tour guide'],
        exclusions: ['Personal expenses', 'Tips'],
        itinerary: [{ day: 1, title: 'Accra City Tour', description: 'Full day exploring Accra main attractions', activities: ['Independence Square', 'Makola Market', 'Jamestown'] }],
        dates: [{ date: new Date('2025-02-01'), available: true, price: 150 }]
      }
    });
    console.log('✅ Created tour:', tour.title);

    // Create sample hotel
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
    console.log('✅ Created hotel:', hotel.name);

    // Create sample blog
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
    console.log('✅ Created blog:', blog.title);

    // Create sample testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        rating: 5,
        comment: 'Amazing experience! The tour guides were knowledgeable and friendly. Highly recommended!',
        tourName: 'Discover Accra - Capital City Tour',
        featured: true,
        published: true
      }
    });
    console.log('✅ Created testimonial:', testimonial.name);

    console.log('🎉 Database seeded successfully!');
    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.\$disconnect();
    process.exit(1);
  }
})();
"
```

---

## ✅ Simpler Alternative - One Command at a Time

If the above doesn't work, try creating data one piece at a time:

### Create a Tour:

```bash
node -e "const {PrismaClient}=require('@prisma/client');const {Pool}=require('pg');const {PrismaPg}=require('@prisma/adapter-pg');const p=new Pool({connectionString:process.env.DATABASE_URL});const a=new PrismaPg(p);const pr=new PrismaClient({adapter:a});(async()=>{const t=await pr.tour.create({data:{title:'Discover Accra',slug:'discover-accra',description:'Explore Accra',duration:'1 Day',price:150,featured:true,status:'active',highlights:['Square','Market'],inclusions:['Transport'],exclusions:['Tips'],itinerary:[{day:1,title:'Tour',activities:['Visit']}],dates:[{date:new Date('2025-02-01'),available:true,price:150}]}});console.log('✅ Tour created:',t.title);await pr.\$disconnect();})();"
```

---

## 🔍 Check What's in Database

```bash
# List all tours
node -e "const {PrismaClient}=require('@prisma/client');const {Pool}=require('pg');const {PrismaPg}=require('@prisma/adapter-pg');const p=new Pool({connectionString:process.env.DATABASE_URL});const a=new PrismaPg(p);const pr=new PrismaClient({adapter:a});(async()=>{const tours=await pr.tour.findMany();console.log('Tours:',tours.length);tours.forEach(t=>console.log('-',t.title));await pr.\$disconnect();})();"
```

---

## 📝 After Seeding

1. **Refresh your website**
2. **Content should appear!** 🎉

---

## 🆘 If Commands Fail

Share the error message and I'll help fix it!

