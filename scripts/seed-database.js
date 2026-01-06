require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please check your environment variables.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Sample tours
    const tour1 = await prisma.tour.create({
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
        itinerary: [
          {
            day: 1,
            title: 'Accra City Tour',
            description: 'Full day exploring Accra\'s main attractions',
            activities: ['Independence Square', 'Makola Market', 'Jamestown']
          }
        ],
        dates: [
          {
            date: new Date('2025-02-01'),
            available: true,
            price: 150
          }
        ]
      },
    });

    const tour2 = await prisma.tour.create({
      data: {
        title: 'Cape Coast & Elmina Castle',
        slug: 'cape-coast-elmina-castle',
        description: 'Visit the historic Cape Coast and Elmina Castles, UNESCO World Heritage Sites that tell the story of the transatlantic slave trade.',
        shortDescription: 'Historic castles and coastal beauty',
        duration: '1 Day',
        price: 200,
        featuredImage: '/images/tours/cape-coast.jpg',
        images: ['/images/tours/cape-coast.jpg'],
        featured: true,
        status: 'active',
        highlights: ['Cape Coast Castle', 'Elmina Castle', 'Kakum National Park'],
        inclusions: ['Transportation', 'Lunch', 'Entrance fees', 'Tour guide'],
        exclusions: ['Personal expenses', 'Tips'],
        itinerary: [
          {
            day: 1,
            title: 'Cape Coast & Elmina',
            description: 'Explore historic castles and natural beauty',
            activities: ['Cape Coast Castle tour', 'Elmina Castle visit', 'Kakum canopy walk']
          }
        ],
        dates: [
          {
            date: new Date('2025-02-05'),
            available: true,
            price: 200
          }
        ]
      },
    });

    // Sample hotel
    const hotel1 = await prisma.hotel.create({
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
        rating: 4.5,
      },
    });

    // Sample blog
    const blog1 = await prisma.blog.create({
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
        published: true,
      },
    });

    // Sample testimonial
    const testimonial1 = await prisma.testimonial.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        rating: 5,
        comment: 'Amazing experience! The tour guides were knowledgeable and friendly. Highly recommended!',
        tourName: 'Discover Accra - Capital City Tour',
        featured: true,
        published: true,
      },
    });

    console.log('✅ Sample data created:');
    console.log(`   - Tour: ${tour1.title}`);
    console.log(`   - Tour: ${tour2.title}`);
    console.log(`   - Hotel: ${hotel1.name}`);
    console.log(`   - Blog: ${blog1.title}`);
    console.log(`   - Testimonial: ${testimonial1.name}`);
    console.log('\n🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(() => {
    console.log('\n✅ Seed complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  });

