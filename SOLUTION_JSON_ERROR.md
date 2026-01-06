# Solution for JSON Parsing Error

The JSON file got corrupted during copy-paste to Coolify. Here are solutions:

## Option 1: Use the Base64 File (Recommended)

The `local-db-export-base64.txt` file was created earlier. Use this instead:

```bash
# In Coolify Terminal
base64 -d local-db-export-base64.txt > local-db-export-final.json

# Then run the import
node clean-and-import.js
```

## Option 2: Regenerate Export File Locally

If the base64 file isn't available, regenerate the export:

```bash
# On your local machine
npm run db:export > local-db-export-final.json

# Then copy it to Coolify using a different method
# Or use the base64 encoding method from HOW_TO_COPY_EXPORT_FILE.md
```

## Option 3: Use This Enhanced Repair Script

Copy this script to Coolify Terminal:

```bash
cat > fix-and-import.js << 'SCRIPTEOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function fixAndImport() {
  console.log('📦 Reading export file...');
  let fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
  
  // Remove control characters
  fileContent = fileContent.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Fix trailing commas
  fileContent = fileContent.replace(/,\s*}/g, '}');
  fileContent = fileContent.replace(/,\s*]/g, ']');
  
  // Fix unescaped newlines in strings - look for pattern: "text\nmore" where \n is actual newline
  fileContent = fileContent.replace(/([^\\])"([^"]*)\n([^"]*)"([^",}\]]*)/g, '$1"$2\\n$3"$4');
  
  // Try to fix unclosed strings by finding patterns like: "id": "value\n (without closing quote)
  // This is a heuristic - look for strings that end with newline before next property
  fileContent = fileContent.replace(/"([^"]+)":\s*"([^"]*)\n\s*"([^"]+)":/g, '"$1": "$2\\n", "$3":');
  
  console.log('🧹 Attempting to repair JSON...');
  
  let exportData;
  try {
    exportData = JSON.parse(fileContent);
  } catch (error) {
    console.error('❌ JSON parse failed:', error.message);
    if (error.message.includes('position')) {
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        const start = Math.max(0, pos - 200);
        const end = Math.min(fileContent.length, pos + 200);
        console.log('\nContext around error:');
        console.log(fileContent.substring(start, end));
        console.log('\n💡 The file appears corrupted. Try Option 1 or 2 above.');
      }
    }
    process.exit(1);
  }
  
  console.log('✅ JSON parsed successfully!\n');

  let imported = 0;

  // Import Tours
  if (exportData.data.tours) {
    console.log(`📊 Importing ${exportData.data.tours.length} tours...`);
    for (const t of exportData.data.tours) {
      try {
        const {id,...x}=t;
        await prisma.tour.upsert({where:{slug:t.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Tour ${t.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} tours imported\n`);
    imported=0;
  }

  // Import Hotels
  if (exportData.data.hotels) {
    console.log(`📊 Importing ${exportData.data.hotels.length} hotels...`);
    for (const h of exportData.data.hotels) {
      try {
        const {id,...x}=h;
        await prisma.hotel.upsert({where:{id:h.id},update:x,create:x});
        imported++;
      } catch(e){console.error(`Hotel ${h.name}:`,e.message);}
    }
    console.log(`✅ ${imported} hotels imported\n`);
    imported=0;
  }

  // Import Attractions
  if (exportData.data.attractions) {
    console.log(`📊 Importing ${exportData.data.attractions.length} attractions...`);
    for (const a of exportData.data.attractions) {
      try {
        const {id,...x}=a;
        await prisma.attraction.upsert({where:{id:a.id},update:x,create:x});
        imported++;
      } catch(e){console.error(`Attraction ${a.name}:`,e.message);}
    }
    console.log(`✅ ${imported} attractions imported\n`);
    imported=0;
  }

  // Import Blogs
  if (exportData.data.blogs) {
    console.log(`📊 Importing ${exportData.data.blogs.length} blogs...`);
    for (const b of exportData.data.blogs) {
      try {
        const {id,...x}=b;
        await prisma.blog.upsert({where:{slug:b.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Blog ${b.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} blogs imported\n`);
    imported=0;
  }

  // Import Galleries
  if (exportData.data.galleries) {
    console.log(`📊 Importing ${exportData.data.galleries.length} galleries...`);
    for (const g of exportData.data.galleries) {
      try {
        const {id,...x}=g;
        await prisma.gallery.upsert({where:{slug:g.slug},update:x,create:x});
        imported++;
      } catch(e){console.error(`Gallery ${g.slug}:`,e.message);}
    }
    console.log(`✅ ${imported} galleries imported\n`);
    imported=0;
  }

  // Import Testimonials
  if (exportData.data.testimonials) {
    console.log(`📊 Importing ${exportData.data.testimonials.length} testimonials...`);
    for (const t of exportData.data.testimonials) {
      try {
        const {id,...x}=t;
        await prisma.testimonial.create({data:x});
        imported++;
      } catch(e){console.error('Testimonial:',e.message);}
    }
    console.log(`✅ ${imported} testimonials imported\n`);
    imported=0;
  }

  // Import Bookings
  if (exportData.data.bookings) {
    console.log(`📊 Importing ${exportData.data.bookings.length} bookings...`);
    for (const b of exportData.data.bookings) {
      try {
        const {id,...x}=b;
        await prisma.booking.create({data:x});
        imported++;
      } catch(e){console.error('Booking:',e.message);}
    }
    console.log(`✅ ${imported} bookings imported\n`);
    imported=0;
  }

  // Import Contact Inquiries
  if (exportData.data.contactInquiries) {
    console.log(`📊 Importing ${exportData.data.contactInquiries.length} contact inquiries...`);
    for (const c of exportData.data.contactInquiries) {
      try {
        const {id,...x}=c;
        await prisma.contactInquiry.create({data:x});
        imported++;
      } catch(e){console.error('Contact:',e.message);}
    }
    console.log(`✅ ${imported} contacts imported\n`);
  }

  console.log('✨ Import completed successfully!');
  await prisma.$disconnect();
}

fixAndImport().catch(e=>{console.error('Fatal:',e.message);process.exit(1);});
SCRIPTEOF

node fix-and-import.js
```

## Option 4: Check if Base64 File Exists

First, check if the base64 file is available:

```bash
# In Coolify Terminal
ls -la local-db-export-base64.txt
```

If it exists, use Option 1. If not, regenerate locally and use base64 encoding.

