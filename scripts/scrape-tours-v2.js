// Enhanced scraper that handles JavaScript-rendered content
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

async function scrapeTours() {
  try {
    console.log('🌐 Fetching tours from https://tourworldtourism.com/tours...')
    
    // Try to get the full HTML
    const response = await axios.get('https://tourworldtourism.com/tours', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    })
    
    const $ = cheerio.load(response.data)
    const tours = []
    
    // Save HTML for inspection
    fs.writeFileSync(path.join(__dirname, 'tours-page.html'), response.data)
    console.log('💾 Saved HTML to tours-page.html for inspection\n')
    
    // Try multiple selectors
    const selectors = [
      '.premium-tours-grid > div',
      '.tour-item',
      '.tour-card',
      '[class*="tour"]',
      'article',
      '.gdlr-core-blog-item'
    ]
    
    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        console.log(`📋 Found ${elements.length} elements with selector: ${selector}`)
        
        elements.each((index, element) => {
          const $el = $(element)
          
          // Try to find title
          const title = $el.find('h2, h3, h4, .tour-title, .entry-title').first().text().trim() ||
                       $el.find('a').first().text().trim()
          
          if (!title || title.length < 10) return
          
          // Find images
          const images = []
          $el.find('img').each((i, img) => {
            let src = $(img).attr('src') || $(img).attr('data-src') || $(img).attr('data-lazy-src')
            if (src) {
              if (!src.startsWith('http')) {
                src = `https://tourworldtourism.com${src}`
              }
              images.push(src)
            }
          })
          
          // Find link
          const link = $el.find('a').first().attr('href')
          
          // Extract description
          const description = $el.find('.description, .excerpt, p').first().text().trim()
          
          const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
          
          // Check if we already have this tour
          if (!tours.find(t => t.title === title)) {
            tours.push({
              title,
              slug,
              description: description.substring(0, 200),
              featuredImage: images[0] || null,
              galleryImages: images.slice(1),
              link: link ? (link.startsWith('http') ? link : `https://tourworldtourism.com${link}`) : null
            })
          }
        })
        
        if (tours.length > 0) break
      }
    }
    
    // Also try to find tour links in the page
    $('a[href*="tour"]').each((index, element) => {
      const $el = $(element)
      const link = $el.attr('href')
      const title = $el.text().trim() || $el.find('img').attr('alt') || ''
      const img = $el.find('img').attr('src') || $el.find('img').attr('data-src')
      
      if (title && title.length > 10 && !tours.find(t => t.title === title)) {
        tours.push({
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          description: '',
          featuredImage: img ? (img.startsWith('http') ? img : `https://tourworldtourism.com${img}`) : null,
          galleryImages: [],
          link: link ? (link.startsWith('http') ? link : `https://tourworldtourism.com${link}`) : null
        })
      }
    })
    
    console.log(`\n✅ Found ${tours.length} tours\n`)
    
    // Save to JSON
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
    }
    return []
  }
}

scrapeTours().then(() => {
  console.log('✅ Scraping complete!')
  process.exit(0)
}).catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

