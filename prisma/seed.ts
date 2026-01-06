import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// Ensure DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Prisma 6.x - standard initialization
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Sample tour data
  const tours = [
    {
      title: 'Ultimate Ghana Experience',
      slug: 'ultimate-ghana-experience',
      description: 'A comprehensive 10-day journey through Ghana\'s most iconic destinations, combining history, culture, and natural beauty.',
      durationDays: 10,
      durationNights: 9,
      regions: ['Greater Accra', 'Ashanti', 'Central', 'Eastern'],
      tourType: 'Culture & Heritage',
      highlights: [
        'Visit Cape Coast and Elmina Castles',
        'Explore Kakum National Park',
        'Experience Ashanti Kingdom culture',
        'Discover Accra\'s vibrant markets',
        'Relax on beautiful beaches'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Accra',
          activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'],
          meals: 'D',
          accommodation: 'Accra Hotel'
        },
        {
          day: 2,
          title: 'Accra City Tour',
          activities: ['Independence Square', 'Kwame Nkrumah Mausoleum', 'Makola Market'],
          meals: 'B/L/D',
          accommodation: 'Accra Hotel'
        }
      ],
      inclusions: [
        'Airport transfers',
        'Accommodation',
        'Meals as specified',
        'Professional guide',
        'Entrance fees'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Personal expenses',
        'Tips'
      ],
      hotels: [],
      pricePerPerson: 2500,
      singleSupplement: 500,
      groupSizeMin: 2,
      groupSizeMax: 12,
      availableDates: [],
      featured: true,
      status: 'active',
      featuredImage: '/images/tours/ultimate-ghana-experience.jpg',
      galleryImages: []
    },
    {
      title: 'Ghana Highlights Express',
      slug: 'ghana-highlights-express',
      description: 'A fast-paced 5-day tour covering Ghana\'s must-see attractions for travelers with limited time.',
      durationDays: 5,
      durationNights: 4,
      regions: ['Greater Accra', 'Central'],
      tourType: 'Historical',
      highlights: [
        'Cape Coast Castle',
        'Kakum Canopy Walkway',
        'Accra city highlights',
        'Local cuisine experience'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Accra Tour',
          activities: ['Airport pickup', 'City tour', 'Market visit'],
          meals: 'D',
          accommodation: 'Accra Hotel'
        }
      ],
      inclusions: [
        'Accommodation',
        'Breakfast daily',
        'Professional guide',
        'Transportation'
      ],
      exclusions: [
        'Lunch and dinner',
        'International flights',
        'Personal expenses'
      ],
      hotels: [],
      pricePerPerson: 1200,
      singleSupplement: 300,
      groupSizeMin: 2,
      groupSizeMax: 8,
      availableDates: [],
      featured: true,
      status: 'active',
      featuredImage: '/images/tours/highlights-express.jpg',
      galleryImages: []
    },
    {
      title: 'Deep Heritage Experience',
      slug: 'deep-heritage-experience',
      description: 'An immersive 14-day journey exploring Ghana\'s rich cultural heritage, historical sites, and traditional communities.',
      durationDays: 14,
      durationNights: 13,
      regions: ['Greater Accra', 'Ashanti', 'Central', 'Eastern', 'Western'],
      tourType: 'Culture & Heritage',
      highlights: [
        'Extended time in Ashanti region',
        'Traditional village stays',
        'Cultural performances',
        'Historical slave route sites',
        'Wildlife encounters'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival',
          activities: ['Airport pickup', 'Orientation'],
          meals: 'D',
          accommodation: 'Accra Hotel'
        }
      ],
      inclusions: [
        'All accommodations',
        'All meals',
        'Cultural experiences',
        'Professional guide',
        'Transportation'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Personal expenses'
      ],
      hotels: [],
      pricePerPerson: 3500,
      singleSupplement: 700,
      groupSizeMin: 2,
      groupSizeMax: 10,
      availableDates: [],
      featured: true,
      status: 'active',
      featuredImage: '/images/tours/deep-heritage-experience.jpg',
      galleryImages: []
    }
  ]

  console.log(`📦 Creating ${tours.length} tours...`)

  for (const tour of tours) {
    await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: tour,
      create: tour,
    })
    console.log(`✅ Created/Updated: ${tour.title}`)
  }

  console.log('✨ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

