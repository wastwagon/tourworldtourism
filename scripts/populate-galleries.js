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

// Gallery data from existing folders
const galleriesData = [
  {
    title: "Thelma & Jeanette November 2025 Tour",
    tourName: "Thelma & Jeanette November 2025",
    description: "Memories from Thelma & Jeanette's November 2025 Ghana tour experience",
    folderPath: "public/images/galleries/thelma-jeanette-nov-2025",
  },
  {
    title: "Tour Pics 2025",
    tourName: "2025 Tours Collection",
    description: "A collection of photos from our 2025 tours",
    folderPath: "public/images/galleries/tour-pics-2025",
  },
];

function getImagesFromFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️  Folder not found: ${folderPath}`);
      return [];
    }

    const files = fs.readdirSync(folderPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => {
        // Convert to web path
        const relativePath = folderPath.replace('public', '');
        return `${relativePath}/${file}`;
      })
      .sort(); // Sort alphabetically

    return images;
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error.message);
    return [];
  }
}

async function populateGalleries() {
  console.log('📸 Starting gallery population...');

  try {
    // Clear existing galleries
    await prisma.gallery.deleteMany();
    console.log('✅ Cleared existing galleries');

    // Create galleries
    for (const galleryData of galleriesData) {
      const images = getImagesFromFolder(galleryData.folderPath);
      
      if (images.length === 0) {
        console.warn(`⚠️  No images found in ${galleryData.folderPath}, skipping...`);
        continue;
      }

      const slug = slugify(galleryData.title, { lower: true, strict: true });
      
      const created = await prisma.gallery.create({
        data: {
          title: galleryData.title,
          slug,
          description: galleryData.description,
          tourName: galleryData.tourName,
          images,
          featuredImage: images[0] || null,
          featured: true,
          published: true,
        },
      });

      console.log(`✅ Created gallery: ${created.title} (${images.length} images)`);
    }

    console.log(`\n✅ Successfully populated ${galleriesData.length} galleries!`);
  } catch (error) {
    console.error('❌ Error populating galleries:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

populateGalleries()
  .then(() => {
    console.log('\n🎉 Gallery population complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to populate galleries:', error);
    process.exit(1);
  });

