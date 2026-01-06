// Script to update existing tours or create new ones based on provided data
require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Function to find matching tour
async function findMatchingTour(title) {
  const slug = createSlug(title)
  
  // Try exact slug match first
  let tour = await prisma.tour.findUnique({
    where: { slug }
  })
  
  if (tour) return tour
  
  // Try title similarity
  const allTours = await prisma.tour.findMany({
    select: { id: true, title: true, slug: true }
  })
  
  const titleLower = title.toLowerCase()
  for (const t of allTours) {
    const tTitleLower = t.title.toLowerCase()
    // Check if titles are similar (contain significant words)
    const titleWords = titleLower.split(/\s+/).filter(w => w.length > 3)
    const matchCount = titleWords.filter(w => tTitleLower.includes(w)).length
    
    if (matchCount >= 2) {
      return t
    }
  }
  
  return null
}

// Function to update or create tour
async function updateOrCreateTour(tourData) {
  try {
    const {
      title,
      description,
      durationDays,
      durationNights,
      regions,
      tourType,
      highlights,
      itinerary,
      inclusions,
      exclusions,
      hotels,
      featuredImage,
      galleryImages,
      featured = false,
      status = 'active',
      notes,
      groupSizeMin,
      groupSizeMax,
      availableDates
    } = tourData
    
    if (!title) {
      console.error('❌ Tour data missing title')
      return null
    }
    
    const slug = createSlug(title)
    const matchingTour = await findMatchingTour(title)
    
    const tourPayload = {
      title,
      slug,
      description: description || '',
      durationDays: durationDays || 0,
      durationNights: durationNights || 0,
      regions: regions || [],
      tourType: tourType || 'Culture & Heritage',
      highlights: highlights || [],
      itinerary: itinerary || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      hotels: hotels || [],
      featuredImage: featuredImage || null,
      galleryImages: galleryImages || [],
      featured: featured,
      status: status,
      notes: notes || null,
      groupSizeMin: groupSizeMin || null,
      groupSizeMax: groupSizeMax || null,
      availableDates: availableDates || [],
      // Remove pricing - set to 0
      pricePerPerson: 0,
      singleSupplement: null
    }
    
    if (matchingTour) {
      // Update existing tour
      console.log(`🔄 Updating existing tour: ${title}`)
      const updated = await prisma.tour.update({
        where: { id: matchingTour.id },
        data: tourPayload
      })
      console.log(`   ✅ Updated tour ID: ${updated.id}`)
      return updated
    } else {
      // Create new tour
      console.log(`✨ Creating new tour: ${title}`)
      const created = await prisma.tour.create({
        data: tourPayload
      })
      console.log(`   ✅ Created tour ID: ${created.id}`)
      return created
    }
  } catch (error) {
    console.error(`❌ Error processing tour "${tourData.title}":`, error.message)
    return null
  }
}

// Main function to process tours
async function processTours(toursData) {
  console.log(`\n📋 Processing ${toursData.length} tours...\n`)
  
  const results = {
    updated: [],
    created: [],
    errors: []
  }
  
  for (const tourData of toursData) {
    const result = await updateOrCreateTour(tourData)
    if (result) {
      const matchingTour = await findMatchingTour(tourData.title)
      if (matchingTour && matchingTour.id === result.id) {
        results.updated.push(result.title)
      } else {
        results.created.push(result.title)
      }
    } else {
      results.errors.push(tourData.title || 'Unknown')
    }
  }
  
  console.log(`\n✅ Processing complete!\n`)
  console.log(`📊 Summary:`)
  console.log(`   Updated: ${results.updated.length}`)
  console.log(`   Created: ${results.created.length}`)
  console.log(`   Errors: ${results.errors.length}`)
  
  if (results.updated.length > 0) {
    console.log(`\n🔄 Updated tours:`)
    results.updated.forEach(title => console.log(`   • ${title}`))
  }
  
  if (results.created.length > 0) {
    console.log(`\n✨ Created tours:`)
    results.created.forEach(title => console.log(`   • ${title}`))
  }
  
  if (results.errors.length > 0) {
    console.log(`\n❌ Errors:`)
    results.errors.forEach(title => console.log(`   • ${title}`))
  }
  
  return results
}

// Export for use
module.exports = { updateOrCreateTour, processTours, findMatchingTour }

// If run directly, expect JSON input
if (require.main === module) {
  const toursData = JSON.parse(process.argv[2] || '[]')
  processTours(toursData)
    .then(() => {
      prisma.$disconnect()
      process.exit(0)
    })
    .catch(error => {
      console.error('Fatal error:', error)
      prisma.$disconnect()
      process.exit(1)
    })
}

