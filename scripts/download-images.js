// Script to download images from scraped tours and assign to database tours
const axios = require('axios')
const fs = require('fs')
const path = require('path')
require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const writer = fs.createWriteStream(filepath)
    response.data.pipe(writer)
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message)
    return null
  }
}

async function processTours() {
  try {
    // Read scraped tours
    const scrapedToursPath = path.join(__dirname, 'scraped-tours.json')
    if (!fs.existsSync(scrapedToursPath)) {
      console.error('❌ scraped-tours.json not found. Run scrape-tours.js first.')
      return
    }
    
    const scrapedTours = JSON.parse(fs.readFileSync(scrapedToursPath, 'utf8'))
    console.log(`📋 Found ${scrapedTours.length} tours from website\n`)
    
    // Get all tours from database
    const dbTours = await prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        galleryImages: true
      }
    })
    
    console.log(`📊 Found ${dbTours.length} tours in database\n`)
    
    // Create images directory
    const imagesDir = path.join(__dirname, '..', 'public', 'images', 'tours')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }
    
    // Match and update tours
    for (const scrapedTour of scrapedTours) {
      // Find matching tour in database by title similarity
      const matchingTour = dbTours.find(dbTour => {
        const dbTitleLower = dbTour.title.toLowerCase()
        const scrapedTitleLower = scrapedTour.title.toLowerCase()
        return dbTitleLower.includes(scrapedTitleLower.substring(0, 20)) ||
               scrapedTitleLower.includes(dbTitleLower.substring(0, 20))
      })
      
      if (!matchingTour) {
        console.log(`⚠️  No match found for: ${scrapedTour.title}`)
        continue
      }
      
      console.log(`\n🔄 Processing: ${matchingTour.title}`)
      
      const updates = {}
      
      // Download featured image
      if (scrapedTour.featuredImage) {
        const filename = `${matchingTour.slug}-featured.jpg`
        const filepath = path.join(imagesDir, filename)
        const webPath = `/images/tours/${filename}`
        
        console.log(`  📥 Downloading featured image...`)
        await downloadImage(scrapedTour.featuredImage, filepath)
        updates.featuredImage = webPath
      }
      
      // Download gallery images
      if (scrapedTour.galleryImages && scrapedTour.galleryImages.length > 0) {
        const galleryPaths = []
        for (let i = 0; i < scrapedTour.galleryImages.length; i++) {
          const imgUrl = scrapedTour.galleryImages[i]
          const filename = `${matchingTour.slug}-gallery-${i + 1}.jpg`
          const filepath = path.join(imagesDir, filename)
          const webPath = `/images/tours/${filename}`
          
          console.log(`  📥 Downloading gallery image ${i + 1}/${scrapedTour.galleryImages.length}...`)
          await downloadImage(imgUrl, filepath)
          galleryPaths.push(webPath)
        }
        updates.galleryImages = galleryPaths
      }
      
      // Update database
      if (Object.keys(updates).length > 0) {
        await prisma.tour.update({
          where: { id: matchingTour.id },
          data: updates
        })
        console.log(`  ✅ Updated database`)
      }
    }
    
    console.log(`\n✅ Image download and assignment complete!`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

processTours()

