#!/usr/bin/env node
/**
 * Fix JSON escaping issues and import
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function fixAndImport() {
  console.log('📦 Reading export file...');
  
  try {
    let fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
    
    // First, try to fix JSON by properly escaping control characters in strings
    // This is a more sophisticated approach - we'll try to fix the JSON structure
    
    console.log('🔧 Attempting to fix JSON structure...');
    
    // Method 1: Remove all control characters except \n, \r, \t
    fileContent = fileContent.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    
    // Method 2: Try to fix unescaped characters in string values
    // Replace unescaped newlines, tabs, etc. in string values with escaped versions
    // This is tricky - we need to be careful not to break the JSON structure
    
    // Try parsing
    let exportData;
    try {
      exportData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError.message);
      
      // Try a different approach - use eval with careful sanitization
      // Actually, better to try fixing the specific issue
      console.log('💡 Trying alternative parsing method...');
      
      // Remove the problematic character area and try again
      // Find the error position and fix it
      const errorPos = 166433;
      const before = fileContent.substring(0, errorPos);
      const after = fileContent.substring(errorPos);
      
      // Try to find and fix the issue - look for unescaped control chars in strings
      // Replace any unescaped newlines/tabs in string values
      let fixed = fileContent;
      
      // Use a regex to find string values and clean them
      // Match: "key": "value" where value might have control chars
      fixed = fixed.replace(/"([^"]*)":\s*"([^"]*)"/g, (match, key, value) => {
        // Clean the value
        const cleaned = value.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
        return `"${key}": "${cleaned}"`;
      });
      
      // But this won't work for multi-line strings...
      // Better approach: use a JSON repair library approach
      // For now, let's try the simplest fix - just remove ALL control chars
      fixed = fileContent.replace(/[\x00-\x1F\x7F]/g, '');
      
      try {
        exportData = JSON.parse(fixed);
        console.log('✅ Fixed and parsed successfully');
      } catch (e2) {
        console.error('❌ Still failing. The file may be too corrupted.');
        console.error('💡 Recommendation: Regenerate the export file locally and upload again.');
        throw e2;
      }
    }
    
    console.log('✅ JSON parsed successfully\n');
    console.log(`📅 Export date: ${exportData.exportedAt}\n`);

    // Import data (same as before)
    let imported = 0;

    // Tours
    if (exportData.data.tours) {
      console.log(`📊 Importing ${exportData.data.tours.length} tours...`);
      for (const t of exportData.data.tours) {
        try {
          const {id,...x}=t;
          await prisma.tour.upsert({where:{slug:t.slug},update:x,create:x});
          imported++;
        } catch(e){console.error('Tour:',t.slug,e.message);}
      }
      console.log(`✅ ${imported} tours imported\n`);
      imported=0;
    }

    // Hotels
    if (exportData.data.hotels) {
      console.log(`📊 Importing ${exportData.data.hotels.length} hotels...`);
      for (const h of exportData.data.hotels) {
        try {
          const {id,...x}=h;
          await prisma.hotel.upsert({where:{id:h.id},update:x,create:x});
          imported++;
        } catch(e){console.error('Hotel:',h.name,e.message);}
      }
      console.log(`✅ ${imported} hotels imported\n`);
      imported=0;
    }

    // Attractions
    if (exportData.data.attractions) {
      console.log(`📊 Importing ${exportData.data.attractions.length} attractions...`);
      for (const a of exportData.data.attractions) {
        try {
          const {id,...x}=a;
          await prisma.attraction.upsert({where:{id:a.id},update:x,create:x});
          imported++;
        } catch(e){console.error('Attraction:',a.name,e.message);}
      }
      console.log(`✅ ${imported} attractions imported\n`);
      imported=0;
    }

    // Blogs
    if (exportData.data.blogs) {
      console.log(`📊 Importing ${exportData.data.blogs.length} blogs...`);
      for (const b of exportData.data.blogs) {
        try {
          const {id,...x}=b;
          await prisma.blog.upsert({where:{slug:b.slug},update:x,create:x});
          imported++;
        } catch(e){console.error('Blog:',b.slug,e.message);}
      }
      console.log(`✅ ${imported} blogs imported\n`);
      imported=0;
    }

    // Galleries
    if (exportData.data.galleries) {
      console.log(`📊 Importing ${exportData.data.galleries.length} galleries...`);
      for (const g of exportData.data.galleries) {
        try {
          const {id,...x}=g;
          await prisma.gallery.upsert({where:{slug:g.slug},update:x,create:x});
          imported++;
        } catch(e){console.error('Gallery:',g.slug,e.message);}
      }
      console.log(`✅ ${imported} galleries imported\n`);
      imported=0;
    }

    // Testimonials
    if (exportData.data.testimonials) {
      console.log(`📊 Importing ${exportData.data.testimonials.length} testimonials...`);
      for (const t of exportData.data.testimonials) {
        try {
          const {id,...x}=t;
          await prisma.testimonial.create({data:x});
          imported++;
        } catch(e){console.error('Testimonial error:',e.message);}
      }
      console.log(`✅ ${imported} testimonials imported\n`);
      imported=0;
    }

    // Bookings
    if (exportData.data.bookings) {
      console.log(`📊 Importing ${exportData.data.bookings.length} bookings...`);
      for (const b of exportData.data.bookings) {
        try {
          const {id,...x}=b;
          await prisma.booking.create({data:x});
          imported++;
        } catch(e){console.error('Booking error:',e.message);}
      }
      console.log(`✅ ${imported} bookings imported\n`);
      imported=0;
    }

    // Contact Inquiries
    if (exportData.data.contactInquiries) {
      console.log(`📊 Importing ${exportData.data.contactInquiries.length} contact inquiries...`);
      for (const c of exportData.data.contactInquiries) {
        try {
          const {id,...x}=c;
          await prisma.contactInquiry.create({data:x});
          imported++;
        } catch(e){console.error('Contact error:',e.message);}
      }
      console.log(`✅ ${imported} contacts imported\n`);
    }

    console.log('✨ Import completed!');
    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixAndImport();

