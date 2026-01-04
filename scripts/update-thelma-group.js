// Update Thelma's Group tour with enhanced itinerary
require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const thelmaTour = {
  title: "9-Day Ghana Heritage & Culture Experience - Thelma's Group",
  description: "A comprehensive 9-day journey through Ghana's rich cultural heritage, visiting Accra, Kumasi, Cape Coast, and Elmina. Experience traditional Asante naming ceremonies, explore historic slave castles, walk through Kakum National Park's canopy walkway, and cruise on Volta Lake. Includes custom African outfit tailoring. This tour includes profound emotional experiences connecting with ancestral history.",
  durationDays: 9,
  durationNights: 8,
  regions: ["Greater Accra", "Ashanti", "Eastern", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park (Pan African Movement leader)",
    "W.E.B Dubois Center",
    "Manhyia Palace Museum (Ashanti history and culture)",
    "Traditional Asante Naming Ceremony at Palace of Nana Kofi Nti II",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Ejisu Besease Shrine (hometown of Nana Yaa Asantewaa, the Warrior Queen)",
    "Assin Manso Slavery Memorial & Slave River (Donko Nsuo)",
    "Elmina (St. George's) Castle & Slave Dungeons",
    "Cape Coast Castle & Door of No Return",
    "Kakum National Park Canopy Walk (100 feet above rainforest)",
    "Fort Amsterdam at Abandze",
    "Shai Hills Resource Reserve (Wildlife: Baboons, Zebras, Ostriches, Antelopes)",
    "Akosombo Dam & Adomi Bridge",
    "Volta Lake Boat Cruise",
    "Custom African outfit tailoring (measurements Day 1, final fitting Day 7)"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA, GHANA",
      date: "Saturday, November 8th, 2025",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour coordinator and board tour bus (used for transfers)",
        "Money Exchange",
        "Transfer to Hotel and Check-in",
        "Group Orientation and welcome dinner at the hotel",
        "Have your measurements taken by seamstresses and tailors for sewing of custom African outfits"
      ],
      meals: "Dinner",
      accommodation: "Movenpick Hotel",
      notes: "Arrival day - settle in and prepare for the adventure ahead"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Sunday, November 9th, 2025",
      activities: [
        "After breakfast",
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park",
        "  - Learn about the role the first president of Ghana played in the struggle for Independence from Britain, the colonial ruler",
        "  - Learn about his leadership role in the Pan African Movement",
        "Shopping at Arts & Crafts center",
        "Visit to W.E.B Dubois Center"
      ],
      meals: "B",
      accommodation: "Movenpick Hotel",
      notes: "Full day exploring Ghana's capital and its historical significance"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI",
      date: "Monday, November 10th, 2025",
      activities: [
        "Early breakfast",
        "Check out of the hotel",
        "Depart hotel at 7:30am for Kumasi, the Capital City of the Ashanti Region",
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
      accommodation: "Lancaster Hotel",
      notes: "Travel day with cultural immersion in Ashanti heritage"
    },
    {
      day: 4,
      title: "KUMASI",
      date: "Tuesday, November 11th, 2025",
      activities: [
        "After breakfast",
        "Depart hotel at 8:30am for a Traditional Asante Naming Ceremony",
        "  - At the Palace of Nana Kofi Nti II, Chief linguist of Asantehene",
        "Tour of Kumasi Cultural Center (Prempeh II Museum)",
        "Shopping at the Gift shops",
        "Afternoon tour and shopping at the 3 Craft Villages (Kente, Adinkra and Wood Carving):",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth",
        "Late afternoon transfer to your hotel"
      ],
      meals: "B",
      accommodation: "Lancaster Hotel",
      notes: "Deep dive into Ashanti culture, crafts, and traditions"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST",
      date: "Wednesday, November 12th, 2025",
      activities: [
        "Breakfast at hotel",
        "Depart at 7:30am on a road trip to the Central Region to Assin Manso",
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
      notes: "Emotional and reflective day connecting with ancestral history"
    },
    {
      day: 6,
      title: "CAPE COAST",
      date: "Thursday, November 13th, 2025",
      activities: [
        "After breakfast",
        "Depart at 8:30am to Kakum National Park to experience the Canopy Walk",
        "  - Enjoy the exhilarating views from a 50-meter-long rope and wooden walkway suspended 100 feet above the ground of a tropical rainforest",
        "In the afternoon, go on a City Tour of Cape Coast",
        "  - Venues of interest include the University of Cape Coast",
        "Tour the Cape Coast Castle and Slavery Museum",
        "  - Go on an emotional tour of the Slave Dungeons",
        "  - Walk through the 'Door of No Return'",
        "Return to the resort in the mid-afternoon",
        "Spend some time relaxing on the beach – under the coconut trees"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Balance of adventure (canopy walk) and historical reflection, ending with beach relaxation"
    },
    {
      day: 7,
      title: "CAPE COAST TO ACCRA",
      date: "Friday, November 14th, 2025",
      activities: [
        "After breakfast, morning check-out of the resort",
        "Depart Cape Coast to Accra at 8:00am",
        "Drive by Fort Amsterdam at Abandze",
        "  - Built by The British in 1634, seized by the Dutch in 1646",
        "Meet with seamstresses and tailors for final fitting of custom outfits ordered at the beginning of the tour",
        "Spend the evening recuperating from your travels around the country"
      ],
      meals: "B",
      accommodation: "Movenpick Hotel",
      notes: "Return to Accra with custom outfit fittings and rest"
    },
    {
      day: 8,
      title: "ACCRA – AKOSOMBO – ACCRA",
      date: "Saturday, November 15th, 2025",
      activities: [
        "After breakfast",
        "Depart hotel at 8:00am on a road trip to the Eastern Region of Ghana",
        "Your drive goes through Tema Motorway",
        "  - The first of its kind in the country built by the country's first president, Kwame Nkrumah",
        "Visit Shai Hills Resource Reserve",
        "  - Interact with the Baboons that eagerly receive bananas given to them",
        "  - See a variety of animals including Zebras and Ostriches",
        "  - See different species of antelopes such as KOB, BUSHBUCK and DUIKER",
        "Continue on to Akosombo in the Eastern region",
        "  - Location of the Volta Lake, one of the largest man-made lakes in the world",
        "Visit the Akosombo Dam and Adomi Bridge",
        "Go on a Boat Cruise on the Volta Lake"
      ],
      meals: "B/D",
      accommodation: "Movenpick Hotel",
      notes: "Full day excursion to Eastern Region with wildlife and water activities"
    },
    {
      day: 9,
      title: "DEPARTURE DAY – ACCRA",
      date: "Sunday, November 16th, 2025",
      activities: [
        "Early morning departure at 4:30am on Delta Airlines (with packed breakfast)",
        "After breakfast, depart hotel for last minute shopping",
        "Return to the hotel at mid-day for check out",
        "Departure in the evening at 6:00pm from Hotel to the Airport for check in at United Airlines"
      ],
      meals: "B",
      accommodation: "None",
      notes: "Final shopping and departure - two flight options available"
    }
  ],
  inclusions: [
    "Accommodation in 4-star hotels (Movenpick Hotel, Lancaster Hotel, Coconut Grove Beach Resort)",
    "Daily breakfast",
    "Welcome dinner (Day 1)",
    "Dinner on Day 8",
    "All ground transportation in air-conditioned tour bus",
    "Professional tour guide",
    "Entrance fees to all sites and attractions",
    "Traditional Asante Naming Ceremony",
    "Custom African outfit tailoring (measurements Day 1, final fitting Day 7)",
    "Boat cruise on Volta Lake",
    "Kakum National Park Canopy Walk experience",
    "Bottled water during tours",
    "Packed breakfast for early departure (Day 9)"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches (all lunches on own account throughout tour)",
    "Dinners (except Day 1 welcome dinner and Day 8 dinner)",
    "Personal expenses",
    "Tips for guides and drivers",
    "Custom outfit fabric and tailoring costs",
    "Shopping expenses",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "Movenpick Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 3, then Day 7", notes: "Days 1-2 and 7-8" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5", notes: "Days 3-4" },
    { name: "Coconut Grove Beach Resort", location: "Cape Coast/Elmina", nights: 2, checkIn: "Day 5", checkOut: "Day 7", notes: "Days 5-6" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/thelma-group.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-11-08"],
  notes: "Tour dates: November 8-16, 2025. This tour includes profound emotional experiences connecting with ancestral history, particularly on Days 5-6 at slavery memorial sites. Participants should be prepared for emotionally impactful experiences. Two departure flight options available on Day 9: 4:30am Delta Airlines or 6:00pm United Airlines check-in.",
  pricePerPerson: 0,
  singleSupplement: null
}

function createSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function updateThelmaTour() {
  try {
    console.log('🔄 Updating Thelma\'s Group tour...\n')
    
    // Find the tour
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "Thelma"
        }
      }
    })
    
    const slug = createSlug(thelmaTour.title)
    
    if (!existingTour) {
      console.log('❌ Tour not found. Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...thelmaTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour')
    } else {
      console.log(`✅ Found tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...thelmaTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    }
    
    console.log('✅ Thelma\'s Group tour updated successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

updateThelmaTour()

