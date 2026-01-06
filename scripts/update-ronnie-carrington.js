// Update Ronnie Carrington & Friends tour with enhanced itinerary
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

const ronnieTour = {
  title: "10-Day Ghana Heritage & Culture Experience - Ronnie Carrington & Friends",
  description: "An immersive 10-day journey through Ghana's rich cultural heritage, visiting Accra, Kumasi, Cape Coast, Elmina, and Takoradi. Experience traditional Asante culture, explore historic slave castles, walk through Kakum National Park's canopy walkway, visit Bisa Abrewa Museum, and cruise on Volta Lake. Includes custom African outfit tailoring. This tour includes profound emotional experiences connecting with ancestral history.",
  durationDays: 10,
  durationNights: 9,
  regions: ["Greater Accra", "Ashanti", "Eastern", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park (Pan African Movement leader)",
    "W.E.B Dubois Center",
    "Manhyia Palace Museum (Ashanti history and culture)",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Ejisu Besease Shrine (hometown of Nana Yaa Asantewaa, the Warrior Queen)",
    "Assin Manso Slavery Memorial & Slave River (Donko Nsuo)",
    "Elmina (St. George's) Castle & Slave Dungeons",
    "Cape Coast Castle & Door of No Return",
    "Kakum National Park Canopy Walk (100 feet above rainforest)",
    "Bisa Abrewa Museum, Takoradi",
    "Fort Amsterdam at Abandze",
    "Shai Hills Resource Reserve (Wildlife: Baboons, Zebras, Ostriches, Antelopes)",
    "Akosombo Dam & Adomi Bridge",
    "Volta Lake Boat Cruise",
    "Custom African outfit tailoring (fabric shopping, measurements Day 2, final fitting Day 8)"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA, GHANA",
      date: "Saturday, August 15th, 2026",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour coordinator and board tour bus (used for transfers)"
      ],
      meals: "Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Arrival day - settle in and rest after your journey"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Sunday, August 16th, 2026",
      activities: [
        "After breakfast, Money Exchange",
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park",
        "  - Learn about the role the first president of Ghana played in the struggle for Independence from Britain, the colonial ruler",
        "  - Learn about his leadership role in the Pan African Movement",
        "Shopping at Arts & Crafts center",
        "Visit to W.E.B Dubois Center",
        "Group Orientation at the hotel",
        "Shop for fabric from vendors assembled for you at the hotel",
        "Have your measurements taken by seamstresses and tailors for sewing of custom African outfits"
      ],
      meals: "B",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Full day of historical sites, shopping, and custom outfit preparations"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI",
      date: "Monday, August 17th, 2026",
      activities: [
        "Early breakfast",
        "Check out of the hotel",
        "Depart for Kumasi, the Capital City of the Ashanti Region",
        "Early afternoon arrival in Ejisu",
        "  - Hometown of Nana Yaa Asantewaa, the Warrior Queen",
        "  - Site of the Ejisu Besease Shrine, a traditional Asante Shrine",
        "Continue the road trip to Kumasi",
        "Start the City Tour by driving through Kwame Nkrumah University of Science and Technology",
        "Tour of Manhyiaa Palace Museum",
        "  - Learn about Ashanti (Asante) history and culture",
        "Transfer to the hotel for check in"
      ],
      meals: "B",
      accommodation: "Lancaster City Hotel",
      notes: "Journey to the heart of Ashanti culture"
    },
    {
      day: 4,
      title: "KUMASI",
      date: "Tuesday, August 18th, 2026",
      activities: [
        "After breakfast, continuation of the Kumasi City Tour",
        "Tour of Kumasi Cultural Center (Prempeh II Museum)",
        "Shopping at the Gift shops",
        "Afternoon tour and shopping at the 3 Craft Villages (Kente, Adinkra and Wood Carving):",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth",
        "Late afternoon transfer to your hotel"
      ],
      meals: "B",
      accommodation: "Lancaster City Hotel",
      notes: "Full day exploring Kumasi's cultural centers and traditional crafts"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST",
      date: "Wednesday, August 19th, 2026",
      activities: [
        "Breakfast at hotel",
        "Check out of the hotel",
        "Depart on a road trip to the Central Region to Assin Manso",
        "Upon arrival, tour the Slavery Memorial and the Slave River (Donko Nsuo)",
        "  - Take off your shoes and walk to the river",
        "  - Dip your feet/stand in the river as a sign of 'Reverence to the Ancestors'",
        "After completion of this emotional experience, continue the road trip to Cape Coast",
        "Afternoon arrival in Elmina",
        "Transfer to Elmina (St. George's) Castle for another emotional tour of its Slave Dungeons",
        "Transfer to your resort for check-in"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Deeply emotional day connecting with ancestral history"
    },
    {
      day: 6,
      title: "CAPE COAST",
      date: "Thursday, August 20th, 2026",
      activities: [
        "After breakfast, take a short road trip to Kakum National Park to experience the Canopy Walk",
        "  - Enjoy the exhilarating views from a 50-meter-long rope and wooden walkway suspended 100 feet above the ground of a tropical rainforest",
        "In the afternoon, go on a City Tour of Cape Coast",
        "  - Venues of interest include boarding High Schools and the University of Cape Coast",
        "Also tour the Cape Coast Castle and Slavery Museum",
        "  - Go on an emotional tour of the Slave Dungeons",
        "  - Walk through the 'Door of No Return'",
        "Return to the resort in the mid-afternoon",
        "Spend some time relaxing on the beach – under the coconut trees"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Adventure and history combined with beach relaxation"
    },
    {
      day: 7,
      title: "CAPE COAST TO TAKORADI",
      date: "Friday, August 21st, 2026",
      activities: [
        "After breakfast",
        "Depart Elmina to Takoradi to visit the famous Bisa Abrewa Museum",
        "Return to Elmina",
        "Spend the rest of the day for leisure"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Excursion to unique museum with leisure time in the afternoon"
    },
    {
      day: 8,
      title: "CAPE COAST TO ACCRA",
      date: "Saturday, August 22nd, 2026",
      activities: [
        "After breakfast, mid-morning check-out of the resort",
        "Depart Cape Coast to Accra",
        "Visit Fort Amsterdam at Abandze",
        "  - Built by The British in 1634, seized by the Dutch in 1646",
        "Meet with seamstresses and tailors for final fitting of custom outfits ordered at the beginning of the tour",
        "Spend the evening recuperating from your travels around the country"
      ],
      meals: "B",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Return to Accra with custom outfit fittings"
    },
    {
      day: 9,
      title: "ACCRA – AKOSOMBO – ACCRA",
      date: "Sunday, August 23rd, 2026",
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
        "  - Location of the Volta Lake, one of the largest man-made lakes in the world",
        "Go on a city tour including a tour of the Akosombo Dam and Adomi Bridge",
        "Go on a Boat Cruise on the Volta Lake"
      ],
      meals: "Breakfast and Lunch/Dinner",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Full day Eastern Region excursion with wildlife and water activities"
    },
    {
      day: 10,
      title: "DEPARTURE DAY – ACCRA",
      date: "Monday, August 24th, 2026",
      activities: [
        "Morning breakfast",
        "Depart hotel for last minute shopping",
        "Return to the hotel at mid-day for check out",
        "Departure in the evening from Hotel to the Airport for check in"
      ],
      meals: "B",
      accommodation: "None",
      notes: "Final shopping and departure"
    }
  ],
  inclusions: [
    "Accommodation in 4-star hotels (La-Palm Royal Beach Hotel, Lancaster City Hotel, Coconut Grove Beach Resort)",
    "Daily breakfast",
    "Dinner on Day 1",
    "Breakfast and Lunch/Dinner on Day 9",
    "All ground transportation in air-conditioned tour bus",
    "Professional tour guide",
    "Entrance fees to all sites and attractions",
    "Custom African outfit tailoring (fabric shopping Day 2, measurements Day 2, final fitting Day 8)",
    "Boat cruise on Volta Lake",
    "Kakum National Park Canopy Walk experience",
    "Bisa Abrewa Museum visit",
    "Bottled water during tours",
    "Group orientation"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches (most lunches on own account throughout tour, except Day 9)",
    "Dinners (except Day 1 and Day 9)",
    "Personal expenses",
    "Tips for guides and drivers",
    "Custom outfit fabric and tailoring costs",
    "Shopping expenses",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "La-Palm Royal Beach Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 3, then Day 8", notes: "Days 1-2 and 8-9" },
    { name: "Lancaster City Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5", notes: "Days 3-4" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 3, checkIn: "Day 5", checkOut: "Day 8", notes: "Days 5-7 (longest stay - 3 nights)" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/ronnie-carrington-group.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2026-08-15"],
  notes: "Tour dates: August 15-24, 2026. Price: $2,680.00 per person (double/twin occupancy); Single supplement: $900.00. This tour includes profound emotional experiences connecting with ancestral history, particularly on Days 5-6 at slavery memorial sites. Participants should be prepared for emotionally impactful experiences. Features longest stay at beach resort (3 nights) and includes unique Bisa Abrewa Museum visit.",
  pricePerPerson: 0,
  singleSupplement: null
}

async function updateRonnieTour() {
  try {
    console.log('🔄 Updating Ronnie Carrington & Friends tour...\n')
    
    // Find the tour
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "Ronnie"
        }
      }
    })
    
    const slug = createSlug(ronnieTour.title)
    
    if (!existingTour) {
      console.log('❌ Tour not found. Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...ronnieTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour')
    } else {
      console.log(`✅ Found tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...ronnieTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    }
    
    console.log('✅ Ronnie Carrington & Friends tour updated successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

updateRonnieTour()

