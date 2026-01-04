// Add SuePat Travel - May 2025 Tour
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

const suePatTour = {
  title: "9-Day Ghana Culture, Heritage & Eco-Tourism Tour - SuePat Travel",
  description: "A comprehensive 9-day journey through Ghana's rich culture, heritage, and eco-tourism sites. Visit Accra, Kumasi, and Cape Coast. Experience historic slave castles, Assin Manso slave memorial, Ashanti cultural sites with naming ceremony, craft villages, and optional Ghana cooking workshop. Includes custom Ghanaian design wear tailoring. Organized by SuePat Travel.",
  durationDays: 9,
  durationNights: 8,
  regions: ["Greater Accra", "Ashanti", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "T.K Beads Factory and Boutique",
    "Independence Square and Freedom Arch/Black Star Gate",
    "National Museum or Kwame Nkrumah Mausoleum",
    "Arts & Crafts center",
    "Custom Ghanaian design wear tailoring",
    "W.E.B Dubois Center",
    "Ejisu Besease Shrine (UNESCO World Heritage Site - hometown of Nana Yaa Asantewaa, Warrior Queen)",
    "Kwame Nkrumah University of Science and Technology",
    "Manhyia Palace Museum",
    "Ntonsu (center of Adinkra Cloth production)",
    "Ahwiaa (Wood Carving Village)",
    "Bonwire (major production site of Kente Cloth)",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Traditional Naming Ceremony with Chief and Queen Mother (receive Asante Day Name, Kente strip, and certificate)",
    "Assin Manso Slavery Memorial & Slave River (Ndonkor Nsuo)",
    "Elmina (St. Georges) Castle & Slave Dungeons",
    "Cape Coast Castle & Door of No Return",
    "University and village tour in Cape Coast",
    "Optional Ghana Cooking Workshop"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA - WELCOME TO GHANA",
      date: "Thursday, May 8th, 2025",
      activities: [
        "Arrival at Kotoka International Airport",
        "  - United Airlines Fl# UA996 – 9:05 A.M.",
        "  - Delta Airlines Fl# DL156 – 6:45 A.M.",
        "On arrival – Concierge welcome service",
        "Clear Immigration & Customs",
        "Currency exchange",
        "Visit T. K. Beads Factory and Boutique",
        "Independence Square and Freedom Arch/Black Star Gate",
        "Accra neighborhoods on way to hotel",
        "Check-in and Dinner at Movenpick Hotel"
      ],
      meals: "Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Arrival day with welcome service and initial site visits"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Friday, May 9th, 2025",
      activities: [
        "Tour coverage:",
        "  - National Museum or Kwame Nkrumah Mausoleum (if reopened)",
        "  - Arts & Crafts center",
        "  - Visit by Tailors and Seamstresses for local made Ghanaian design wear"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Cultural sites and custom outfit ordering"
    },
    {
      day: 3,
      title: "ACCRA",
      date: "Saturday, May 10th, 2025",
      activities: [
        "Check-out hotel and depart (3-4 hrs with stops) to Accra",
        "Tour coverage:",
        "  - W.E.B Dubois Center",
        "  - GA community",
        "  - Shopping (arts and crafts)"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Additional Accra sites and shopping"
    },
    {
      day: 4,
      title: "ACCRA TO KUMASI - ASHANTI REGION",
      date: "Sunday, May 11th, 2025",
      activities: [
        "Check-out hotel and depart (5 hrs with stops) to Kumasi",
        "Tour Coverage:",
        "  - Ejisu Besease is the hometown of Nana Yaa Asantewaa the Warrior Queen",
        "  - Unique and traditional Asante Shrine is a UNESCO World Heritage Site",
        "  - Kwame Nkrumah University of Science and Technology",
        "  - Manhyiaa Palace Museum",
        "  - Ntonsu, the center of Adinkra Cloth production in Ghana",
        "Check-in – overnight and dinner at Lancaster Kumasi City Hotel"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Kumasi City Hotel",
      notes: "Journey to Ashanti capital with cultural stops"
    },
    {
      day: 5,
      title: "KUMASI - NAMING CEREMONY",
      date: "Monday, May 12th, 2025",
      activities: [
        "Tour Coverage:",
        "  - Ahwiaa, the Wood Carving Village",
        "  - Bonwire, a major production site of Ghana's rich and colorful Kente Cloth",
        "  - Kumasi Cultural Center (Prempeh II Museum) to learn about Ashanti (Asante) history and culture",
        "  - Naming Ceremony witnessed by a Chief, Queen Mother and invited guests",
        "    - Learn your Asante Day Name and Surname",
        "    - Have it woven on a Kente strip",
        "    - Receive a certificate with your Asante name inscribed on it",
        "    - (Dress in White clothes)",
        "Opportunity to view and shop various arts, crafts, souvenirs",
        "Dinner and overnight at Lancaster Kumasi City Hotel"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Kumasi City Hotel",
      notes: "Full cultural immersion day with personalized naming ceremony and craft villages"
    },
    {
      day: 6,
      title: "KUMASI TO CAPE COAST VIA ASSIN MANSO & ELMINA",
      date: "Tuesday, May 13th, 2025",
      activities: [
        "Check-out hotel and depart (3-4 hrs with stops) to Cape Coast",
        "Transfer to your resort for check-in after visiting Assin Manso & Elmina",
        "Tour Coverage:",
        "  - Assin Manso in the early afternoon for a tour of the Slavery Memorial and Slave River (Ndonkor Nsuo)",
        "  - Journey southwards towards the coastline",
        "  - Elmina (St. Georges) Castle for a tour and walk through of the Slave Dungeons",
        "Dinner and Overnight: Coconut Grove Beach Resort"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Emotional ancestral connection at slave river, then historic castle tour"
    },
    {
      day: 7,
      title: "CAPE COAST",
      date: "Wednesday, May 14th, 2025",
      activities: [
        "Tour Coverage:",
        "  - Cape Coast Castle and Slavery Museum",
        "  - Slave Dungeons and the Door of No Return",
        "  - University and village tour",
        "  - Scenic Cape Coast tour",
        "GHANA COOKING WORKSHOP – OPTIONAL",
        "  - Intimate opportunity to learn how to prepare some Ghanaian meals",
        "Dinner and Overnight: Coconut Grove Beach Resort"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Historic castle tour with optional cooking workshop experience"
    },
    {
      day: 8,
      title: "CAPE COAST TO ACCRA - DEPARTURE (United Airlines)",
      date: "Thursday, May 15th, 2025",
      activities: [
        "Morning at leisure",
        "Check-out hotel and depart (3-4 hrs with stops) to Accra",
        "Tour coverage: After lunch drive to Accra",
        "Meet with tailors/seamstress near airport area",
        "Any last-minute shopping near airport if needed",
        "Dinner near airport",
        "7:45 PM - DEPARTURE to airport",
        "To IAD – UNITED AIRLINES FL #UA 997 – 11:20 P.M"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Hotel near ACC airport (for JFK passengers)",
      notes: "Return to Accra with custom outfit fittings and United Airlines evening departure"
    },
    {
      day: 9,
      title: "DEPARTURE DAY - ACCRA (Delta Airlines)",
      date: "Friday, May 16th, 2025",
      activities: [
        "Early Morning (box take away breakfast)",
        "6:00 A.M. departure from Hotel to the Airport",
        "TO JFK – Delta Airlines Fl# DL157 – 9:00 A.M."
      ],
      meals: "Breakfast",
      accommodation: "None",
      notes: "Delta Airlines early morning departure with packed breakfast"
    }
  ],
  inclusions: [
    "8 nights accommodation at quality hotels (Movenpick Ambassador Hotel, Lancaster Kumasi City Hotel, Coconut Grove Beach Resort)",
    "Daily breakfast",
    "Dinners included as indicated in itinerary",
    "Packed breakfast for early departure (Day 9 - Delta Airlines)",
    "All ground transportation in air-conditioned vehicle",
    "Concierge welcome service at airport",
    "Professional tour guide",
    "Entrance fees to all sites and attractions",
    "Traditional Naming Ceremony with Chief and Queen Mother (receive Asante Day Name, Kente strip, and certificate)",
    "Custom Ghanaian design wear tailoring (order Day 2, fitting Day 8)",
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
    "Custom outfit fabric and tailoring costs",
    "Shopping expenses",
    "Optional Ghana Cooking Workshop",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "Movenpick Ambassador Hotel", location: "Accra", nights: 3, checkIn: "Day 1", checkOut: "Day 4", notes: "May 8-11", address: "Independence Avenue Ridge, Pmb Ct 343, Ghana", phone: "+233 302611000" },
    { name: "Lancaster Kumasi City Hotel", location: "Kumasi", nights: 2, checkIn: "Day 4", checkOut: "Day 6", notes: "May 11-13", address: "Rain Tree Street, Lesley Opoku-Ware Drive, Kumasi, Ghana", phone: "+233 32 208 3777" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 2, checkIn: "Day 6", checkOut: "Day 8", notes: "May 13-15", address: "Mbofra Akyinim Street Off Cape Coast-Takoradi highway, Elmina 80361 Ghana", phone: "(+233) 244333001" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/suepat-tour.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-05-08"],
  notes: "Tour dates: May 8-15/16, 2025. Departure: May 7th (Day 0) - United Airlines UA996 6:50 PM from IAD or Delta DL156 4:15 AM from JFK. Organizer: SuePat Travel - Tour Planner Sue Patrice (240-472-2140, susan@suepattravel.com, 7400 Buchanan Street, Unit 2400, Hyattsville, MD 20784). Associate: Bernadette Billy (bernierose2@verizon.net, 3016758763). Tour Operator: KOFI GHANSAH - TOURWORLD TOURISM SERVICES LTD. (+233 54 778 3865, tourworldtourism2007@gmail.com). Features unique experiences: UNESCO World Heritage Site visit (Ejisu Besease Shrine), traditional naming ceremony with certificate and Kente strip, optional Ghana cooking workshop, and custom Ghanaian design wear tailoring. Flexible departure: United Airlines (Day 8, 11:20 PM) or Delta Airlines (Day 9, 9:00 AM).",
  pricePerPerson: 0,
  singleSupplement: null
}

async function addSuePatTour() {
  try {
    console.log('🔄 Adding SuePat Travel - May 2025 Tour...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "SuePat"
        }
      }
    })
    
    const slug = createSlug(suePatTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...suePatTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...suePatTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ SuePat Travel tour added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addSuePatTour()

