// Add September 2025 Ghana Culture, Heritage & Eco-Tourism Tour
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

const septemberTour = {
  title: "10-Day Ghana Culture, Heritage & Eco-Tourism Tour - September 2025",
  description: "A comprehensive 10-day journey through Ghana's rich culture, heritage, and eco-tourism sites. Visit Accra, Kumasi, Cape Coast, Elmina, Takoradi, and the unique Nzulezu Stilt Village. Experience historic slave castles, Kakum National Park, Assin Manso slave memorial, Ashanti cultural sites, craft villages, Kejetia Market, Bisa Abrewa Museum, and the remarkable stilt village on water. Includes Shai Hills wildlife and Akosombo Dam.",
  durationDays: 10,
  durationNights: 9,
  regions: ["Greater Accra", "Ashanti", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park (Pan African Movement leader)",
    "W.E.B Dubois Center for Pan Africanism",
    "Arts & Crafts Center shopping",
    "Ejisu Besease Shrine (hometown of Nana Yaa Asantewaa, Warrior Queen)",
    "Kwame Nkrumah University of Science and Technology",
    "Manhyia Palace Museum",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Kejetia Market (one of largest in West Africa)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Assin Manso Slavery Memorial & Slave River (Donko Nsuo)",
    "Traditional naming ceremony at river (Reverence to the Ancestors)",
    "Cape Coast Castle & Door of No Return",
    "Fishing village outside castle walls",
    "Elmina (St. George's) Castle & Slave Dungeons",
    "Bisa Abrewa Museum (Colonial to Independence History)",
    "Nzulezu Stilt Village on water (unique UNESCO site)",
    "Shai Hills Resource Reserve (Wildlife: Baboons, Zebras, Ostriches, Antelopes)",
    "Tema Motorway (first of its kind)",
    "Akosombo Dam & Adomi Bridge",
    "Volta Lake (one of largest man-made lakes in world)"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "September 2025",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour guide and board tour bus",
        "Check-in and Dinner at Movenpick Hotel"
      ],
      meals: "Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Arrival day - settle in after your journey"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "September 2025",
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
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Full day exploring Ghana's capital and its historical significance"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI",
      date: "September 2025",
      activities: [
        "Early breakfast",
        "Check out of the hotel",
        "Depart for Kumasi the Capital City of the Ashanti Region",
        "Early afternoon arrival in Ejisu, the hometown of Nana Yaa Asantewaa, the Warrior Queen",
        "  - It is also the site of the Ejisu Besease Shrine, a traditional Asante Shrine",
        "Continue the road trip to Kumasi",
        "Start the City Tour by driving through Kwame Nkrumah University of Science and Technology",
        "Tour of Manhyiaa Palace Museum",
        "  - Learn about Ashanti (Asante) history and culture",
        "Transfer to the hotel for check in"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Hotel",
      notes: "Journey to the heart of Ashanti culture"
    },
    {
      day: 4,
      title: "KUMASI",
      date: "September 2025",
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
      day: 5,
      title: "KUMASI TO CAPE COAST VIA ASSIN MANSO",
      date: "September 2025",
      activities: [
        "Breakfast at hotel",
        "Check out of the hotel",
        "Depart on a road trip to the Central Region to Assin Manso",
        "Upon arrival, tour the Slavery Memorial and the Slave River (Donko Nsuo)",
        "  - Take off your shoes and walk to the river",
        "  - Dip your feet/stand in the river as a sign of 'Reverence to the Ancestors'",
        "After completion of this emotional experience, continue the road trip to Cape Coast",
        "Afternoon tour of the Cape Coast Castle and Slavery Museum",
        "  - Go on an emotional tour of the Slave Dungeons",
        "  - Walk through the 'Door of No Return'",
        "Tour the fishing village outside the castle walls",
        "Transfer to your resort for check-in"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Emotional ancestral connection at slave river, then historic castle tour"
    },
    {
      day: 6,
      title: "ELMINA & TAKORADI",
      date: "September 2025",
      activities: [
        "After breakfast, visit Elmina (St. George's) Dungeon for another emotional tour of its Slave Dungeons",
        "Depart to the Bisa Abrewa Museum for Colonial to Independence History of Ghana in Takoradi"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Mahaa Beach Resort",
      notes: "Historical sites and museum visit, overnight at Mahaa Beach Resort"
    },
    {
      day: 7,
      title: "NZULEZU STILT VILLAGE",
      date: "September 2025",
      activities: [
        "After breakfast, visit the Nzulezu Stilt Village on water",
        "  - Unique UNESCO site - entire village built on stilts over water",
        "Return to resort"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Unique experience visiting the remarkable stilt village on water"
    },
    {
      day: 8,
      title: "CAPE COAST TO ACCRA",
      date: "September 2025",
      activities: [
        "After breakfast, depart Cape Coast for Accra",
        "Mid-day arrival in Accra",
        "Transfer to hotel for check-in"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Return journey to Accra"
    },
    {
      day: 9,
      title: "ACCRA - SHAI HILLS & AKOSOMBO",
      date: "September 2025",
      activities: [
        "After breakfast, check out of the hotel",
        "Start a road trip to the Eastern Region of Ghana",
        "Your drive goes through Tema Motorway",
        "  - The first of its kind in the country built by the country's first president, Kwame Nkrumah",
        "Visit Shai Hills Resource Reserve",
        "  - Interact with the Baboons that eagerly receive bananas given to them",
        "  - See a variety of animals including Zebras and Ostriches",
        "  - See different species of antelopes such as KOB, BUSHBUCK and DUIKER",
        "Continue on to Akosombo in the Eastern region",
        "  - It is the location of the Volta Lake, one of the largest man-made lakes in the world",
        "Visit Akosombo Dam and Adomi Bridge"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Eco-tourism day with wildlife viewing and engineering marvels"
    },
    {
      day: 10,
      title: "DEPARTURE DAY - ACCRA",
      date: "September 2025",
      activities: [
        "After breakfast",
        "Departure to the Airport at Morning or Evening"
      ],
      meals: "Breakfast",
      accommodation: "None",
      notes: "Departure with flexible timing"
    }
  ],
  inclusions: [
    "9 nights accommodation at quality hotels (Movenpick Ambassador Hotel, Lancaster Hotel, Coconut Grove Beach Resort, Mahaa Beach Resort)",
    "Daily breakfast",
    "Welcome dinner on Day 2",
    "Dinners included as indicated in itinerary",
    "All ground transportation in air-conditioned tour bus",
    "Professional tour guide",
    "Entrance fees to all sites and attractions",
    "Bisa Abrewa Museum visit",
    "Nzulezu Stilt Village visit",
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
    { name: "Movenpick Ambassador Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 3, then Day 8", notes: "Days 1-2 and 8-9" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5", notes: "Days 3-4" },
    { name: "Coconut Grove Beach Resort", location: "Cape Coast", nights: 2, checkIn: "Day 5", checkOut: "Day 7", notes: "Days 5 and 7" },
    { name: "Mahaa Beach Resort", location: "Takoradi", nights: 1, checkIn: "Day 6", checkOut: "Day 7", notes: "Day 6" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/september-2025-tour.jpg",
  galleryImages: [],
  groupSizeMin: 6,
  groupSizeMax: null,
  availableDates: ["2025-09-01"],
  notes: "Tour dates: September 2025. Cost per person for ground tour: $2,660.00 based on double occupancy for 6 pax. This comprehensive tour combines culture, heritage, and eco-tourism. Features unique Nzulezu Stilt Village on water (UNESCO site), historic slave castles, Assin Manso slave memorial with river ceremony, Ashanti cultural sites, craft villages, Kejetia Market, Bisa Abrewa Museum, Shai Hills wildlife, and Akosombo Dam. Includes overnight at Mahaa Beach Resort.",
  pricePerPerson: 0,
  singleSupplement: null
}

async function addSeptemberTour() {
  try {
    console.log('🔄 Adding September 2025 Ghana Culture, Heritage & Eco-Tourism Tour...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "September 2025"
        }
      }
    })
    
    const slug = createSlug(septemberTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...septemberTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...septemberTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ September 2025 Tour added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addSeptemberTour()

