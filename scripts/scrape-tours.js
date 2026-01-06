// Script to scrape tours from tourworldtourism.com and extract images
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

async function scrapeTours() {
  try {
    console.log('🌐 Fetching tours from https://tourworldtourism.com/tours...')
    const response = await axios.get('https://tourworldtourism.com/tours', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const $ = cheerio.load(response.data)
    const tours = []
    
    // Extract tour information
    // Adjust selectors based on actual website structure
    $('.tour-card, .tour-item, article.tour').each((index, element) => {
      const $el = $(element)
      
      const title = $el.find('h2, h3, .tour-title').first().text().trim()
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      // Extract featured image
      const featuredImage = $el.find('img').first().attr('src') || 
                           $el.find('img').first().attr('data-src') ||
                           null
      
      // Extract gallery images
      const galleryImages = []
      $el.find('img').each((i, img) => {
        const src = $(img).attr('src') || $(img).attr('data-src')
        if (src && src !== featuredImage && !galleryImages.includes(src)) {
          galleryImages.push(src)
        }
      })
      
      // Extract description
      const description = $el.find('.description, .tour-description, p').first().text().trim()
      
      // Extract link
      const link = $el.find('a').first().attr('href')
      
      if (title) {
        tours.push({
          title,
          slug,
          description,
          featuredImage: featuredImage ? (featuredImage.startsWith('http') ? featuredImage : `https://tourworldtourism.com${featuredImage}`) : null,
          galleryImages: galleryImages.map(img => img.startsWith('http') ? img : `https://tourworldtourism.com${img}`),
          link: link ? (link.startsWith('http') ? link : `https://tourworldtourism.com${link}`) : null
        })
      }
    })
    
    // If no tours found with those selectors, try alternative approach
    if (tours.length === 0) {
      console.log('⚠️  No tours found with standard selectors, trying alternative approach...')
      
      // Look for all links that might be tour links
      $('a[href*="/tour"], a[href*="/tours"]').each((index, element) => {
        const $el = $(element)
        const title = $el.text().trim()
        const link = $el.attr('href')
        const img = $el.find('img').attr('src') || $el.find('img').attr('data-src')
        
        if (title && link) {
          tours.push({
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
            description: '',
            featuredImage: img ? (img.startsWith('http') ? img : `https://tourworldtourism.com${img}`) : null,
            galleryImages: [],
            link: link.startsWith('http') ? link : `https://tourworldtourism.com${link}`
          })
        }
      })
    }
    
    console.log(`\n✅ Found ${tours.length} tours on website\n`)
    
    // Save to JSON file
    const outputPath = path.join(__dirname, 'scraped-tours.json')
    fs.writeFileSync(outputPath, JSON.stringify(tours, null, 2))
    console.log(`📄 Saved to ${outputPath}\n`)
    
    // Display summary
    tours.forEach((tour, i) => {
      console.log(`${i + 1}. ${tour.title}`)
      console.log(`   Slug: ${tour.slug}`)
      console.log(`   Featured Image: ${tour.featuredImage ? 'YES' : 'NO'}`)
      console.log(`   Gallery Images: ${tour.galleryImages.length}`)
      console.log(`   Link: ${tour.link || 'N/A'}`)
      console.log('')
    })
    
    return tours
  } catch (error) {
    console.error('❌ Error scraping tours:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data.substring(0, 500))
    }
    return []
  }
}

// Run the scraper
scrapeTours().then(() => {
  console.log('✅ Scraping complete!')
  process.exit(0)
}).catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

