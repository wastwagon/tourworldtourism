#!/usr/bin/env node
/**
 * Ultimate JSON repair and import script
 * Handles various JSON malformations
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

function repairJSON(content) {
  // Step 1: Remove ALL control characters except newlines and tabs (we'll handle those separately)
  content = content.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Step 2: Remove trailing commas
  content = content.replace(/,\s*}/g, '}');
  content = content.replace(/,\s*]/g, ']');
  
  // Step 3: Fix unescaped newlines in string values
  // This is tricky - we need to find strings and escape newlines inside them
  // But we can't use regex for this reliably, so we'll parse character by character
  
  // Step 4: Try to fix common issues
  // Fix double quotes that might be breaking strings
  // But be careful not to break valid JSON
  
  return content;
}

async function importData() {
  console.log('📦 Reading export file...');
  
  let fileContent;
  try {
    fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
  } catch (error) {
    console.error('❌ Cannot read file:', error.message);
    process.exit(1);
  }
  
  console.log(`📄 File size: ${fileContent.length} characters`);
  
  // Try multiple repair strategies
  let exportData;
  let attempts = [
    {
      name: 'Basic cleaning',
      fn: (c) => {
        c = c.replace(/[\x00-\x1F\x7F]/g, '');
        c = c.replace(/,\s*}/g, '}');
        c = c.replace(/,\s*]/g, ']');
        return c;
      }
    },
    {
      name: 'With newline handling',
      fn: (c) => {
        c = c.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
        // Replace actual newlines in string values with escaped newlines
        // This is a heuristic - look for newlines that aren't part of JSON structure
        c = c.replace(/([^\\])\n([^"\\])/g, '$1\\n$2');
        c = c.replace(/,\s*}/g, '}');
        c = c.replace(/,\s*]/g, ']');
        return c;
      }
    },
    {
      name: 'Aggressive repair',
      fn: (c) => {
        // Remove all control chars
        c = c.replace(/[\x00-\x1F\x7F]/g, '');
        // Remove trailing commas
        c = c.replace(/,\s*}/g, '}');
        c = c.replace(/,\s*]/g, ']');
        // Try to fix unescaped quotes in strings (heuristic)
        // Look for patterns like "text"text" and fix them
        c = c.replace(/("(?:[^"\\]|\\.)*)"([^",}\]]+)"([^",}\]]*")/g, '$1\\"$2\\"$3');
        return c;
      }
    }
  ];
  
  for (const attempt of attempts) {
    console.log(`\n🔧 Trying: ${attempt.name}...`);
    try {
      const repaired = attempt.fn(fileContent);
      exportData = JSON.parse(repaired);
      console.log(`✅ Success with ${attempt.name}!`);
      break;
    } catch (error) {
      console.log(`❌ ${attempt.name} failed: ${error.message}`);
      if (error.message.includes('position')) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const pos = parseInt(match[1]);
          const start = Math.max(0, pos - 100);
          const end = Math.min(repaired.length, pos + 100);
          console.log(`   Context: ${repaired.substring(start, end)}`);
        }
      }
    }
  }
  
  if (!exportData) {
    console.error('\n❌ All repair attempts failed!');
    console.error('💡 The JSON file may be too corrupted.');
    console.error('💡 Recommendation: Regenerate the export file locally.');
    process.exit(1);
  }
  
  console.log(`\n✅ JSON parsed successfully!`);
  console.log(`📅 Export date: ${exportData.exportedAt}\n`);

  let imported = 0;
  let errors = 0;

  // Import Tours
  if (exportData.data.tours) {
    console.log(`📊 Importing ${exportData.data.tours.length} tours...`);
    for (const t of exportData.data.tours) {
      try {
        const {id,...x}=t;
        await prisma.tour.upsert({where:{slug:t.slug},update:x,create:x});
        imported++;
      } catch(e){
        console.error(`Tour ${t.slug}:`,e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} tours imported${errors>0?` (${errors} errors)`:''}\n`);
    imported=0;errors=0;
  }

  // Import Hotels
  if (exportData.data.hotels) {
    console.log(`📊 Importing ${exportData.data.hotels.length} hotels...`);
    for (const h of exportData.data.hotels) {
      try {
        const {id,...x}=h;
        await prisma.hotel.upsert({where:{id:h.id},update:x,create:x});
        imported++;
      } catch(e){
        console.error(`Hotel ${h.name}:`,e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} hotels imported${errors>0?` (${errors} errors)`:''}\n`);
    imported=0;errors=0;
  }

  // Import Attractions
  if (exportData.data.attractions) {
    console.log(`📊 Importing ${exportData.data.attractions.length} attractions...`);
    for (const a of exportData.data.attractions) {
      try {
        const {id,...x}=a;
        await prisma.attraction.upsert({where:{id:a.id},update:x,create:x});
        imported++;
      } catch(e){
        console.error(`Attraction ${a.name}:`,e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} attractions imported${errors>0?` (${errors} errors)`:''}\n`);
    imported=0;errors=0;
  }

  // Import Blogs
  if (exportData.data.blogs) {
    console.log(`📊 Importing ${exportData.data.blogs.length} blogs...`);
    for (const b of exportData.data.blogs) {
      try {
        const {id,...x}=b;
        await prisma.blog.upsert({where:{slug:b.slug},update:x,create:x});
        imported++;
      } catch(e){
        console.error(`Blog ${b.slug}:`,e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} blogs imported${errors>0?` (${errors} errors)`:''}\n`);
    imported=0;errors=0;
  }

  // Import Galleries
  if (exportData.data.galleries) {
    console.log(`📊 Importing ${exportData.data.galleries.length} galleries...`);
    for (const g of exportData.data.galleries) {
      try {
        const {id,...x}=g;
        await prisma.gallery.upsert({where:{slug:g.slug},update:x,create:x});
        imported++;
      } catch(e){
        console.error(`Gallery ${g.slug}:`,e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} galleries imported${errors>0?` (${errors} errors)`:''}\n`);
    imported=0;errors=0;
  }

  // Import Testimonials
  if (exportData.data.testimonials) {
    console.log(`📊 Importing ${exportData.data.testimonials.length} testimonials...`);
    for (const t of exportData.data.testimonials) {
      try {
        const {id,...x}=t;
        await prisma.testimonial.create({data:x});
        imported++;
      } catch(e){
        console.error('Testimonial:',e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} testimonials imported${errors>0?` (${errors} errors)`:''}\n`);
    imported=0;errors=0;
  }

  // Import Bookings
  if (exportData.data.bookings) {
    console.log(`📊 Importing ${exportData.data.bookings.length} bookings...`);
    for (const b of exportData.data.bookings) {
      try {
        const {id,...x}=b;
        await prisma.booking.create({data:x});
        imported++;
      } catch(e){
        console.error('Booking:',e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} bookings imported${errors>0?` (${errors} errors)`:''}\n`);
    imported=0;errors=0;
  }

  // Import Contact Inquiries
  if (exportData.data.contactInquiries) {
    console.log(`📊 Importing ${exportData.data.contactInquiries.length} contact inquiries...`);
    for (const c of exportData.data.contactInquiries) {
      try {
        const {id,...x}=c;
        await prisma.contactInquiry.create({data:x});
        imported++;
      } catch(e){
        console.error('Contact:',e.message);
        errors++;
      }
    }
    console.log(`✅ ${imported} contacts imported${errors>0?` (${errors} errors)`:''}\n`);
  }

  console.log('✨ Import completed!');
  await prisma.$disconnect();
}

importData().catch(e=>{
  console.error('Fatal:',e.message);
  console.error(e.stack);
  process.exit(1);
});

