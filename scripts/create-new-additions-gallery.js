#!/usr/bin/env node

/**
 * Create a gallery entry for the new-additions-january-2026 images
 * This script creates a gallery entry in the database with all images from the folder
 */

require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function createNewAdditionsGallery() {
  try {
    console.log('📸 Creating gallery entry for new-additions-january-2026...\n')

    const gallerySlug = 'new-additions-january-2026'
    const galleryFolder = path.join(process.cwd(), 'public', 'images', 'galleries', gallerySlug)

    // Check if folder exists
    if (!fs.existsSync(galleryFolder)) {
      console.error(`❌ Folder not found: ${galleryFolder}`)
      process.exit(1)
    }

    // Read all image files from the folder
    const files = fs.readdirSync(galleryFolder)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext) && !file.startsWith('.')
      })
      .map(file => {
        // Use API path for production, direct path for development
        const imagePath = process.env.NODE_ENV === 'production' 
          ? `/api/images/galleries/${gallerySlug}/${file}`
          : `/images/galleries/${gallerySlug}/${file}`
        return imagePath
      })
      .sort()

    if (images.length === 0) {
      console.error('❌ No images found in folder')
      process.exit(1)
    }

    console.log(`📁 Found ${images.length} images in folder`)
    console.log(`📝 First image: ${images[0]}`)
    console.log(`📝 Last image: ${images[images.length - 1]}\n`)

    // Check if gallery already exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { slug: gallerySlug }
    })

    const galleryData = {
      title: 'New Additions January 2026',
      slug: gallerySlug,
      description: 'New photos added to our gallery collection in January 2026',
      tourName: '2026 Tours Collection',
      images: images,
      featuredImage: images[0] || null,
      featured: true,
      published: true,
    }

    if (existingGallery) {
      console.log('🔄 Gallery already exists. Updating with new images...')
      const updated = await prisma.gallery.update({
        where: { slug: gallerySlug },
        data: galleryData
      })
      console.log(`✅ Gallery updated successfully!`)
      console.log(`   Title: ${updated.title}`)
      console.log(`   Images: ${updated.images.length}`)
      console.log(`   Published: ${updated.published}`)
    } else {
      console.log('✨ Creating new gallery entry...')
      const created = await prisma.gallery.create({
        data: galleryData
      })
      console.log(`✅ Gallery created successfully!`)
      console.log(`   ID: ${created.id}`)
      console.log(`   Title: ${created.title}`)
      console.log(`   Slug: ${created.slug}`)
      console.log(`   Images: ${created.images.length}`)
      console.log(`   Published: ${created.published}`)
    }

    console.log(`\n🎉 Gallery entry ready! Total images: ${images.length}`)
  } catch (error) {
    console.error('❌ Error creating gallery:', error)
    if (error.code === 'P2002') {
      console.error('   Gallery with this slug already exists')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createNewAdditionsGallery()
