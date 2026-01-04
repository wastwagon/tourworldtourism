// Add July 2025 Ghana Culture, Heritage & Eco-Tourism Tour
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

const julyTour = {
  title: "10-Day Ghana Culture, Heritage & Eco-Tourism Tour - July 2025",
  description: "A comprehensive 10-day journey through Ghana's rich culture, heritage, and eco-tourism sites. Visit Accra, Cape Coast, Elmina, and Kumasi. Experience historic slave castles, Kakum National Park canopy walk, Assin Manso slave memorial, Ashanti cultural sites with naming ceremony, craft villages, and meetings with mayors. Includes custom African dress tailoring.",
  durationDays: 10,
  durationNights: 9,
  regions: ["Greater Accra", "Central", "Ashanti"],
  tourType: "Culture & Heritage",
  highlights: [
    "Money Exchange at Forex Bureau",
    "Group orientation and custom African dress ordering",
    "Fort York/Amsterdam (British 1631, Dutch 1646)",
    "Cape Coast Castle & Door of No Return",
    "Elmina (St. George's) Castle & Slave Dungeons",
    "Kakum National Park Canopy Walk",
    "University of Cape Coast",
    "Boarding High Schools tour",
    "Assin Manso Slavery Memorial & Slave River (Donko Nsuo)",
    "Traditional naming ceremony at river (Reverence to the Ancestors)",
    "Meeting with Mayor of Kumasi",
    "Centre for National Culture and Prempeh II Museum",
    "Naming Ceremony to receive Ashanti Day Names",
    "Manhyia Palace Museum (Ashanti Kings)",
    "Craft Villages: Bonwire (Kente), Ntonsu (Adinkra), Ahwiaa (Wood Carvings)",
    "Kwame Nkrumah University of Science and Technology",
    "Ejisu (hometown of Nana Yaa Asantewaa, Warrior Queen)",
    "Meeting with Mayor of Accra",
    "Kwame Nkrumah Memorial Park (Pan African Movement)",
    "Independence Square & Freedom Arch",
    "W.E.B Dubois Center for Pan Africanism",
    "Arts & Crafts Bazaar Center",
    "Custom African dress tailoring (order Day 1, fitting Day 7)"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "Saturday, July 12th, 2025",
      activities: [
        "Delta flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour guides and board tour bus",
        "Group to do Money Exchange at a Forex Bureau",
        "At 6pm, there will be an orientation for the group in Movenpick Hotel",
        "After, the group will meet Tailors and Seamstresses to take their orders and measurements for Authentic African dresses",
        "Dinner and overnight at Movenpick Hotel"
      ],
      meals: "Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Arrival day with orientation and custom dress ordering"
    },
    {
      day: 2,
      title: "ACCRA TO CAPE COAST/ELMINA",
      date: "Sunday, July 13th, 2025",
      activities: [
        "After breakfast, Depart Accra for Cape Coast and Elmina",
        "Attractions along the way will be Fort York/Amsterdam",
        "  - Built by the British in 1631 and captured by the Dutch in 1646",
        "Afternoon tour of the Cape Coast Slave Dungeon and Slavery Museum",
        "  - Go on an emotional tour of the Slave Dungeons",
        "  - Walk through the 'Door of No Return'",
        "Transfer to your resort for check-in"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Journey to historic slave trade sites"
    },
    {
      day: 3,
      title: "CAPE COAST - KAKUM & ELMINA",
      date: "Monday, July 14th, 2025",
      activities: [
        "After breakfast, depart Resort to visit the Kakum National Park and walk on the canopy walk way",
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
      day: 4,
      title: "CAPE COAST TO KUMASI VIA ASSIN MANSO",
      date: "Tuesday, July 15th, 2025",
      activities: [
        "After breakfast at Beach Resort",
        "Depart on a road trip to Assin Manso in the Central Region",
        "Upon arrival, tour the Slavery Memorial and the Slave River (Donko Nsuo)",
        "  - Take off your shoes and walk to the river",
        "  - Dip your feet/stand in the river as a sign of 'Reverence to the Ancestors'",
        "After completion of this emotional experience, continue the road trip to Cape Coast",
        "Continue on your journey to Kumasi, the Seat of the Ashanti Kingdom and the Capital of the Ashanti Region"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Kumasi City Hotel",
      notes: "Emotional ancestral connection at slave river, then journey to Ashanti capital"
    },
    {
      day: 5,
      title: "KUMASI - NAMING CEREMONY",
      date: "Wednesday, July 16th, 2025",
      activities: [
        "After breakfast",
        "A visit to the Mayor of Kumasi",
        "Visit the Centre for National Culture and Prempeh II Museum, Kumasi",
        "Take part in a Naming Ceremony to receive your Ashanti Day Names",
        "Afternoon tour of Manhyia Palace for Ashanti Kings"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Kumasi City Hotel",
      notes: "Cultural immersion day with mayor meeting and personalized naming ceremony"
    },
    {
      day: 6,
      title: "KUMASI - CRAFT VILLAGES",
      date: "Thursday, July 17th, 2025",
      activities: [
        "After breakfast, depart the Hotel to visit the three (3) Craft Villages of:",
        "  - Bonwire for Kente Cloth",
        "  - Ntonsu for Adinkra Cloth",
        "  - Ahwiaa for Wood Carvings"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Kumasi City Hotel",
      notes: "Full day exploring traditional craft villages"
    },
    {
      day: 7,
      title: "KUMASI TO ACCRA",
      date: "Friday, July 18th, 2025",
      activities: [
        "Depart Lancaster Hotel Kumasi",
        "Drive through Kwame Nkrumah University of Science and Technology",
        "Pass through Ejisu, the hometown of Nana Yaa Asantewaa, the Warrior Queen",
        "Continue to Accra",
        "Afternoon meeting with the Mayor of Accra",
        "Meet Tailors and Seamstresses in the evening for your outfits"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Return to Accra with mayor meeting and custom outfit fittings"
    },
    {
      day: 8,
      title: "ACCRA CITY TOUR",
      date: "Saturday, July 19th, 2025",
      activities: [
        "After breakfast",
        "Tour of Kwame Nkrumah Memorial Park",
        "  - Learn about the role the first president of Ghana played in the struggle for Independence from Britain, the colonial ruler",
        "  - Also learn about his leadership role in the Pan African Movement",
        "Visit Independence Square and Freedom Arch",
        "A visit to W.E.B Dubois Center for Pan Africanism",
        "Shopping at Arts & Crafts Bazaar Center"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Full day exploring Ghana's capital and its historical significance"
    },
    {
      day: 9,
      title: "ACCRA - LEISURE DAY",
      date: "Sunday, July 20th, 2025",
      activities: [
        "After breakfast, day for leisure",
        "Take part in last minute shopping"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Relaxation day with shopping opportunities"
    },
    {
      day: 10,
      title: "DEPARTURE DAY - ACCRA",
      date: "Monday, July 21st, 2025",
      activities: [
        "Packed breakfast at 4:30am",
        "Departure to the Airport for Group on Delta Airlines @ 5:00am"
      ],
      meals: "Breakfast",
      accommodation: "None",
      notes: "Early morning departure with packed breakfast"
    }
  ],
  inclusions: [
    "9 nights accommodation at quality hotels (Movenpick Ambassador Hotel, Coconut Grove Beach Resort, Lancaster Kumasi City Hotel)",
    "Daily breakfast",
    "Dinners included as indicated in itinerary",
    "Packed breakfast for early departure (Day 10)",
    "All ground transportation in air-conditioned tour bus",
    "Professional tour guide",
    "Entrance fees to all sites and attractions",
    "Kakum National Park Canopy Walk experience",
    "Traditional Naming Ceremony with Ashanti Day Names",
    "Custom African dress tailoring (order Day 1, fitting Day 7)",
    "Meetings with Mayors of Kumasi and Accra",
    "Bottled water during tours",
    "Group orientation"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches (all lunches on own account throughout tour)",
    "Personal expenses",
    "Tips for guides and drivers",
    "Custom outfit fabric and tailoring costs",
    "Shopping expenses",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "Movenpick Ambassador Hotel", location: "Accra", nights: 5, checkIn: "Day 1", checkOut: "Day 2, then Day 7", notes: "Days 1, 7-9" },
    { name: "Coconut Grove Beach Resort", location: "Cape Coast/Elmina", nights: 2, checkIn: "Day 2", checkOut: "Day 4", notes: "Days 2-3" },
    { name: "Lancaster Kumasi City Hotel", location: "Kumasi", nights: 3, checkIn: "Day 4", checkOut: "Day 7", notes: "Days 4-6" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/july-2025-tour.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-07-12"],
  notes: "Tour dates: July 12-21, 2025. Delta Airlines flight. This comprehensive tour combines culture, heritage, and eco-tourism. Features visits to historic slave castles, Kakum National Park, Assin Manso slave memorial with river ceremony, Ashanti cultural sites with naming ceremony, craft villages, and meetings with mayors. Includes custom African dress tailoring and early morning departure on Day 10.",
  pricePerPerson: 0,
  singleSupplement: null
}

async function addJulyTour() {
  try {
    console.log('🔄 Adding July 2025 Ghana Culture, Heritage & Eco-Tourism Tour...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "July 2025"
        }
      }
    })
    
    const slug = createSlug(julyTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...julyTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...julyTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ July 2025 Tour added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addJulyTour()

