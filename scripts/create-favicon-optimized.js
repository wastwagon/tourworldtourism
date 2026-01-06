const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicon() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  
  try {
    // Get logo dimensions
    const metadata = await sharp(logoPath).metadata();
    const { width, height } = metadata;
    
    // For favicons, we want the logo to fill more of the space
    // Scale to a reasonable square size (e.g., 512x512) while maintaining aspect ratio
    const targetSquareSize = 512;
    const scale = Math.min(targetSquareSize / width, targetSquareSize / height);
    const scaledWidth = Math.round(width * scale);
    const scaledHeight = Math.round(height * scale);
    
    // Create square canvas with centered logo
    const squarePath = path.join(__dirname, '../public/logo-square-optimized.png');
    const padding = {
      top: Math.floor((targetSquareSize - scaledHeight) / 2),
      left: Math.floor((targetSquareSize - scaledWidth) / 2),
    };
    
    // First resize the logo
    const resizedLogo = await sharp(logoPath)
      .resize(scaledWidth, scaledHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();
    
    // Then composite onto square canvas with transparent background
    await sharp({
      create: {
        width: targetSquareSize,
        height: targetSquareSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
    .composite([{
      input: resizedLogo,
      top: padding.top,
      left: padding.left,
    }])
    .png()
    .toFile(squarePath);
    
    console.log(`Created optimized square logo: ${targetSquareSize}x${targetSquareSize}`);
    
    // Create favicon sizes with better quality
    const sizes = [
      { size: 16, name: 'favicon-16.png' },
      { size: 32, name: 'icon.png' },
      { size: 48, name: 'favicon-48.png' },
      { size: 180, name: 'apple-icon.png' },
    ];
    
    for (const { size: favSize, name } of sizes) {
      const outputPath = path.join(__dirname, '../app', name);
      await sharp(squarePath)
        .resize(favSize, favSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outputPath);
      console.log(`Created ${name}: ${favSize}x${favSize}`);
    }
    
    // Create favicon.ico (32x32)
    const faviconPath = path.join(__dirname, '../app/favicon.ico');
    await sharp(squarePath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('All favicon files created successfully!');
  } catch (error) {
    console.error('Error creating favicon:', error);
    process.exit(1);
  }
}

createFavicon();

