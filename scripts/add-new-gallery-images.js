require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please check your .env file.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function addNewGalleryImages() {
  console.log('📸 Adding new gallery images...\n');

  try {
    // Source folder
    const sourceFolder = path.join(process.cwd(), 'NewGalleryAdditions');
    const targetFolder = path.join(process.cwd(), 'public', 'images', 'galleries', 'new-additions-2025');

    // Check if source folder exists
    if (!fs.existsSync(sourceFolder)) {
      console.error(`❌ Source folder not found: ${sourceFolder}`);
      process.exit(1);
    }

    // Create target folder if it doesn't exist
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
      console.log(`✅ Created target folder: ${targetFolder}`);
    }

    // Get all image files
    const files = fs.readdirSync(sourceFolder);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic'];
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    console.log(`📁 Found ${imageFiles.length} images in NewGalleryAdditions\n`);

    if (imageFiles.length === 0) {
      console.log('⚠️  No images found to add.');
      return;
    }

    // Copy images to target folder
    const copiedImages = [];
    for (const file of imageFiles) {
      const sourcePath = path.join(sourceFolder, file);
      const targetPath = path.join(targetFolder, file);
      
      try {
        fs.copyFileSync(sourcePath, targetPath);
        const publicPath = `/images/galleries/new-additions-2025/${file}`;
        copiedImages.push(publicPath);
        console.log(`✅ Copied: ${file}`);
      } catch (error) {
        console.error(`❌ Error copying ${file}:`, error.message);
      }
    }

    console.log(`\n✅ Copied ${copiedImages.length} images to gallery folder\n`);

    // Check if gallery already exists
    const gallerySlug = 'new-additions-2025';
    let existingGallery = await prisma.gallery.findUnique({
      where: { slug: gallerySlug }
    });

    if (existingGallery) {
      // Update existing gallery - add new images to existing ones
      console.log('📝 Gallery exists, updating with new images...');
      
      const existingImages = existingGallery.images || [];
      const newImages = [...new Set([...existingImages, ...copiedImages])]; // Remove duplicates
      
      await prisma.gallery.update({
        where: { id: existingGallery.id },
        data: {
          images: newImages,
          featuredImage: existingGallery.featuredImage || copiedImages[0] || null,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Updated gallery "${existingGallery.title}"`);
      console.log(`   Total images: ${newImages.length} (added ${copiedImages.length} new)`);
    } else {
      // Create new gallery
      console.log('📝 Creating new gallery...');
      
      const gallery = await prisma.gallery.create({
        data: {
          title: 'New Additions 2025',
          slug: gallerySlug,
          description: 'New photos added to our gallery collection',
          tourName: '2025 Tours Collection',
          images: copiedImages,
          featuredImage: copiedImages[0] || null,
          featured: true,
          published: true,
        },
      });

      console.log(`✅ Created new gallery: "${gallery.title}"`);
      console.log(`   Images added: ${copiedImages.length}`);
    }

    console.log('\n🎉 Successfully added images to gallery!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Images copied: ${copiedImages.length}`);
    console.log(`   - Gallery folder: public/images/galleries/new-additions-2025/`);
    console.log(`   - Gallery slug: ${gallerySlug}`);

  } catch (error) {
    console.error('❌ Error adding gallery images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addNewGalleryImages()
  .then(() => {
    console.log('\n✅ Process complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  });

