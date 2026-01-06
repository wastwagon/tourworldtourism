// Add May 2025 Ghana Culture, Heritage & Eco-Tourism Tour
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

const mayTour = {
  title: "9-Day Ghana Culture, Heritage & Eco-Tourism Tour - May 2025",
  description: "A comprehensive 9-day journey through Ghana's rich culture, heritage, and eco-tourism sites. Visit Accra, Kumasi, Cape Coast, and Elmina. Experience historic slave castles, Kakum National Park canopy walk, Assin Manso slave memorial, Ashanti cultural sites with naming ceremony, craft villages, and T.K Beads Factory. Includes custom African dress tailoring with flexible departure options.",
  durationDays: 9,
  durationNights: 8,
  regions: ["Greater Accra", "Ashanti", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "T.K Beads Factory and Boutique",
    "Money Exchange",
    "Group orientation and custom African dress ordering",
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park (Pan African Movement leader)",
    "W.E.B Dubois Center for Pan Africanism",
    "Arts & Crafts Center shopping",
    "Ejisu Besease Shrine (hometown of Nana Yaa Asantewaa, Warrior Queen)",
    "Kwame Nkrumah University of Science and Technology",
    "Manhyia Palace Museum",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Naming Ceremony to receive Ashanti Day Names",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Assin Manso Slavery Memorial & Slave River (Donko Nsuo)",
    "Traditional naming ceremony at river (Reverence to the Ancestors)",
    "Cape Coast Castle & Door of No Return",
    "Fishing village outside castle walls",
    "Elmina (St. George's) Castle & Slave Dungeons",
    "Kakum National Park Canopy Walk",
    "University of Cape Coast",
    "Boarding High Schools tour",
    "Custom African dress tailoring (order Day 1, fitting Day 7)",
    "Center for Arts and Crafts Bazaar shopping"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "Thursday, May 8th, 2025",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour guide and board tour bus",
        "Group to do money exchange and visit T.K Beads",
        "At 6pm, there will be an orientation for the group in Movenpick Hotel",
        "After, the group will meet Tailors and Seamstresses to take their orders and measurements for Authentic African dresses"
      ],
      meals: "Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Arrival day with T.K Beads visit, orientation and custom dress ordering"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Friday, May 9th, 2025",
      activities: [
        "Early breakfast",
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park",
        "  - Learn about the role the first president of Ghana played in the struggle for Independence from Britain, the colonial ruler",
        "  - Also learn about his leadership role in the Pan African Movement",
        "A visit to W.E.B Dubois Center for Pan Africanism",
        "Shopping at Arts & Crafts center",
        "Return to your hotel in the mid-afternoon",
        "Dinner at the hotel restaurant included"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Full day exploring Ghana's capital and its historical significance"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI",
      date: "Saturday, May 10th, 2025",
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
      title: "KUMASI - NAMING CEREMONY",
      date: "Sunday, May 11th, 2025",
      activities: [
        "After breakfast, continuation of the Kumasi City Tour",
        "Tour of Kumasi Cultural Center (Prempeh II Museum)",
        "Take part in a Naming Ceremony to receive your Ashanti Day Names",
        "Afternoon tour and shopping at the 3 Craft Villages (Kente, Adinkra and Wood Carving):",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Hotel",
      notes: "Cultural immersion day with personalized naming ceremony and craft villages"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST VIA ASSIN MANSO",
      date: "Monday, May 12th, 2025",
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
      title: "CAPE COAST - KAKUM & ELMINA",
      date: "Tuesday, May 13th, 2025",
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
      day: 7,
      title: "CAPE COAST TO ACCRA",
      date: "Wednesday, May 14th, 2025",
      activities: [
        "After breakfast, Depart Cape Coast to Accra",
        "Meet Tailors and Seamstresses in the evening for your outfits"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "Return to Accra with custom outfit fittings"
    },
    {
      day: 8,
      title: "DEPARTURE DAY - ACCRA (United Airlines)",
      date: "Thursday, May 15th, 2025",
      activities: [
        "After breakfast",
        "Take part in last minute shopping at the Center for Arts and Crafts Bazaar",
        "Departure to the Airport for Group on United Airlines @ 5:30pm"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Movenpick Ambassador Hotel",
      notes: "United Airlines departure in the evening"
    },
    {
      day: 9,
      title: "DEPARTURE DAY - ACCRA (Delta Airlines)",
      date: "Friday, May 16th, 2025",
      activities: [
        "Packed breakfast at 5:00am",
        "Departure to the Airport for group on Delta Airlines"
      ],
      meals: "Breakfast",
      accommodation: "None",
      notes: "Delta Airlines early morning departure with packed breakfast"
    }
  ],
  inclusions: [
    "8 nights accommodation at quality hotels (Movenpick Ambassador Hotel, Lancaster Hotel, Coconut Grove Beach Resort)",
    "Daily breakfast",
    "Dinner on Day 1",
    "Dinners included as indicated in itinerary",
    "Packed breakfast for early departure (Day 9 - Delta Airlines)",
    "All ground transportation in air-conditioned tour bus",
    "Professional tour guide",
    "Entrance fees to all sites and attractions",
    "Kakum National Park Canopy Walk experience",
    "Traditional Naming Ceremony with Ashanti Day Names",
    "Custom African dress tailoring (order Day 1, fitting Day 7)",
    "T.K Beads Factory visit",
    "Bottled water during tours",
    "Group orientation"
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
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "Movenpick Ambassador Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 3, then Day 7", notes: "Days 1-2 and 7-8" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5", notes: "Days 3-4" },
    { name: "Coconut Grove Beach Resort", location: "Cape Coast/Elmina", nights: 2, checkIn: "Day 5", checkOut: "Day 7", notes: "Days 5-6" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/may-2025-tour.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-05-08"],
  notes: "Tour dates: May 8-16, 2025. This comprehensive tour combines culture, heritage, and eco-tourism. Features visits to T.K Beads Factory, historic slave castles, Kakum National Park, Assin Manso slave memorial with river ceremony, Ashanti cultural sites with naming ceremony, craft villages, and custom African dress tailoring. Flexible departure options: United Airlines (Day 8, 5:30pm) or Delta Airlines (Day 9, 5:00am with packed breakfast).",
  pricePerPerson: 0,
  singleSupplement: null
}

async function addMayTour() {
  try {
    console.log('🔄 Adding May 2025 Ghana Culture, Heritage & Eco-Tourism Tour...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "May 2025"
        }
      }
    })
    
    const slug = createSlug(mayTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...mayTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...mayTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ May 2025 Tour added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addMayTour()

