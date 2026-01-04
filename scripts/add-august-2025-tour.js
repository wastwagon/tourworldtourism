// Add August 2025 Ghana Culture, Heritage & Eco-Tourism Tour
require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function createSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const augustTour = {
  title: "10-Day Ghana Culture, Heritage & Eco-Tourism Tour - August 2025",
  description: "A comprehensive 10-day journey through Ghana's rich culture, heritage, and eco-tourism sites. Visit Accra, Cape Coast, Elmina, Takoradi, and Kumasi. Experience historic slave castles, Kakum National Park canopy walk, Bisa Abrewa Museum, Ashanti cultural sites, and craft villages. This tour combines historical education with natural beauty and cultural immersion.",
  durationDays: 10,
  durationNights: 9,
  regions: ["Greater Accra", "Ashanti", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park (Pan African Movement leader)",
    "W.E.B Dubois Center for Pan Africanism",
    "Arts & Crafts Center shopping",
    "Cape Coast Castle & Door of No Return",
    "Elmina (St. George's) Castle & Slave Dungeons",
    "Kakum National Park Canopy Walk",
    "University of Cape Coast",
    "Boarding High Schools tour",
    "Bisa Abrewa Museum (Colonial to Independence History)",
    "Assin Manso Slavery Memorial & Slave River",
    "Kwame Nkrumah University of Science and Technology",
    "Manhyia Palace Museum",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Kejetia Market (one of largest in West Africa)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Shai Hills Resource Reserve",
    "Akosombo Dam"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "Thursday, August 21st, 2025",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour guide and board tour bus",
        "Check-in and Dinner at La-Palm Hotel"
      ],
      meals: "Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Arrival day - settle in after your journey"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Friday, August 22nd, 2025",
      activities: [
        "Early breakfast",
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park",
        "  - Learn about the role the first president of Ghana played in the struggle for Independence from Britain, the colonial ruler",
        "  - Also learn about his leadership role in the Pan African Movement",
        "A visit to W.E.B Dubois Center for Pan Africanism",
        "Shopping at Arts & Crafts center",
        "Return to your hotel in the mid-afternoon",
        "Welcome Dinner at the hotel restaurant included"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Full day exploring Ghana's capital and its historical significance"
    },
    {
      day: 3,
      title: "ACCRA TO CAPE COAST",
      date: "Saturday, August 23rd, 2025",
      activities: [
        "Breakfast at hotel",
        "Check out of the hotel",
        "Depart on a road trip to Cape Coast in the Central Region with the stop at Gomoa Nsuaem",
        "Afternoon tour of the Cape Coast Castle and Slavery Museum",
        "  - Go on an emotional tour of the Slave Dungeons",
        "  - Walk through the 'Door of No Return'",
        "Drive past the fishing village outside the castle walls",
        "Transfer to your resort for check-in"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Emotional journey to historic slave trade sites"
    },
    {
      day: 4,
      title: "CAPE COAST - KAKUM & ELMINA",
      date: "Sunday, August 24th, 2025",
      activities: [
        "After breakfast, visit Kakum National Park",
        "City Tour of Cape Coast",
        "  - Venues of interest include boarding High Schools and the University of Cape Coast",
        "Afternoon arrival in Elmina",
        "Transfer to Elmina (St. George's) Castle for another emotional tour of its Slave Dungeons"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Nature experience at Kakum combined with historical sites"
    },
    {
      day: 5,
      title: "TAKORADI - BISA ABREWA MUSEUM",
      date: "Monday, August 25th, 2025",
      activities: [
        "After breakfast, depart Resort to visit the Bisa Abrewa Museum",
        "  - Learn about Colonial to Independence History of Ghana in Takoradi",
        "Return to resort"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Educational visit to unique museum showcasing Ghana's history"
    },
    {
      day: 6,
      title: "CAPE COAST TO KUMASI",
      date: "Tuesday, August 26th, 2025",
      activities: [
        "After breakfast",
        "Depart for Kumasi the Capital City of the Ashanti Region",
        "Stop at Assin Manso to visit the monument of slave return and the slave river",
        "Continue the road trip to Kumasi",
        "Start the City Tour by driving through Kwame Nkrumah University of Science and Technology",
        "Tour of Manhyiaa Palace Museum",
        "  - Learn about Ashanti (Asante) history and culture",
        "Transfer to the hotel for check in"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Hotel",
      notes: "Journey to the heart of Ashanti culture with historical stop"
    },
    {
      day: 7,
      title: "KUMASI",
      date: "Wednesday, August 27th, 2025",
      activities: [
        "After breakfast, continuation of the Kumasi City Tour",
        "Tour of Kumasi Cultural Center (Prempeh II Museum) and shopping at the Gift shops",
        "Go on a tour of Kejetia Market, one of the largest in West Africa",
        "  - Get a feel of the hustle and bustle of a local market",
        "Afternoon tour of and shopping at the 3 Craft Villages (Kente, Adinkra and Wood Carving):",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth",
        "Late afternoon transfer to your hotel"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Hotel",
      notes: "Full day exploring Kumasi's cultural centers, markets, and traditional crafts"
    },
    {
      day: 8,
      title: "KUMASI TO ACCRA",
      date: "Thursday, August 28th, 2025",
      activities: [
        "After breakfast, mid-morning check-out of the hotel",
        "Depart Kumasi to Accra",
        "Transfer to hotel for check-in"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Return journey to Accra"
    },
    {
      day: 9,
      title: "ACCRA - SHAI HILLS & AKOSOMBO",
      date: "Friday, August 29th, 2025",
      activities: [
        "After breakfast",
        "Visit Shai Hills Resource Reserve",
        "Visit Akosombo Dam",
        "Return to hotel"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Eco-tourism day with wildlife and engineering marvels"
    },
    {
      day: 10,
      title: "DEPARTURE DAY - ACCRA",
      date: "Saturday, August 30th, 2025",
      activities: [
        "After breakfast",
        "Take part in last minute shopping",
        "Departure to the Airport in the Evening"
      ],
      meals: "Breakfast",
      accommodation: "None",
      notes: "Final shopping and departure"
    }
  ],
  inclusions: [
    "9 nights accommodation at quality hotels (La-Palm Royal Beach Hotel, Coconut Grove Beach Resort, Lancaster Hotel)",
    "Daily breakfast",
    "Welcome dinner on Day 2",
    "Dinners included as indicated in itinerary",
    "All ground transportation in air-conditioned tour bus",
    "Professional tour guide",
    "Entrance fees to all sites and attractions",
    "Kakum National Park Canopy Walk experience",
    "Bisa Abrewa Museum visit",
    "Bottled water during tours"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches (all lunches on own account throughout tour)",
    "Dinners not specified in itinerary",
    "Personal expenses",
    "Tips for guides and drivers",
    "Shopping expenses",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "La-Palm Royal Beach Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 3, then Day 8", notes: "Days 1-2 and 8-9" },
    { name: "Coconut Grove Beach Resort", location: "Cape Coast/Elmina", nights: 3, checkIn: "Day 3", checkOut: "Day 6", notes: "Days 3-5" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 6", checkOut: "Day 8", notes: "Days 6-7" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/august-2025-tour.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-08-21"],
  notes: "Tour dates: August 21-30, 2025. This comprehensive tour combines culture, heritage, and eco-tourism. Features visits to historic slave castles, Kakum National Park, Bisa Abrewa Museum, Ashanti cultural sites, and craft villages. Includes unique experiences like Kejetia Market tour and Shai Hills wildlife viewing.",
  pricePerPerson: 0,
  singleSupplement: null
}

async function addAugustTour() {
  try {
    console.log('🔄 Adding August 2025 Ghana Culture, Heritage & Eco-Tourism Tour...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "August 2025"
        }
      }
    })
    
    const slug = createSlug(augustTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...augustTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...augustTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ August 2025 Tour added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addAugustTour()

