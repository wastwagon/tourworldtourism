require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please check your .env file.');
  process.exit(1);
}

const prisma = new PrismaClient();

/**
 * Compress and optimize an image
 */
async function compressImage(buffer, originalType, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 85,
  } = options;

  try {
    let sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Resize if image is larger than max dimensions
    if (originalWidth > maxWidth || originalHeight > maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Determine output format - prefer WebP for better compression
    let outputFormat = 'webp';
    let extension = 'webp';

    if (originalType === 'image/png') {
      outputFormat = 'png';
      extension = 'png';
    } else if (buffer.length < 500 * 1024) {
      // Keep original format for small files
      outputFormat = 'jpeg';
      extension = 'jpg';
    }

    // Apply compression
    let compressedBuffer;
    switch (outputFormat) {
      case 'webp':
        compressedBuffer = await sharpInstance
          .webp({ quality, effort: 6 })
          .toBuffer();
        break;
      case 'png':
        compressedBuffer = await sharpInstance
          .png({ quality, compressionLevel: 9 })
          .toBuffer();
        break;
      case 'jpeg':
      default:
        compressedBuffer = await sharpInstance
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
        break;
    }

    // If compressed version is larger, return original
    if (compressedBuffer.length >= buffer.length) {
      return {
        buffer,
        extension: originalType.includes('png') ? 'png' : originalType.includes('webp') ? 'webp' : 'jpg',
      };
    }

    return {
      buffer: compressedBuffer,
      extension,
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    return {
      buffer,
      extension: originalType.includes('png') ? 'png' : originalType.includes('webp') ? 'webp' : 'jpg',
    };
  }
}

async function processNewGalleryImages() {
  console.log('📸 Processing new gallery images...\n');

  try {
    // Source folder
    const sourceFolder = path.join(process.cwd(), 'NewGalleryAdditions');
    const gallerySlug = 'new-additions-january-2026';
    const targetFolder = path.join(process.cwd(), 'public', 'images', 'galleries', gallerySlug);

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
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    console.log(`📁 Found ${imageFiles.length} images in NewGalleryAdditions\n`);

    if (imageFiles.length === 0) {
      console.log('⚠️  No images found to process.');
      return;
    }

    // Process and copy images with compression
    const processedImages = [];
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    for (const file of imageFiles) {
      const sourcePath = path.join(sourceFolder, file);
      const fileExt = path.extname(file).toLowerCase();
      const baseName = path.basename(file, fileExt);
      
      // Read original file
      const originalBuffer = fs.readFileSync(sourcePath);
      totalOriginalSize += originalBuffer.length;

      // Determine MIME type
      let mimeType = 'image/jpeg';
      if (fileExt === '.png') mimeType = 'image/png';
      else if (fileExt === '.webp') mimeType = 'image/webp';
      else if (fileExt === '.gif') mimeType = 'image/gif';

      // Compress image
      const { buffer: compressedBuffer, extension } = await compressImage(
        originalBuffer,
        mimeType,
        {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 85,
        }
      );

      totalCompressedSize += compressedBuffer.length;

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const newFilename = `${timestamp}-${randomString}-${baseName}.${extension}`;
      const targetPath = path.join(targetFolder, newFilename);

      // Write compressed image
      fs.writeFileSync(targetPath, compressedBuffer);
      
      const publicPath = `/images/galleries/${gallerySlug}/${newFilename}`;
      processedImages.push(publicPath);

      const savings = originalBuffer.length - compressedBuffer.length;
      const savingsPercent = ((savings / originalBuffer.length) * 100).toFixed(1);
      console.log(`✅ Processed: ${file} → ${newFilename} (${(originalBuffer.length / 1024).toFixed(1)}KB → ${(compressedBuffer.length / 1024).toFixed(1)}KB, ${savingsPercent}% saved)`);
    }

    console.log(`\n✅ Processed ${processedImages.length} images`);
    const totalSavings = totalOriginalSize - totalCompressedSize;
    const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
    console.log(`📊 Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalCompressedSize / 1024 / 1024).toFixed(2)}MB (${totalSavingsPercent}% saved)\n`);

    // Check if gallery already exists
    let existingGallery = await prisma.gallery.findUnique({
      where: { slug: gallerySlug }
    });

    if (existingGallery) {
      // Update existing gallery - add new images to existing ones
      console.log('📝 Gallery exists, updating with new images...');
      
      const existingImages = existingGallery.images || [];
      const newImages = [...new Set([...existingImages, ...processedImages])]; // Remove duplicates
      
      await prisma.gallery.update({
        where: { id: existingGallery.id },
        data: {
          images: newImages,
          featuredImage: existingGallery.featuredImage || processedImages[0] || null,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Updated gallery "${existingGallery.title}"`);
      console.log(`   Total images: ${newImages.length} (added ${processedImages.length} new)`);
    } else {
      // Create new gallery
      console.log('📝 Creating new gallery...');
      
      const gallery = await prisma.gallery.create({
        data: {
          title: 'New Additions January 2026',
          slug: gallerySlug,
          description: 'New photos added to our gallery collection in January 2026',
          tourName: '2026 Tours Collection',
          images: processedImages,
          featuredImage: processedImages[0] || null,
          featured: true,
          published: true,
        },
      });

      console.log(`✅ Created new gallery: "${gallery.title}"`);
      console.log(`   Images added: ${processedImages.length}`);
    }

    console.log('\n🎉 Successfully processed and added images to gallery!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Images processed: ${processedImages.length}`);
    console.log(`   - Gallery folder: public/images/galleries/${gallerySlug}/`);
    console.log(`   - Gallery slug: ${gallerySlug}`);
    console.log(`   - Total compression: ${totalSavingsPercent}%`);

  } catch (error) {
    console.error('❌ Error processing gallery images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

processNewGalleryImages()
  .then(() => {
    console.log('\n✅ Process complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  });
