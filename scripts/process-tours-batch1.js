// Process the first batch of 3 tours
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

async function findMatchingTour(title) {
  const slug = createSlug(title)
  let tour = await prisma.tour.findUnique({ where: { slug } })
  if (tour) return tour
  
  const allTours = await prisma.tour.findMany({ select: { id: true, title: true, slug: true } })
  const titleLower = title.toLowerCase()
  for (const t of allTours) {
    const tTitleLower = t.title.toLowerCase()
    const titleWords = titleLower.split(/\s+/).filter(w => w.length > 3)
    const matchCount = titleWords.filter(w => tTitleLower.includes(w)).length
    if (matchCount >= 2) return t
  }
  return null
}

// Tour 1: JEANETTE'S GROUP
const tour1 = {
  title: "8-Day Ghana Heritage & Culture Experience - Jeanette's Group",
  description: "An immersive 8-day journey through Ghana's rich cultural heritage, visiting Accra, Kumasi, Cape Coast, and Elmina. Experience traditional Asante naming ceremonies, explore historic slave castles, walk through Kakum National Park's canopy walkway, and cruise on Volta Lake. Includes custom African outfit tailoring.",
  durationDays: 8,
  durationNights: 7,
  regions: ["Greater Accra", "Ashanti", "Eastern", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park",
    "W.E.B Dubois Center",
    "TK Beads Factory and Jewelry Company",
    "Manhyia Palace Museum",
    "Traditional Asante Naming Ceremony",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Ejisu Besease Shrine",
    "Assin Manso Slavery Memorial & Slave River",
    "Cape Coast Castle & Door of No Return",
    "Elmina (St. George's) Castle",
    "Kakum National Park Canopy Walk",
    "Akosombo Dam & Volta Lake Cruise",
    "Shai Hills Resource Reserve",
    "Custom African outfit tailoring"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "Saturday, November 8th, 2025",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour coordinator and board tour bus",
        "Money Exchange",
        "Group visits TK Beads Factory and Jewelry Company",
        "Transfer to Hotel and Check-in",
        "Group Orientation and welcome dinner at the hotel with Thelma's Group",
        "Measurements taken by seamstresses and tailors for custom African outfits"
      ],
      meals: "Dinner",
      accommodation: "Movenpick Hotel"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Sunday, November 9th, 2025",
      activities: [
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park (first president of Ghana, Pan African Movement leader)",
        "Shopping at Arts & Crafts center",
        "Visit to W.E.B Dubois Center"
      ],
      meals: "B",
      accommodation: "Movenpick Hotel"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI",
      date: "Monday, November 10th, 2025",
      activities: [
        "Early breakfast; Check out at 7:30am",
        "Depart for Kumasi (Capital City of Ashanti Region)",
        "Early afternoon arrival in Ejisu (hometown of Nana Yaa Asantewaa, the Warrior Queen)",
        "Visit Ejisu Besease Shrine (traditional Asante Shrine)",
        "Continue to Kumasi with city tour through Kwame Nkrumah University of Science and Technology",
        "Tour of Manhyiaa Palace Museum (Ashanti history and culture)",
        "Transfer to hotel for check in"
      ],
      meals: "B",
      accommodation: "Lancaster Hotel"
    },
    {
      day: 4,
      title: "KUMASI",
      date: "Tuesday, November 11th, 2025",
      activities: [
        "Depart hotel at 8:30am",
        "Traditional Asante Naming Ceremony at Palace of Nana Kofi Nti II, Chief linguist of Asantehene",
        "Tour of Kumasi Cultural Center (Prempeh II Museum) and shopping at Gift shops",
        "Afternoon tour and shopping at 3 Craft Villages:",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth",
        "Late afternoon transfer to hotel"
      ],
      meals: "B",
      accommodation: "Lancaster Hotel"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST",
      date: "Wednesday, November 12th, 2025",
      activities: [
        "Depart at 7:30am for Central Region",
        "Tour Assin Manso: Slavery Memorial and Slave River (Donko Nsuo)",
        "Remove shoes and walk to river, dip feet/stand in river as 'Reverence to the Ancestors'",
        "Continue to Cape Coast",
        "Afternoon arrival and transfer to Cape Coast Slave Dungeon",
        "Emotional tour of Slave Dungeons and 'The Door of No Return'",
        "Transfer to resort for check-in"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort"
    },
    {
      day: 6,
      title: "CAPE COAST",
      date: "Thursday, November 13th, 2025",
      activities: [
        "Depart to Kakum National Park for Canopy Walk experience",
        "Enjoy views from 50-meter-long rope and wooden walkway suspended 100 feet above tropical rainforest",
        "Afternoon City Tour of Cape Coast (University of Cape Coast)",
        "Tour St. Georges Slave Dungeon at Elmina",
        "Emotional tour of Slave Dungeons and walk through Female Dungeons",
        "Return to resort mid-afternoon",
        "Beach relaxation time under coconut trees"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort"
    },
    {
      day: 7,
      title: "ELMINA-ACCRA-AKOSOMBO-ACCRA",
      date: "Friday, November 14th, 2025",
      activities: [
        "Morning check-out at 7:30am",
        "Drive by Fort Amsterdam at Abandze (built by British 1634, seized by Dutch 1646)",
        "Upon arrival in Accra, continue to Eastern Region",
        "Drive by Shai Hills Resource Reserve; interact with Baboons (feed them bananas)",
        "Continue to Akosombo (location of Volta Lake, one of largest man-made lakes in world)",
        "Visit Akosombo Dam and Adomi Bridge",
        "Boat Cruise on Volta Lake",
        "Meet with seamstresses and tailors for final fitting of custom outfits"
      ],
      meals: "B",
      accommodation: "Movenpick Hotel"
    },
    {
      day: 8,
      title: "DEPARTURE DAY",
      date: "Saturday, November 15th, 2025",
      activities: [
        "Early morning departure at 4:30am on Delta Airlines with packed breakfast",
        "After breakfast, depart hotel for last minute shopping",
        "Return to hotel at mid-day for check out",
        "Departure at 6:00pm from Hotel to Airport for United Airlines check-in"
      ],
      meals: "B",
      accommodation: "None"
    }
  ],
  inclusions: [
    "Accommodation in 4-star hotels",
    "Daily breakfast",
    "Welcome dinner",
    "All ground transportation in air-conditioned vehicle",
    "Professional tour guide",
    "Entrance fees to all sites",
    "Traditional Asante Naming Ceremony",
    "Custom African outfit tailoring (measurements and final fitting)",
    "Boat cruise on Volta Lake",
    "Bottled water during tours"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches and dinners (unless specified)",
    "Personal expenses",
    "Tips",
    "Custom outfit fabric and tailoring costs"
  ],
  hotels: [
    { name: "Movenpick Hotel", location: "Accra", nights: 3, checkIn: "Day 1", checkOut: "Day 4" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 2, checkIn: "Day 5", checkOut: "Day 7" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/jeanette-group.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-11-08"],
  notes: "Tour dates: November 8-15, 2025"
}

// Tour 2: THELMA'S GROUP
const tour2 = {
  title: "9-Day Ghana Heritage & Culture Experience - Thelma's Group",
  description: "A comprehensive 9-day journey through Ghana's rich cultural heritage, visiting Accra, Kumasi, Cape Coast, and Elmina. Experience traditional Asante naming ceremonies, explore historic slave castles, walk through Kakum National Park's canopy walkway, and cruise on Volta Lake. Includes custom African outfit tailoring.",
  durationDays: 9,
  durationNights: 8,
  regions: ["Greater Accra", "Ashanti", "Eastern", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park",
    "W.E.B Dubois Center",
    "Manhyia Palace Museum",
    "Traditional Asante Naming Ceremony",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Ejisu Besease Shrine",
    "Assin Manso Slavery Memorial & Slave River",
    "Cape Coast Castle & Door of No Return",
    "Elmina (St. George's) Castle",
    "Kakum National Park Canopy Walk",
    "Akosombo Dam & Volta Lake Cruise",
    "Shai Hills Resource Reserve",
    "Custom African outfit tailoring"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "Saturday, November 8th, 2025",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour coordinator and board tour bus",
        "Money Exchange",
        "Transfer to Hotel and Check-in",
        "Group Orientation and welcome dinner at hotel",
        "Measurements taken by seamstresses and tailors for custom African outfits"
      ],
      meals: "Dinner",
      accommodation: "Movenpick Hotel"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Sunday, November 9th, 2025",
      activities: [
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park (first president of Ghana, Pan African Movement leader)",
        "Shopping at Arts & Crafts center",
        "Visit to W.E.B Dubois Center"
      ],
      meals: "B",
      accommodation: "Movenpick Hotel"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI",
      date: "Monday, November 10th, 2025",
      activities: [
        "Early breakfast; Check out at 7:30am",
        "Depart for Kumasi (Capital City of Ashanti Region)",
        "Early afternoon arrival in Ejisu (hometown of Nana Yaa Asantewaa, the Warrior Queen)",
        "Visit Ejisu Besease Shrine (traditional Asante Shrine)",
        "Continue to Kumasi with city tour through Kwame Nkrumah University of Science and Technology",
        "Tour of Manhyiaa Palace Museum (Ashanti history and culture)",
        "Transfer to hotel for check in"
      ],
      meals: "B",
      accommodation: "Lancaster Hotel"
    },
    {
      day: 4,
      title: "KUMASI",
      date: "Tuesday, November 11th, 2025",
      activities: [
        "Depart hotel at 8:30am",
        "Traditional Asante Naming Ceremony at Palace of Nana Kofi Nti II, Chief linguist of Asantehene",
        "Tour of Kumasi Cultural Center (Prempeh II Museum) and shopping at Gift shops",
        "Afternoon tour and shopping at 3 Craft Villages:",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth",
        "Late afternoon transfer to hotel"
      ],
      meals: "B",
      accommodation: "Lancaster Hotel"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST",
      date: "Wednesday, November 12th, 2025",
      activities: [
        "Depart at 7:30am for Central Region",
        "Tour Assin Manso: Slavery Memorial and Slave River (Donko Nsuo)",
        "Remove shoes and walk to river, dip feet/stand in river as 'Reverence to the Ancestors'",
        "Continue to Cape Coast",
        "Afternoon arrival in Elmina and transfer to Elmina (St. George's) Castle",
        "Emotional tour of Slave Dungeons",
        "Transfer to resort for check-in"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort"
    },
    {
      day: 6,
      title: "CAPE COAST",
      date: "Thursday, November 13th, 2025",
      activities: [
        "Depart at 8:30am to Kakum National Park for Canopy Walk experience",
        "Enjoy views from 50-meter-long rope and wooden walkway suspended 100 feet above tropical rainforest",
        "Afternoon City Tour of Cape Coast (University of Cape Coast)",
        "Tour Cape Coast Castle and Slavery Museum",
        "Emotional tour of Slave Dungeons and walk through 'Door of No Return'",
        "Return to resort mid-afternoon",
        "Beach relaxation time under coconut trees"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort"
    },
    {
      day: 7,
      title: "CAPE COAST TO ACCRA",
      date: "Friday, November 14th, 2025",
      activities: [
        "Morning check-out at 8:00am",
        "Drive by Fort Amsterdam at Abandze (built by British 1634, seized by Dutch 1646)",
        "Meet with seamstresses and tailors for final fitting of custom outfits",
        "Evening recuperation"
      ],
      meals: "B",
      accommodation: "Movenpick Hotel"
    },
    {
      day: 8,
      title: "ACCRA-AKOSOMBO-ACCRA",
      date: "Saturday, November 15th, 2025",
      activities: [
        "Depart hotel at 8:00am for Eastern Region",
        "Drive through Tema Motorway (first of its kind, built by Kwame Nkrumah)",
        "Visit Shai Hills Resource Reserve; interact with Baboons (feed them bananas)",
        "See variety of animals: Zebras, Ostriches, antelopes (KOB, BUSHBUCK, DUIKER)",
        "Continue to Akosombo (location of Volta Lake, one of largest man-made lakes in world)",
        "Visit Akosombo Dam and Adomi Bridge",
        "Boat Cruise on Volta Lake"
      ],
      meals: "B",
      accommodation: "Movenpick Hotel"
    },
    {
      day: 9,
      title: "DEPARTURE DAY",
      date: "Sunday, November 16th, 2025",
      activities: [
        "Early morning departure at 4:30am on Delta Airlines with packed breakfast",
        "After breakfast, depart hotel for last minute shopping",
        "Return to hotel at mid-day for check out",
        "Departure at 6:00pm from Hotel to Airport for United Airlines check-in"
      ],
      meals: "B",
      accommodation: "None"
    }
  ],
  inclusions: [
    "Accommodation in 4-star hotels",
    "Daily breakfast",
    "Welcome dinner",
    "All ground transportation in air-conditioned vehicle",
    "Professional tour guide",
    "Entrance fees to all sites",
    "Traditional Asante Naming Ceremony",
    "Custom African outfit tailoring (measurements and final fitting)",
    "Boat cruise on Volta Lake",
    "Bottled water during tours"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches and dinners (unless specified)",
    "Personal expenses",
    "Tips",
    "Custom outfit fabric and tailoring costs"
  ],
  hotels: [
    { name: "Movenpick Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 5" },
    { name: "Lancaster Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 2, checkIn: "Day 5", checkOut: "Day 7" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/thelma-group.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-11-08"],
  notes: "Tour dates: November 8-16, 2025"
}

// Tour 3: RONNIE CARRINGTON & FRIENDS
const tour3 = {
  title: "10-Day Ghana Heritage & Culture Experience - Ronnie Carrington & Friends",
  description: "An immersive 10-day journey through Ghana's rich cultural heritage, visiting Accra, Kumasi, Cape Coast, Elmina, and Takoradi. Experience traditional Asante naming ceremonies, explore historic slave castles, walk through Kakum National Park's canopy walkway, visit Bisa Abrewa Museum, and cruise on Volta Lake. Includes custom African outfit tailoring.",
  durationDays: 10,
  durationNights: 9,
  regions: ["Greater Accra", "Ashanti", "Eastern", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Memorial Park",
    "W.E.B Dubois Center",
    "Manhyia Palace Museum",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Craft Villages: Bonwire (Kente), Ahwiaa (Wood Carvings), Ntonsu (Adinkra)",
    "Ejisu Besease Shrine",
    "Assin Manso Slavery Memorial & Slave River",
    "Cape Coast Castle & Door of No Return",
    "Elmina (St. George's) Castle",
    "Kakum National Park Canopy Walk",
    "Bisa Abrewa Museum, Takoradi",
    "Akosombo Dam & Volta Lake Cruise",
    "Shai Hills Resource Reserve",
    "Custom African outfit tailoring"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVE ACCRA",
      date: "Saturday, August 15th, 2026",
      activities: [
        "Flight arrives at Kotoka International Airport",
        "Complete Customs and Immigration formalities",
        "Meet tour coordinator and board tour bus"
      ],
      meals: "Dinner",
      accommodation: "La-Palm Royal Beach Hotel"
    },
    {
      day: 2,
      title: "ACCRA CITY TOUR",
      date: "Sunday, August 16th, 2026",
      activities: [
        "Money Exchange",
        "Visit Independence Square and Freedom Arch",
        "Tour of Kwame Nkrumah Memorial Park (first president of Ghana, Pan African Movement leader)",
        "Shopping at Arts & Crafts center",
        "Visit to W.E.B Dubois Center",
        "Group Orientation at hotel",
        "Shop for fabric from vendors assembled at hotel",
        "Measurements taken by seamstresses and tailors for custom African outfits"
      ],
      meals: "B",
      accommodation: "La-Palm Royal Beach Hotel"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI",
      date: "Monday, August 17th, 2026",
      activities: [
        "Early breakfast; Check out",
        "Depart for Kumasi (Capital City of Ashanti Region)",
        "Early afternoon arrival in Ejisu (hometown of Nana Yaa Asantewaa, the Warrior Queen)",
        "Visit Ejisu Besease Shrine (traditional Asante Shrine)",
        "Continue to Kumasi with city tour through Kwame Nkrumah University of Science and Technology",
        "Tour of Manhyiaa Palace Museum (Ashanti history and culture)",
        "Transfer to hotel for check in"
      ],
      meals: "B",
      accommodation: "Lancaster City Hotel"
    },
    {
      day: 4,
      title: "KUMASI",
      date: "Tuesday, August 18th, 2026",
      activities: [
        "Continuation of Kumasi City Tour",
        "Tour of Kumasi Cultural Center (Prempeh II Museum) and shopping at Gift shops",
        "Afternoon tour and shopping at 3 Craft Villages:",
        "  - Bonwire for Kente Cloth",
        "  - Ahwiaa for Wood Carvings",
        "  - Ntonsu for Adinkra Cloth",
        "Late afternoon transfer to hotel"
      ],
      meals: "B",
      accommodation: "Lancaster City Hotel"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST",
      date: "Wednesday, August 19th, 2026",
      activities: [
        "Check out of hotel",
        "Depart for Central Region to Assin Manso",
        "Tour Assin Manso: Slavery Memorial and Slave River (Donko Nsuo)",
        "Remove shoes and walk to river, dip feet/stand in river as 'Reverence to the Ancestors'",
        "Continue to Cape Coast",
        "Afternoon arrival in Elmina and transfer to Elmina (St. George's) Castle",
        "Emotional tour of Slave Dungeons",
        "Transfer to resort for check-in"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort"
    },
    {
      day: 6,
      title: "CAPE COAST",
      date: "Thursday, August 20th, 2026",
      activities: [
        "Short road trip to Kakum National Park for Canopy Walk experience",
        "Enjoy views from 50-meter-long rope and wooden walkway suspended 100 feet above tropical rainforest",
        "Afternoon City Tour of Cape Coast (boarding High Schools and University of Cape Coast)",
        "Tour Cape Coast Castle and Slavery Museum",
        "Emotional tour of Slave Dungeons and walk through 'Door of No Return'",
        "Return to resort mid-afternoon",
        "Beach relaxation time under coconut trees"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort"
    },
    {
      day: 7,
      title: "CAPE COAST TO TAKORADI",
      date: "Friday, August 21st, 2026",
      activities: [
        "Depart Elmina to Takoradi to visit famous Bisa Abrewa Museum",
        "Return to Elmina",
        "Rest of day for leisure"
      ],
      meals: "B",
      accommodation: "Coconut Grove Beach Resort"
    },
    {
      day: 8,
      title: "CAPE COAST TO ACCRA",
      date: "Saturday, August 22nd, 2026",
      activities: [
        "Mid-morning check-out",
        "Depart Cape Coast to Accra",
        "Visit Fort Amsterdam at Abandze (built by British 1634, seized by Dutch 1646)",
        "Meet with seamstresses and tailors for final fitting of custom outfits",
        "Evening recuperation"
      ],
      meals: "B",
      accommodation: "La-Palm Royal Beach Hotel"
    },
    {
      day: 9,
      title: "ACCRA-AKOSOMBO-ACCRA",
      date: "Sunday, August 23rd, 2026",
      activities: [
        "Check out of hotel and start road trip to Eastern Region",
        "Drive through Tema Motorway (first of its kind, built by Kwame Nkrumah)",
        "Visit Shai Hills Resource Reserve; interact with Baboons (feed them bananas)",
        "See variety of animals: Zebras, Ostriches, antelopes (KOB, BUSHBUCK, DUIKER)",
        "Continue to Akosombo (location of Volta Lake, one of largest man-made lakes in world)",
        "City tour including Akosombo Dam and Adomi Bridge",
        "Boat Cruise on Volta Lake"
      ],
      meals: "B",
      accommodation: "La-Palm Royal Beach Hotel"
    },
    {
      day: 10,
      title: "DEPARTURE DAY",
      date: "Monday, August 24th, 2026",
      activities: [
        "Morning breakfast",
        "Depart hotel for last minute shopping",
        "Return to hotel at mid-day for check out",
        "Departure in evening from Hotel to Airport for check-in"
      ],
      meals: "B",
      accommodation: "None"
    }
  ],
  inclusions: [
    "Accommodation in 4-star hotels",
    "Daily breakfast",
    "All ground transportation in air-conditioned vehicle",
    "Professional tour guide",
    "Entrance fees to all sites",
    "Custom African outfit tailoring (measurements and final fitting)",
    "Boat cruise on Volta Lake",
    "Bottled water during tours"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches and dinners (unless specified)",
    "Personal expenses",
    "Tips",
    "Custom outfit fabric and tailoring costs"
  ],
  hotels: [
    { name: "La-Palm Royal Beach Hotel", location: "Accra", nights: 4, checkIn: "Day 1", checkOut: "Day 5" },
    { name: "Lancaster City Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 3, checkIn: "Day 5", checkOut: "Day 8" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/ronnie-carrington-group.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2026-08-15"],
  notes: "Tour dates: August 15-24, 2026. Cost: $2,680.00 per person (double/twin occupancy); Single supplement: $900.00"
}

async function processTours() {
  const tours = [tour1, tour2, tour3]
  
  console.log(`\n📋 Processing ${tours.length} tours...\n`)
  
  for (const tourData of tours) {
    const slug = createSlug(tourData.title)
    const matchingTour = await findMatchingTour(tourData.title)
    
    const tourPayload = {
      ...tourData,
      slug,
      pricePerPerson: 0,
      singleSupplement: null
    }
    
    if (matchingTour) {
      console.log(`🔄 Updating: ${tourData.title}`)
      await prisma.tour.update({
        where: { id: matchingTour.id },
        data: tourPayload
      })
      console.log(`   ✅ Updated\n`)
    } else {
      console.log(`✨ Creating: ${tourData.title}`)
      await prisma.tour.create({
        data: tourPayload
      })
      console.log(`   ✅ Created\n`)
    }
  }
  
  console.log(`✅ Processing complete!\n`)
}

processTours()
  .then(() => {
    prisma.$disconnect()
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    prisma.$disconnect()
    process.exit(1)
  })

