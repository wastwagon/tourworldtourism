# 🚀 Inline Seed Command - Copy & Paste This

## ✅ Run This Complete Command in Coolify Terminal

Copy this **entire block** and paste it into your terminal:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    console.log('🌱 Starting seed...');
    
    // Create Tour
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
        availableDates: ['2025-02-01', '2025-02-15', '2025-03-01'],
        featured: true,
        status: 'active',
        featuredImage: '/images/tours/accra-tour.jpg',
        galleryImages: []
      }
    });
    console.log('✅ Tour created:', tour.title);

    // Create Hotel
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

    // Create Blog
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

    // Create Testimonial
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
    console.log('✅ Testimonial created:', testimonial.name);

    console.log('🎉 Database seeded successfully!');
    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await prisma.\$disconnect();
    process.exit(1);
  }
})();
"
```

---

## 🔧 Fixed Version (if above has syntax error)

Try this corrected version:

```bash
node -e "const {PrismaClient}=require('@prisma/client');const {Pool}=require('pg');const {PrismaPg}=require('@prisma/adapter-pg');const p=new Pool({connectionString:process.env.DATABASE_URL});const a=new PrismaPg(p);const pr=new PrismaClient({adapter:a});(async()=>{try{const t=await pr.tour.create({data:{title:'Discover Accra',slug:'discover-accra',description:'Explore Accra',durationDays:1,durationNights:0,regions:['Greater Accra'],tourType:'Historical',highlights:['Square','Market'],inclusions:['Transport'],exclusions:['Tips'],itinerary:[{day:1,title:'Tour',activities:['Visit'],meals:'L',accommodation:'N/A'}],hotels:[],pricePerPerson:150,availableDates:['2025-02-01'],featured:true,status:'active',featuredImage:'/images/tours/accra.jpg',galleryImages:[]}});console.log('✅ Tour:',t.title);const h=await pr.hotel.create({data:{name:'Accra Hotel',location:'Accra',region:'Greater Accra',description:'Luxury hotel',featured:true,rating:4.5}});console.log('✅ Hotel:',h.name);const b=await pr.blog.create({data:{title:'Top Places in Ghana',slug:'top-places',excerpt:'Discover Ghana',content:'Ghana is beautiful...',author:'TOURWORLD TOURISM',category:'Tourism',tags:['Ghana'],featured:true,published:true}});console.log('✅ Blog:',b.title);console.log('🎉 Done!');await pr.\$disconnect();}catch(e){console.error('❌',e.message);await pr.\$disconnect();process.exit(1);}})();"
```

---

## 📝 Step by Step (Easier to Debug)

If the above doesn't work, create a temporary file:

```bash
# Create seed file
cat > /tmp/seed.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    const tour = await prisma.tour.create({
      data: {
        title: 'Discover Accra',
        slug: 'discover-accra',
        description: 'Explore Accra',
        durationDays: 1,
        durationNights: 0,
        regions: ['Greater Accra'],
        tourType: 'Historical',
        highlights: ['Square', 'Market'],
        inclusions: ['Transport'],
        exclusions: ['Tips'],
        itinerary: [{ day: 1, title: 'Tour', activities: ['Visit'], meals: 'L', accommodation: 'N/A' }],
        hotels: [],
        pricePerPerson: 150,
        availableDates: ['2025-02-01'],
        featured: true,
        status: 'active',
        featuredImage: '/images/tours/accra.jpg',
        galleryImages: []
      }
    });
    console.log('✅ Tour created:', tour.title);
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
EOF

# Run it
node /tmp/seed.js
```

---

## ✅ After Running

1. **Refresh your website**
2. **Content should appear!** 🎉

Try the **step-by-step version** (last one) - it's easier to debug if there are errors!

