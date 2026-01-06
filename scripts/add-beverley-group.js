// Add Beverley's Group - January 2025 Tour
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

const beverleyTour = {
  title: "10-Day Ghana Heritage & Culture Experience - Beverley's Group",
  description: "An immersive 10-day journey through Ghana's rich cultural heritage, visiting Accra, Kumasi, Cape Coast, Elmina, and Takoradi. Experience traditional Ashanti culture, explore historic slave castles, walk through Kakum National Park's canopy walkway, visit Bisa Abrewa Museum, and cruise on Volta Lake. Includes custom African outfit tailoring and lunch at Royal Senchi Resort.",
  durationDays: 10,
  durationNights: 9,
  regions: ["Greater Accra", "Ashanti", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park (Pan African Movement leader)",
    "W.E.B Dubois Center",
    "Arts & Crafts Center shopping",
    "Custom African outfit tailoring (fabric shopping, measurements Day 2, final fitting Day 8)",
    "Ejisu Besease Shrine (hometown of Nana Yaa Asantewaa, Warrior Queen)",
    "Kwame Nkrumah University of Science and Technology",
    "Manhyia Palace Museum",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Assin Manso Slavery Memorial & Slave River (Donko Nsuo)",
    "Traditional naming ceremony at river (Reverence to the Ancestors)",
    "Elmina (St. George's) Castle & Slave Dungeons",
    "Fishing village outside castle walls",
    "Cape Coast Castle & Door of No Return",
    "Kakum National Park Canopy Walk (100 feet above rainforest)",
    "University of Cape Coast",
    "Boarding High Schools tour",
    "Bisa Abrewa Museum (Colonial to Independence History)",
    "T.K Beads factory (traditional jewelry beads)",
    "Shai Hills Resource Reserve (Wildlife: Baboons, Zebras, Ostriches, Antelopes)",
    "Tema Motorway (first of its kind)",
    "Akosombo Dam & Adomi Bridge",
    "Royal Senchi Resort lunch (on banks of Volta Lake)",
    "Volta Lake Boat Cruise (passes under Adomi Bridge)"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA, GHANA",
      date: "Monday, January 20th, 2025",
      activities: [
        "British Airways flight arrives at Kotoka International Airport 19:55 GMT",
        "Complete Customs and Immigration formalities",
        "Meet tour coordinator and board tour bus (Toyota Coaster bus used for transfers)",
        "Check-in at La-Palm Hotel",
        "Dinner on own account"
      ],
      meals: "None",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Arrival day - settle in after evening flight arrival"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Tuesday, January 21st, 2025",
      activities: [
        "After breakfast, Money Exchange",
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park",
        "  - Learn about the role the first president of Ghana played in the struggle for Independence from Britain, the colonial ruler",
        "  - Also learn about his leadership role in the Pan African Movement",
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
      date: "Wednesday, January 22nd, 2025",
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
      meals: "B",
      accommodation: "Lancaster Hotel",
      notes: "Journey to the heart of Ashanti culture"
    },
    {
      day: 4,
      title: "KUMASI",
      date: "Thursday, January 23rd, 2025",
      activities: [
        "After breakfast, continuation of the Kumasi City Tour",
        "Tour of Kumasi Cultural Center (Prempeh II Museum) and shopping at the Gift shops",
        "Afternoon tour and shopping at the 3 Craft Villages (Kente, Adinkra and Wood Carving):",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth",
        "Late afternoon transfer to your hotel"
      ],
      meals: "B",
      accommodation: "Lancaster Hotel",
      notes: "Full day exploring Kumasi's cultural centers and traditional crafts"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST VIA ASSIN MANSO",
      date: "Friday, January 24th, 2025",
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
        "Tour the fishing village outside the castle walls",
        "Transfer to your resort for check-in"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Emotional ancestral connection at slave river, then historic castle tour"
    },
    {
      day: 6,
      title: "CAPE COAST",
      date: "Saturday, January 25th, 2025",
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
      date: "Sunday, January 26th, 2025",
      activities: [
        "After breakfast, depart Elmina to Takoradi to visit the famous Bisa Abrewa Museum",
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
      date: "Monday, January 27th, 2025",
      activities: [
        "After breakfast, mid-morning check-out of the resort",
        "Depart Cape Coast to Accra",
        "Upon arrival in Accra, visit T.K Beads factory to shop for traditional jewelry beads",
        "Meet with seamstresses and tailors for final fitting of custom outfits ordered at the beginning of the tour",
        "Spend the evening recuperating from your travels around the country"
      ],
      meals: "B",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Return to Accra with T.K Beads shopping and custom outfit fittings"
    },
    {
      day: 9,
      title: "ACCRA – AKOSOMBO – ACCRA",
      date: "Tuesday, January 28th, 2025",
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
        "Go on a city tour including a tour of the Akosombo Dam and Adomi Bridge",
        "Transfer to the Royal Senchi Resort located on the banks of the Volta Lake for lunch",
        "After lunch, go on a Boat Cruise on the Volta Lake that passes under the Adomi Bridge"
      ],
      meals: "B/L",
      accommodation: "La-Palm Royal Beach Hotel",
      notes: "Full day Eastern Region excursion with wildlife, engineering marvels, and luxury resort lunch"
    },
    {
      day: 10,
      title: "DEPARTURE DAY – ACCRA",
      date: "Wednesday, January 29th, 2025",
      activities: [
        "Morning breakfast",
        "Depart hotel for last minute shopping",
        "Return to the hotel at mid-day for check out",
        "Departure in the evening from Hotel to the Airport for check in at British Airways Counter"
      ],
      meals: "B",
      accommodation: "None",
      notes: "Final shopping and departure"
    }
  ],
  inclusions: [
    "9 nights accommodation at quality hotels (La-Palm Royal Beach Hotel, Lancaster Hotel, Coconut Grove Beach Resort)",
    "Daily breakfast",
    "Lunch at Royal Senchi Resort (Day 9)",
    "All ground transportation in Toyota Coaster bus",
    "Professional tour coordinator/guide",
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
    "Lunches and dinners (most meals on own account, except lunch Day 9)",
    "Personal expenses",
    "Tips for guides and drivers",
    "Custom outfit fabric and tailoring costs",
    "Shopping expenses",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "La-Palm Royal Beach Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 3, then Day 8", notes: "Days 1-2 and 8-9" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5", notes: "Days 3-4" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 3, checkIn: "Day 5", checkOut: "Day 8", notes: "Days 5-7" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/beverley-group.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-01-20"],
  notes: "Tour dates: January 20-29, 2025. British Airways flight arrives 19:55 GMT. This comprehensive tour combines culture, heritage, and eco-tourism. Features visits to historic slave castles, Kakum National Park, Assin Manso slave memorial with river ceremony, Ashanti cultural sites, craft villages, Bisa Abrewa Museum, T.K Beads factory, Shai Hills wildlife, and luxury lunch at Royal Senchi Resort with Volta Lake boat cruise. Includes custom African outfit tailoring. Most meals on own account except breakfast daily and lunch Day 9.",
  pricePerPerson: 0,
  singleSupplement: null
}

async function addBeverleyTour() {
  try {
    console.log('🔄 Adding Beverley\'s Group - January 2025 Tour...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "Beverley"
        }
      }
    })
    
    const slug = createSlug(beverleyTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...beverleyTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...beverleyTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ Beverley\'s Group tour added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addBeverleyTour()

