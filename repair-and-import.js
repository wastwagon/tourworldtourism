#!/usr/bin/env node
/**
 * Repair JSON structure issues and import
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function repairAndImport() {
  console.log('📦 Reading export file...');
  
  try {
    let fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
    
    // Step 1: Remove ALL control characters
    fileContent = fileContent.replace(/[\x00-\x1F\x7F]/g, '');
    
    // Step 2: Fix common JSON structure issues
    // Remove trailing commas before } or ]
    fileContent = fileContent.replace(/,\s*}/g, '}');
    fileContent = fileContent.replace(/,\s*]/g, ']');
    
    // Step 3: Try to fix unclosed strings or other issues
    // Look for patterns like "key": "value" where value might be malformed
    
    console.log('🔧 Attempting to repair JSON structure...');
    
    let exportData;
    try {
      exportData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      
      // Try to find and fix the specific issue
      const errorMatch = parseError.message.match(/position (\d+)/);
      if (errorMatch) {
        const pos = parseInt(errorMatch[1]);
        console.log(`📍 Error at position ${pos}`);
        
        // Show context
        const start = Math.max(0, pos - 200);
        const end = Math.min(fileContent.length, pos + 200);
        const context = fileContent.substring(start, end);
        console.log('Context:', context);
        
        // Try to fix common issues at that position
        // If it's a missing comma, try adding one
        // If it's an unclosed string, try to close it
        
        // For now, let's try a different approach - use a JSON repair library approach
        // Or try to parse in chunks
        
        console.log('💡 Trying to fix the issue...');
        
        // Try to escape any unescaped quotes in string values
        // This is tricky - we need to be careful
        
        // Alternative: Try to find the problematic area and fix it manually
        // Or use eval with careful handling (not recommended but might work)
        
        throw new Error('JSON structure is too corrupted. Please regenerate the export file.');
      }
      
      throw parseError;
    }
    
    console.log('✅ JSON parsed successfully\n');
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

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error('💡 The JSON file may be too corrupted.');
    console.error('💡 Recommendation: Regenerate the export file locally and upload again.');
    await prisma.$disconnect();
    process.exit(1);
  }
}

repairAndImport();

