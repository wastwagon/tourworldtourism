const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicon() {
  const logoPath = path.join(__dirname, '../public/logo-square.png');
  const outputPath = path.join(__dirname, '../app/favicon.ico');
  
  try {
    // Create favicon.ico with multiple sizes
    // Note: sharp doesn't directly create .ico files, so we'll create a 32x32 PNG
    // and rename it. For a proper .ico, we'd need a different library.
    // However, modern browsers accept PNG files named favicon.ico
    
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(outputPath);
    
    console.log('Favicon created successfully!');
  } catch (error) {
    console.error('Error creating favicon:', error);
    process.exit(1);
  }
}

createFavicon();

