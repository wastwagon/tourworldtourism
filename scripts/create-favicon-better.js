const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicon() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  
  try {
    // Get logo dimensions
    const metadata = await sharp(logoPath).metadata();
    const { width, height } = metadata;
    
    // Create square canvas with padding (white background)
    const size = Math.max(width, height);
    const padding = {
      top: Math.floor((size - height) / 2),
      left: Math.floor((size - width) / 2),
      bottom: Math.ceil((size - height) / 2),
      right: Math.ceil((size - width) / 2),
    };
    
    // Create square version with padding (preserving full logo)
    const squarePath = path.join(__dirname, '../public/logo-square-padded.png');
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
    .composite([{
      input: logoPath,
      top: padding.top,
      left: padding.left,
    }])
    .png()
    .toFile(squarePath);
    
    console.log(`Created square logo: ${size}x${size} with padding`);
    
    // Create favicon sizes
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
        .png()
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

