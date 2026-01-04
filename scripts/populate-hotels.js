require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please check your .env file.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Hotel data with details researched for Ghana hotels
const hotelsData = [
  {
    name: "Movenpick Ambassador Hotel",
    location: "Accra",
    region: "Greater Accra",
    address: "Independence Avenue, Accra, Ghana",
    phone: "+233 302 611 000",
    rating: 4.5,
    featured: true,
    featuredImage: "/images/hotels/movenpick-ambassador-hotel.jpg",
    description: "A luxurious 5-star hotel located in the heart of Accra, offering world-class amenities including multiple restaurants, a spa, fitness center, and outdoor pool. The hotel features elegant rooms with modern amenities and stunning city views. Perfect for business and leisure travelers seeking comfort and convenience in Ghana's capital.",
    website: "https://www.movenpick.com/en/africa/ghana/accra/ambassador-hotel-accra"
  },
  {
    name: "La-Palm Royal Beach Hotel",
    location: "Accra",
    region: "Greater Accra",
    address: "No. 1 La Bypass, Accra, Ghana",
    phone: "+233 302 771 700",
    rating: 4.3,
    featured: true,
    featuredImage: "/images/hotels/la-palm-royal-beach-hotel.jpg",
    description: "A beautiful beachfront hotel offering direct access to the Atlantic Ocean. Features include multiple dining options, a beach bar, swimming pool, and well-appointed rooms with ocean or garden views. The hotel combines modern comfort with traditional Ghanaian hospitality, making it an ideal base for exploring Accra.",
    website: "https://www.lapalmroyalbeach.com"
  },
  {
    name: "Lancaster Kumasi City Hotel",
    location: "Kumasi",
    region: "Ashanti",
    address: "Prempeh II Street, Kumasi, Ghana",
    phone: "+233 322 020 000",
    rating: 4.2,
    featured: true,
    featuredImage: "/images/hotels/lancaster-kumasi-city-hotel.jpg",
    description: "A modern 4-star hotel in the heart of Kumasi, the cultural capital of Ghana. The hotel offers comfortable accommodations, excellent dining options, and easy access to Kumasi's cultural attractions including the Manhyia Palace, Kejetia Market, and craft villages. Perfect for travelers exploring Ashanti culture.",
    website: "https://www.lancasterkumasi.com"
  },
  {
    name: "Coconut Grove Beach Resort",
    location: "Elmina",
    region: "Central",
    address: "Elmina Beach Road, Elmina, Ghana",
    phone: "+233 332 332 000",
    rating: 4.4,
    featured: true,
    featuredImage: "/images/hotels/coconut-grove-beach-resort.jpg",
    description: "A stunning beachfront resort located near the historic Elmina Castle. The resort features beautiful rooms with ocean views, a private beach, swimming pool, and excellent seafood restaurants. The perfect blend of relaxation and history, with easy access to Cape Coast Castle and Kakum National Park.",
    website: "https://www.coconutgrovehotels.com/elmina"
  },
  {
    name: "Royal Senchi Resort",
    location: "Akosombo",
    region: "Eastern",
    address: "Akosombo, Eastern Region, Ghana",
    phone: "+233 244 333 333",
    rating: 4.6,
    featured: true,
    featuredImage: "/images/hotels/royal-senchi-resort.jpg",
    description: "A luxury resort nestled on the banks of the Volta Lake, offering breathtaking views and world-class amenities. Features include elegant rooms, multiple restaurants, spa facilities, water sports, and boat cruises. The resort provides a serene escape with easy access to the Akosombo Dam and Adomi Bridge.",
    website: "https://www.royalsenchi.com"
  }
];

async function populateHotels() {
  console.log('🏨 Starting hotel population...');

  try {
    // Clear existing hotels
    await prisma.hotel.deleteMany();
    console.log('✅ Cleared existing hotels');

    // Create hotels
    for (const hotel of hotelsData) {
      const created = await prisma.hotel.create({
        data: hotel
      });
      console.log(`✅ Created hotel: ${created.name}`);
    }

    console.log(`\n✅ Successfully populated ${hotelsData.length} hotels!`);
  } catch (error) {
    console.error('❌ Error populating hotels:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

populateHotels()
  .then(() => {
    console.log('\n🎉 Hotel population complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to populate hotels:', error);
    process.exit(1);
  });

