// Add Bakaano Travel and Tours - September 2025
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

const bakaanoTour = {
  title: "11-Day Ghana Culture & Heritage Tour - Bakaano Travel and Tours",
  description: "An immersive 11-day journey through Ghana's rich culture and heritage. Visit Accra, Cape Coast, Elmina, Takoradi, and Kumasi. Experience historic slave castles, Kakum National Forest Park, Fetu Festival in Cape Coast, Assin Manso Ancestral River Site, Ashanti craft villages, and cultural sites. Includes Aburi Gardens, University of Ghana tour, and Orange Friday celebration.",
  durationDays: 11,
  durationNights: 10,
  regions: ["Greater Accra", "Central", "Ashanti"],
  tourType: "Culture & Heritage",
  highlights: [
    "University of Ghana tour",
    "Aburi Gardens",
    "W.E.B Dubois Center",
    "Kwame Nkrumah Mausoleum",
    "Cape Coast Castle",
    "Elmina Castle",
    "Kakum National Forest Park",
    "Fetu Festival participation (Cape Coast)",
    "Orange Friday celebration (Cape Coast)",
    "Day Trip to Oil City - Takoradi",
    "Assin Manso Ancestral River Site",
    "Kumasi - capital of ancient royal Asante Kingdom",
    "Craft Villages: Bonwire (Kente weavers), Ntonso (Adinkra cloth stamping), Ahwia (Carving)",
    "University of Cape Coast (UCC) drive through",
    "Becky Kay restaurant (Cape Coast)"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "Monday, September 1st, 2025",
      activities: [
        "Arrive at Kotoka International Airport, Accra, Ghana",
        "Met at the airport and transported by bus to your hotel",
        "Orientation, Akwaaba (Welcome)",
        "Rest & Relaxation at the LA PALM Hotel Accra"
      ],
      meals: "Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Arrival day - settle in and rest after your journey"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Tuesday, September 2nd, 2025",
      activities: [
        "Breakfast and Dinner at La Palm",
        "Drive through University of Ghana and adjoining communities",
        "Visit to Aburi Gardens",
        "W.E.B Dubois Center",
        "Kwame Nkrumah Mausoleum"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Full day exploring Accra's cultural and educational sites"
    },
    {
      day: 3,
      title: "ACCRA TO CAPE COAST/ELMINA",
      date: "Wednesday, September 3rd, 2025",
      activities: [
        "After breakfast, leave for Cape Coast and Elmina early morning",
        "Stop over at Becky Kay in Cape Coast for lunch",
        "Drive through UCC (University of Cape Coast) on way to Coconut Grove Hotel in Elmina",
        "Dinner at Coconut Grove"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Journey to Central Region with lunch stop and university drive-through"
    },
    {
      day: 4,
      title: "CAPE COAST & ELMINA CASTLES",
      date: "Thursday, September 4th, 2025",
      activities: [
        "Visit Cape Coast Castle after breakfast",
        "Visit Elmina Castle in the afternoon",
        "Lunch in town",
        "Dinner at Coconut Grove"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Emotional day visiting historic slave trade sites"
    },
    {
      day: 5,
      title: "TAKORADI - OIL CITY & ORANGE FRIDAY",
      date: "Friday, September 5th, 2025",
      activities: [
        "After breakfast",
        "Day Trip to the Oil City - Takoradi",
        "Return to Elmina",
        "Observe Orange Friday in Cape Coast"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Excursion to Takoradi and cultural celebration of Orange Friday"
    },
    {
      day: 6,
      title: "KAKUM & FETU FESTIVAL",
      date: "Saturday, September 6th, 2025",
      activities: [
        "After breakfast, Visit Kakum National Forest Park",
        "Drive to Cape Coast in the afternoon to participate in Fetu Festival",
        "Lunch in town",
        "Dinner at Coconut Grove"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Nature experience at Kakum and participation in traditional Fetu Festival"
    },
    {
      day: 7,
      title: "CAPE COAST TO KUMASI VIA ASSIN MANSO",
      date: "Sunday, September 7th, 2025",
      activities: [
        "After Breakfast, leave for Kumasi through Assin Manso Ancestral River Site",
        "Dinner and overnight at Kumasi Lancaster Hotel"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Hotel",
      notes: "Journey to Ashanti capital with stop at ancestral river site"
    },
    {
      day: 8,
      title: "KUMASI - CRAFT VILLAGES",
      date: "Monday, September 8th, 2025",
      activities: [
        "Breakfast and Dinner at Kumasi Lancaster Hotel",
        "Kumasi – capital of the ancient royal Asante Kingdom",
        "Visit neighboring historic towns:",
        "  - Bonwire - Kente weavers",
        "  - Ntonso – Adinkra cloth stamping",
        "  - Ahwia – Carving",
        "Overnight at Kumasi Lancaster Hotel"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Hotel",
      notes: "Full day exploring Kumasi and traditional craft villages"
    },
    {
      day: 9,
      title: "KUMASI TO ACCRA",
      date: "Tuesday, September 9th, 2025",
      activities: [
        "After breakfast, depart Kumasi for Accra",
        "Transfer to hotel for check-in",
        "Rest and relaxation"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Return journey to Accra"
    },
    {
      day: 10,
      title: "ACCRA - LEISURE DAY",
      date: "Wednesday, September 10th, 2025",
      activities: [
        "Day at Leisure",
        "Breakfast and Dinner at La Palm"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Relaxation day with shopping opportunities"
    },
    {
      day: 11,
      title: "DEPARTURE DAY - ACCRA",
      date: "Thursday, September 11th, 2025",
      activities: [
        "Breakfast at La Palm",
        "Checkout LA PALM Hotel Accra",
        "Evening/Morning Flight to Washington (depending on Airline)"
      ],
      meals: "Breakfast",
      accommodation: "None",
      notes: "Departure with flexible timing based on airline"
    }
  ],
  inclusions: [
    "10 nights accommodation at quality hotels (La-Palm Royal Beach Hotel, Coconut Grove Beach Resort, Lancaster Hotel)",
    "2 meals per day (Breakfast and Dinner)",
    "All ground transportation in air-conditioned coach bus",
    "Transfer to and from airport in Ghana",
    "Entry fees to all sites",
    "Professional Tour Guide",
    "Bottled water on all road trips",
    "Kakum National Forest Park visit",
    "Fetu Festival participation",
    "Orange Friday celebration"
  ],
  exclusions: [
    "International airfare (Currently $1,623 to $1,700, depending on time of purchase and airline)",
    "Trip Insurance",
    "Passport",
    "Visa application ($100 single entry, $180 multiple entry)",
    "Yellow Fever Vaccination (required)",
    "Lunches (lunches in town as indicated)",
    "Personal expenses",
    "Tips for guides and drivers",
    "Shopping expenses",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "La-Palm Royal Beach Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 3, then Day 9", notes: "Days 1-2 and 9-10" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 4, checkIn: "Day 3", checkOut: "Day 7", notes: "Days 3-6" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 7", checkOut: "Day 9", notes: "Days 7-8" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/bakaano-tour.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-09-01"],
  notes: "Tour dates: September 1-11, 2025. Departure: Sunday, August 30, 2025 from IAD Washington to Accra, Ghana. Organizer: Bakaano Travel and Tours (Email: kobart78@gmail.com). Single supplement: $600.00 extra. This tour features unique cultural experiences including Fetu Festival participation, Orange Friday celebration, and visits to Aburi Gardens. Includes Kakum National Forest Park, historic slave castles, Assin Manso Ancestral River Site, and Ashanti craft villages. Visa required: apply one month before departure. Yellow Fever vaccination required.",
  pricePerPerson: 0,
  singleSupplement: 600
}

async function addBakaanoTour() {
  try {
    console.log('🔄 Adding Bakaano Travel and Tours - September 2025...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "Bakaano"
        }
      }
    })
    
    const slug = createSlug(bakaanoTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...bakaanoTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...bakaanoTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ Bakaano Travel and Tours added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addBakaanoTour()

