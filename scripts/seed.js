// Alternative seeding script using Node.js directly (bypasses tsx issues)
require('dotenv/config')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.booking.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.contactInquiry.deleteMany()
  await prisma.tour.deleteMany()
  await prisma.hotel.deleteMany()
  await prisma.attraction.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleaned existing data')

  // Create admin user (simple password hash for demo)
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@tourworldtourism.com',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Created admin user')

  // Sample tours from seed.ts data
  const tours = [
    {
      title: "10-Day Ghana Heritage & Culture Experience - Beverley's Tour",
      slug: "10-day-ghana-heritage-culture-beverley-tour",
      description: "An immersive 10-day journey through Ghana's rich cultural heritage, from the vibrant capital of Accra to the historic castles of Cape Coast, the royal palaces of Kumasi, and the natural beauty of the Volta Lake. Experience authentic Ashanti culture, witness traditional craft villages, and walk in the footsteps of history at UNESCO World Heritage sites.",
      durationDays: 10,
      durationNights: 9,
      regions: ["Greater Accra", "Ashanti", "Central", "Eastern"],
      tourType: "Culture & Heritage",
      highlights: [
        "Independence Square & Freedom Arch",
        "Kwame Nkrumah Memorial Park",
        "W.E.B. DuBois Center",
        "Manhyia Palace Museum",
        "Kumasi Cultural Center (Prempeh II Museum)",
        "Bonwire Kente Village, Ahwiaa Wood Carvings, Ntonsu Adinkra",
        "Assin Manso Slave River Memorial",
        "Elmina Castle (St. George's)",
        "Cape Coast Castle & Door of No Return",
        "Kakum National Park Canopy Walkway",
        "Bisa Abrewa Museum, Takoradi",
        "Akosombo Dam & Volta Lake Cruise",
        "Shai Hills Resource Reserve",
        "Custom African outfit tailoring"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrive Accra",
          activities: [
            "Arrive Kotoka International Airport",
            "Complete Immigration & Customs",
            "Meet tour coordinator",
            "Transfer to hotel",
            "Check-in"
          ],
          meals: "Dinner on own account",
          accommodation: "La-Palm Royal Beach Hotel, Accra"
        },
        {
          day: 2,
          title: "Accra City Tour",
          activities: [
            "Independence Square & Freedom Arch",
            "Kwame Nkrumah Memorial Park",
            "W.E.B. DuBois Center",
            "Makola Market"
          ],
          meals: "B/L/D",
          accommodation: "La-Palm Royal Beach Hotel, Accra"
        }
      ],
      inclusions: [
        "Accommodation in 4-star hotels",
        "Daily breakfast",
        "All ground transportation in air-conditioned vehicle",
        "Professional tour guide",
        "Entrance fees to all sites",
        "Cultural performances",
        "Bottled water during tours"
      ],
      exclusions: [
        "International flights",
        "Visa fees",
        "Travel insurance",
        "Lunches and dinners (unless specified)",
        "Personal expenses",
        "Tips"
      ],
      hotels: [
        {
          name: "Movenpick Ambassador Hotel",
          location: "Accra",
          nights: 2,
          checkIn: "Day 1",
          checkOut: "Day 3"
        }
      ],
      pricePerPerson: 2450,
      singleSupplement: 850,
      groupSizeMin: 8,
      groupSizeMax: 20,
      availableDates: ["2024-12-05", "2025-01-02", "2025-02-06", "2025-03-06", "2025-04-03"],
      featured: true,
      status: "active",
      featuredImage: "/images/tours/beverley-tour.jpg",
      galleryImages: [
        "/images/tours/beverley-tour.jpg"
      ],
    },
    {
      title: "8-Day Ghana Deep Heritage Experience",
      slug: "deep-heritage-experience",
      description: "An immersive 8-day journey into Ghana's rich heritage with extended stays at key locations for deeper cultural immersion.",
      durationDays: 8,
      durationNights: 7,
      regions: ["Greater Accra", "Central", "Ashanti"],
      tourType: "Culture & Heritage",
      highlights: [
        "Cape Coast Castle & Door of No Return",
        "Elmina Castle",
        "Kakum National Park Canopy Walkway",
        "Manhyia Palace Museum",
        "Traditional Asante Naming Ceremony",
        "Craft Villages Tour"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Accra",
          activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"],
          meals: "D",
          accommodation: "Accra Hotel"
        },
        {
          day: 2,
          title: "Accra City Tour",
          activities: ["Independence Square", "Kwame Nkrumah Mausoleum", "Makola Market"],
          meals: "B/L/D",
          accommodation: "Accra Hotel"
        }
      ],
      inclusions: [
        "Airport transfers",
        "Accommodation",
        "Meals as specified",
        "Professional guide",
        "Entrance fees"
      ],
      exclusions: [
        "International flights",
        "Visa fees",
        "Travel insurance",
        "Personal expenses"
      ],
      hotels: [],
      pricePerPerson: 1950,
      singleSupplement: 650,
      groupSizeMin: 6,
      groupSizeMax: 16,
      availableDates: ["2025-01-15", "2025-02-20", "2025-03-25"],
      featured: true,
      status: "active",
      featuredImage: "/images/tours/deep-heritage-experience.jpg",
      galleryImages: [],
    },
    {
      title: "6-Day Ghana Highlights Express",
      slug: "highlights-express",
      description: "A perfect 6-day introduction to Ghana's most iconic attractions, ideal for first-time visitors.",
      durationDays: 6,
      durationNights: 5,
      regions: ["Greater Accra", "Central"],
      tourType: "Culture & Heritage",
      highlights: [
        "Independence Square & Freedom Arch",
        "Cape Coast Castle & Door of No Return",
        "Kakum National Park Canopy Walkway",
        "Elmina Castle",
        "Accra Markets"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival",
          activities: ["Airport pickup", "Hotel check-in"],
          meals: "D",
          accommodation: "Accra Hotel"
        }
      ],
      inclusions: [
        "Airport transfers",
        "Accommodation",
        "Breakfast daily",
        "Professional guide",
        "Entrance fees"
      ],
      exclusions: [
        "International flights",
        "Lunches and dinners",
        "Personal expenses"
      ],
      hotels: [],
      pricePerPerson: 1450,
      singleSupplement: 450,
      groupSizeMin: 4,
      groupSizeMax: 12,
      availableDates: ["2025-01-10", "2025-02-15", "2025-03-20"],
      featured: false,
      status: "active",
      featuredImage: "/images/tours/highlights-express.jpg",
      galleryImages: [],
    },
    {
      title: "12-Day Ultimate Ghana Experience",
      slug: "ultimate-ghana-experience",
      description: "The most comprehensive Ghana tour experience covering all major regions, perfect for those wanting to see everything.",
      durationDays: 12,
      durationNights: 11,
      regions: ["Greater Accra", "Ashanti", "Central", "Eastern", "Western"],
      tourType: "Culture & Heritage",
      highlights: [
        "All major heritage sites",
        "Traditional Asante Naming Ceremony",
        "Volta Lake Cruise",
        "Wli Waterfalls",
        "5 regions covered",
        "Extended cultural immersion"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival",
          activities: ["Airport pickup", "Hotel check-in"],
          meals: "D",
          accommodation: "Accra Hotel"
        }
      ],
      inclusions: [
        "All accommodations",
        "All meals",
        "Professional guide",
        "All entrance fees",
        "Transportation"
      ],
      exclusions: [
        "International flights",
        "Personal expenses"
      ],
      hotels: [],
      pricePerPerson: 3500,
      singleSupplement: 1200,
      groupSizeMin: 8,
      groupSizeMax: 20,
      availableDates: ["2025-02-01", "2025-04-01", "2025-06-01"],
      featured: true,
      status: "active",
      featuredImage: "/images/tours/ultimate-ghana-experience.jpg",
      galleryImages: [],
    }
  ]

  // Create tours
  for (const tour of tours) {
    await prisma.tour.create({ data: tour })
    console.log(`✅ Created tour: ${tour.title}`)
  }

  console.log('✅ Database seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

