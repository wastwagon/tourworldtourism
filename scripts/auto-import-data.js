#!/usr/bin/env node
/**
 * Auto-import data on first startup if database is empty
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function autoImport() {
  try {
    // Check if database has any tours
    const tourCount = await prisma.tour.count();
    
    if (tourCount > 0) {
      console.log('✅ Database already has data, skipping import');
      await prisma.$disconnect();
      return;
    }
    
    console.log('📦 Database is empty, checking for data file...');
    
    // Look for JSON export file
    const jsonFile = path.join(__dirname, '..', 'local-db-export-final.json');
    
    if (!fs.existsSync(jsonFile)) {
      console.log('⚠️  No data file found, database will remain empty');
      console.log('💡 To import data, place local-db-export-final.json in the project root');
      await prisma.$disconnect();
      return;
    }
    
    console.log('📥 Importing data from JSON file...');
    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    
    let imported = 0;
    
    // Import Tours
    if (data.data.tours) {
      for (const t of data.data.tours) {
        const {id, ...x} = t;
        try {
          await prisma.tour.upsert({where:{slug:t.slug},update:x,create:x});
          imported++;
        } catch(e){console.error(`Tour ${t.slug}:`,e.message);}
      }
    }
    
    // Import Hotels
    if (data.data.hotels) {
      for (const h of data.data.hotels) {
        const {id, ...x} = h;
        try {
          await prisma.hotel.upsert({where:{id:h.id},update:x,create:x});
          imported++;
        } catch(e){console.error(`Hotel ${h.name}:`,e.message);}
      }
    }
    
    // Import Attractions
    if (data.data.attractions) {
      for (const a of data.data.attractions) {
        const {id, ...x} = a;
        try {
          await prisma.attraction.upsert({where:{id:a.id},update:x,create:x});
          imported++;
        } catch(e){console.error(`Attraction ${a.name}:`,e.message);}
      }
    }
    
    // Import Blogs
    if (data.data.blogs) {
      for (const b of data.data.blogs) {
        const {id, ...x} = b;
        try {
          await prisma.blog.upsert({where:{slug:b.slug},update:x,create:x});
          imported++;
        } catch(e){console.error(`Blog ${b.slug}:`,e.message);}
      }
    }
    
    // Import Galleries
    if (data.data.galleries) {
      for (const g of data.data.galleries) {
        const {id, ...x} = g;
        try {
          await prisma.gallery.upsert({where:{slug:g.slug},update:x,create:x});
          imported++;
        } catch(e){console.error(`Gallery ${g.slug}:`,e.message);}
      }
    }
    
    // Import Testimonials
    if (data.data.testimonials) {
      for (const t of data.data.testimonials) {
        const {id, ...x} = t;
        try {
          await prisma.testimonial.create({data:x});
          imported++;
        } catch(e){console.error('Testimonial:',e.message);}
      }
    }
    
    // Import Bookings
    if (data.data.bookings) {
      for (const b of data.data.bookings) {
        const {id, ...x} = b;
        try {
          await prisma.booking.create({data:x});
          imported++;
        } catch(e){console.error('Booking:',e.message);}
      }
    }
    
    // Import Contact Inquiries
    if (data.data.contactInquiries) {
      for (const c of data.data.contactInquiries) {
        const {id, ...x} = c;
        try {
          await prisma.contactInquiry.create({data:x});
          imported++;
        } catch(e){console.error('Contact:',e.message);}
      }
    }
    
    console.log(`✅ Imported ${imported} records`);
    
    // Verify
    const [tours, hotels, galleries] = await Promise.all([
      prisma.tour.count(),
      prisma.hotel.count(),
      prisma.gallery.count(),
    ]);
    console.log(`📊 Database now has: ${tours} tours, ${hotels} hotels, ${galleries} galleries`);
    
  } catch (error) {
    console.error('⚠️  Auto-import failed:', error.message);
    // Don't fail startup if import fails
  } finally {
    await prisma.$disconnect();
  }
}

autoImport();

