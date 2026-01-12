require('dotenv').config();
const fs = require('fs');
const path = require('path');

/**
 * This script generates gallery data from images already in the folder
 * You can use this data to create the gallery via the admin panel
 */
function generateGalleryData() {
  const gallerySlug = 'new-additions-january-2026';
  const galleryFolder = path.join(process.cwd(), 'public', 'images', 'galleries', gallerySlug);

  if (!fs.existsSync(galleryFolder)) {
    console.error(`❌ Gallery folder not found: ${galleryFolder}`);
    process.exit(1);
  }

  const files = fs.readdirSync(galleryFolder);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  }).sort();

  const images = imageFiles.map(file => `/images/galleries/${gallerySlug}/${file}`);

  const galleryData = {
    title: 'New Additions January 2026',
    slug: gallerySlug,
    description: 'New photos added to our gallery collection in January 2026',
    tourName: '2026 Tours Collection',
    images: images,
    featuredImage: images[0] || null,
    featured: true,
    published: true,
  };

  console.log('📸 Gallery Data Generated:\n');
  console.log(JSON.stringify(galleryData, null, 2));
  console.log('\n✅ Copy this data and use it to create the gallery via:');
  console.log('   1. Go to /admin/galleries/new');
  console.log('   2. Fill in the form with the data above');
  console.log('   3. Or use the API endpoint POST /api/galleries with this JSON');
  console.log(`\n📁 Images found: ${images.length}`);
  console.log(`📂 Folder: public/images/galleries/${gallerySlug}/`);
}

generateGalleryData();
