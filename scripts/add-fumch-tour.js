// Add FUMCH Ghana Tour with enhanced itinerary
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

const fumchTour = {
  title: "8-Day Destination Ghana – EXPLORE HISTORY, EMBRACE CULTURE - FUMCH Group",
  description: "A faith-based 8-day cultural journey through Ghana for the First United Methodist Church of Hyattsville (FUMCH) family. Experience spiritual connection through church service, community engagement at an orphanage, deep cultural immersion with traditional naming ceremony, and emotional historical sites. Includes custom Ghanaian designer wear tailoring and personalized Asante naming ceremony with certificate.",
  durationDays: 8,
  durationNights: 7,
  regions: ["Greater Accra", "Ashanti", "Central"],
  tourType: "Culture & Heritage",
  highlights: [
    "T.K. Beads Factory and Boutique",
    "Independence Square & Freedom Arch",
    "Kwame Nkrumah Mausoleum",
    "W.E.B Dubois Center",
    "Church Service at University of Ghana, Legon",
    "Potters Village Orphanage Visit (Dodowa)",
    "Lunch with Alex Lucus & Ngozi family",
    "Ejisu Besease Shrine (UNESCO World Heritage Site - hometown of Nana Yaa Asantewaa, Warrior Queen)",
    "Kwame Nkrumah University of Science and Technology",
    "Manhyia Palace Museum",
    "Kumasi Cultural Center (Prempeh II Museum)",
    "Traditional Naming Ceremony with Chief and Queen Mother (receive Asante name, certificate, and Kente strip)",
    "Craft Villages: Ahwiaa (Wood Carving), Bonwire (Kente), Ntonsu (Adinkra)",
    "Assin Manso Slavery Memorial & Slave River (Ndonkor Nsuo)",
    "Elmina (St. Georges) Castle & Slave Dungeons",
    "Cape Coast Castle & Door of No Return",
    "Kakum National Park Canopy Walk",
    "Custom Ghanaian designer wear (order Day 1, final fitting Day 7)"
  ],
  itinerary: [
    {
      day: 1,
      title: "ARRIVAL - ACCRA",
      date: "Saturday, October 18th, 2025",
      activities: [
        "Arrival - Concierge welcome service",
        "Clear Immigration & Customs (based on arrival time)",
        "Transfer to hotel OR stop for currency exchange on way to hotel",
        "Possible visits based on arrival time",
        "Tour Coverage:",
        "  - T.K. Beads Factory and Boutique",
        "  - Independence Square and Freedom Arch",
        "Special Activities:",
        "  - Group orientation at 5:00pm",
        "  - Group meets Tailors and Seamstresses to order Ghanaian designer wears"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La Palm Royal Beach Hotel",
      notes: "Flexible schedule based on flight arrival time"
    },
    {
      day: 2,
      title: "ACCRA",
      date: "Sunday, October 19th, 2025",
      activities: [
        "After Breakfast",
        "Depart Hotel for Church Service at University of Ghana, Legon",
        "A visit to Potters Village Orphanage at Dodowa",
        "Late Lunch with Alex Lucus & Ngozi family"
      ],
      meals: "Breakfast and Lunch",
      accommodation: "La Palm Royal Beach Hotel",
      notes: "Sunday worship service and community engagement with orphanage visit"
    },
    {
      day: 3,
      title: "ACCRA TO KUMASI - ASHANTI REGION",
      date: "Monday, October 20th, 2025",
      activities: [
        "Check-out hotel and depart for Kumasi",
        "Travel Time: Approximately 6 hours with stops",
        "Tour Coverage:",
        "  - Ejisu Besease - Hometown of Nana Yaa Asantewaa the Warrior Queen",
        "    Unique and traditional Asante Shrine (UNESCO World Heritage Site)",
        "  - Kwame Nkrumah University of Science and Technology",
        "  - Manhyiaa Palace Museum"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Kumasi City Hotel",
      notes: "Long travel day with significant cultural stops"
    },
    {
      day: 4,
      title: "KUMASI - ASHANTI REGION",
      date: "Tuesday, October 21st, 2025",
      activities: [
        "Tour Coverage:",
        "  - Kumasi Cultural Center (Prempeh II Museum)",
        "    Learn more about Ashanti (Asante) history and culture",
        "  - Traditional Naming Ceremony witnessed by a Chief, Queen Mother and invited guests",
        "    - Learn your Asante Day Name and Surname",
        "    - Have it woven on a Kente strip",
        "    - Receive a certificate with your Asante name inscribed on it",
        "  - Ahwiaa - The Wood Carving Village",
        "  - Bonwire - Major production site of Ghana's rich and colorful Kente Cloth",
        "  - Ntonsu - The center of Adinkra Cloth production in Ghana"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Lancaster Kumasi City Hotel",
      notes: "Full cultural immersion day with personalized naming ceremony"
    },
    {
      day: 5,
      title: "KUMASI TO CAPE COAST/ELMINA",
      date: "Wednesday, October 22nd, 2025",
      activities: [
        "Check-out hotel and depart for Cape Coast",
        "Travel Time: Approximately 3-4 hours with stops",
        "Transfer to resort for check-in after visiting Assin Manso & Elmina",
        "Tour Coverage:",
        "  - Assin Manso (early afternoon)",
        "    - Tour of the Slavery Memorial",
        "    - Slave River (Ndonkor Nsuo)",
        "  - Journey southwards towards the coastline",
        "  - Elmina (St. Georges) Castle",
        "    - Tour and walk through of the Slave Dungeons"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Emotional day connecting with history of the transatlantic slave trade"
    },
    {
      day: 6,
      title: "CAPE COAST/ELMINA",
      date: "Thursday, October 23rd, 2025",
      activities: [
        "After breakfast",
        "Tour Coverage:",
        "  - Visit Kakum National Park",
        "  - Cape Coast Castle and Slavery Museum",
        "  - Tour of Slave Dungeons",
        "  - Walk through the Door of No Return"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "Coconut Grove Beach Resort",
      notes: "Continuation of historical journey with nature experience at Kakum"
    },
    {
      day: 7,
      title: "CAPE COAST TO ACCRA",
      date: "Friday, October 24th, 2025",
      activities: [
        "Check-out hotel and depart for Accra",
        "Travel Time: Approximately 3-4 hours with stops",
        "Tour Coverage:",
        "  - Afternoon visit to Kwame Nkrumah Mausoleum",
        "  - W.E.B Dubois Center",
        "  - Meet with seamstresses and tailors for final fitting of custom outfits ordered at the beginning of the tour",
        "  - Spend the evening recuperating from travels around the country",
        "  - Any last-minute shopping if needed"
      ],
      meals: "Breakfast and Dinner",
      accommodation: "La Palm Royal Beach Hotel",
      notes: "Return to Accra with final outfit fittings and relaxation"
    },
    {
      day: 8,
      title: "DEPARTURE DAY - ACCRA",
      date: "Saturday, October 25th, 2025",
      activities: [
        "DELTA AIRLINES departures:",
        "  - Early Morning breakfast",
        "  - Check-out transfer from Hotel to the Airport",
        "UNITED AIRLINES departures:",
        "  - WRAP UP – morning shopping to bring back Christmas gifts",
        "  - Late afternoon transfer to Marina Mall for dinner at the food court",
        "  - Final transfer to Kotoka International Airport for check-in",
        "  - After saying our goodbyes, board your flights for departure with many memories"
      ],
      meals: "Breakfast",
      accommodation: "None",
      notes: "Different departure schedules available based on airline"
    }
  ],
  inclusions: [
    "7 nights accommodation at quality hotels (La Palm Royal Beach Hotel, Lancaster Kumasi City Hotel, Coconut Grove Beach Resort)",
    "Daily breakfast",
    "Select lunches and dinners as indicated in itinerary",
    "Complete private transportation throughout tour",
    "All entrance fees to sites and museums",
    "Custom Ghanaian designer wear (ordering Day 1, final fitting Day 7)",
    "Traditional Naming Ceremony with certificate and Kente strip",
    "Professional tour guide services",
    "Concierge welcome service at airport",
    "All guided tours",
    "Church service attendance",
    "Orphanage visit",
    "Lunch with local Ghanaian family"
  ],
  exclusions: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Lunches and dinners not specified in itinerary",
    "Personal expenses",
    "Tips for guides and drivers",
    "Custom outfit fabric and tailoring costs",
    "Shopping expenses",
    "Optional activities not mentioned in itinerary"
  ],
  hotels: [
    { name: "La Palm Royal Beach Hotel", location: "Accra", nights: 3, checkIn: "Day 1", checkOut: "Day 3, then Day 7", notes: "Days 1-2 and Day 7", address: "No 5 La Bypass, Accra, Ghana", phone: "+233 (30) 215100" },
    { name: "Lancaster Kumasi City Hotel", location: "Kumasi", nights: 2, checkIn: "Day 3", checkOut: "Day 5", notes: "Days 3-4", address: "Rain Tree Street, Lesley Opoku-Ware Drive, Kumasi, Ghana", phone: "+233 32 208 3777" },
    { name: "Coconut Grove Beach Resort", location: "Elmina", nights: 2, checkIn: "Day 5", checkOut: "Day 7", notes: "Days 5-6", address: "Mbofra Akyinim Street Off Cape Coast-Takoradi highway, Elmina 80361 Ghana", phone: "(+233) 244333001" }
  ],
  featured: true,
  status: "active",
  featuredImage: "/images/tours/fumch-ghana-tour.jpg",
  galleryImages: [],
  groupSizeMin: null,
  groupSizeMax: null,
  availableDates: ["2025-10-18"],
  notes: "Tour dates: October 18-25, 2025. Group: Rev. Dr. Yvonne Wallace-Penn & FUMCH family. Organizing Church: First United Methodist Church of Hyattsville (FUMCH), 6201 Belcrest Road, Hyattsville, MD 20782. This faith-based cultural tour combines spiritual connection, historical education, community service, and deep cultural immersion. Features unique experiences: church service, orphanage visit, lunch with local family, and personalized naming ceremony with certificate. Flexible departure schedules for Delta (early morning) and United (evening) airlines.",
  pricePerPerson: 0,
  singleSupplement: null
}

async function addFumchTour() {
  try {
    console.log('🔄 Adding FUMCH Ghana Tour...\n')
    
    // Check if tour already exists
    const existingTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: "FUMCH"
        }
      }
    })
    
    const slug = createSlug(fumchTour.title)
    
    if (existingTour) {
      console.log(`✅ Found existing tour: ${existingTour.title}`)
      await prisma.tour.update({
        where: { id: existingTour.id },
        data: {
          ...fumchTour,
          slug: existingTour.slug // Keep existing slug
        }
      })
      console.log('✅ Updated tour with enhanced itinerary\n')
    } else {
      console.log('✨ Creating new tour...')
      await prisma.tour.create({ 
        data: {
          ...fumchTour,
          slug: slug
        }
      })
      console.log('✅ Created new tour\n')
    }
    
    console.log('✅ FUMCH Ghana Tour added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

addFumchTour()

