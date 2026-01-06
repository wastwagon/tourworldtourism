#!/usr/bin/env node
/**
 * Fix unclosed strings and other JSON issues
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

function repairJSON(content) {
  // Step 1: Remove control characters
  content = content.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Step 2: Fix trailing commas
  content = content.replace(/,\s*}/g, '}');
  content = content.replace(/,\s*]/g, ']');
  
  // Step 3: Fix unclosed strings by finding patterns and closing them
  // Look for: "key": "value that's not closed
  // Pattern: "id": "value without closing quote before next key
  
  // This is complex - we'll use a state machine approach
  let result = '';
  let inString = false;
  let escapeNext = false;
  let lastChar = '';
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = i < content.length - 1 ? content[i + 1] : '';
    
    if (escapeNext) {
      result += char;
      escapeNext = false;
      lastChar = char;
      continue;
    }
    
    if (char === '\\') {
      result += char;
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      // Check if this looks like the start of a key (has : after)
      const lookAhead = content.substring(i, Math.min(i + 50, content.length));
      if (lookAhead.match(/^"[^"]*"\s*:/)) {
        // This is a key, not a value
        result += char;
        inString = false;
      } else {
        // Toggle string state
        inString = !inString;
        result += char;
      }
    } else if (inString && (char === '\n' || char === '\r')) {
      // Unescaped newline in string - escape it
      result += '\\n';
    } else if (inString && i > 0 && lastChar !== '\\' && char === '"' && nextChar.match(/[^,}\]:]/)) {
      // This might be an unescaped quote - but we're already handling quotes above
      result += '\\"';
    } else {
      result += char;
    }
    
    lastChar = char;
  }
  
  // Step 4: Try to fix common patterns of unclosed strings
  // Look for: "id": "value\n (newline without closing quote)
  result = result.replace(/"([^"]+)":\s*"([^"]*)\n([^"]*)"([^",}\]]*)/g, (match, key, val1, val2, rest) => {
    // If val2 doesn't start with a quote, the string wasn't closed
    if (!val2.startsWith('"')) {
      return `"${key}": "${val1}\\n${val2}"${rest}`;
    }
    return match;
  });
  
  return result;
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
  
  // Try parsing with different repair strategies
  let exportData;
  const strategies = [
    {
      name: 'Simple cleaning',
      fn: (c) => {
        c = c.replace(/[\x00-\x1F\x7F]/g, '');
        c = c.replace(/,\s*}/g, '}');
        c = c.replace(/,\s*]/g, ']');
        return c;
      }
    },
    {
      name: 'With newline escaping',
      fn: (c) => {
        c = c.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
        // Escape newlines that appear to be in string values
        // Look for pattern: "text\nmore text" where \n is actual newline
        c = c.replace(/([^\\])"([^"]*)\n([^"]*)"([^",}\]]*)/g, '$1"$2\\n$3"$4');
        c = c.replace(/,\s*}/g, '}');
        c = c.replace(/,\s*]/g, ']');
        return c;
      }
    },
    {
      name: 'Advanced repair',
      fn: repairJSON
    }
  ];
  
  for (const strategy of strategies) {
    console.log(`\n🔧 Trying: ${strategy.name}...`);
    try {
      const repaired = strategy.fn(fileContent);
      exportData = JSON.parse(repaired);
      console.log(`✅ Success with ${strategy.name}!`);
      break;
    } catch (error) {
      console.log(`❌ ${strategy.name} failed: ${error.message}`);
      if (error.message.includes('position')) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const pos = parseInt(match[1]);
          const repaired = strategy.fn(fileContent);
          const start = Math.max(0, pos - 150);
          const end = Math.min(repaired.length, pos + 150);
          console.log(`   Context around error:`);
          console.log(`   ${repaired.substring(start, end)}`);
        }
      }
    }
  }
  
  if (!exportData) {
    console.error('\n❌ All repair strategies failed!');
    console.error('\n💡 The JSON file appears to be corrupted.');
    console.error('💡 This likely happened during copy-paste to Coolify.');
    console.error('\n💡 Solutions:');
    console.error('   1. Regenerate the export file locally');
    console.error('   2. Use base64 encoding to transfer (see HOW_TO_COPY_EXPORT_FILE.md)');
    console.error('   3. Or manually fix the JSON structure');
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
  process.exit(1);
});

