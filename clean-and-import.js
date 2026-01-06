#!/usr/bin/env node
/**
 * Clean JSON file and import to database
 * This handles control characters and other JSON issues
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function cleanAndImport() {
  console.log('📦 Reading and cleaning export file...');
  
  try {
    // Read file and clean control characters
    let fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
    
    // Remove control characters except newlines, tabs, and carriage returns
    fileContent = fileContent.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    
    // Parse JSON
    const exportData = JSON.parse(fileContent);
    
    console.log(`✅ File cleaned and parsed`);
    console.log(`📅 Export date: ${exportData.exportedAt}`);
    console.log(`📊 Source: ${exportData.source}\n`);

    let importedCount = 0;

    // Import Tours
    if (exportData.data.tours && exportData.data.tours.length > 0) {
      console.log(`📊 Importing ${exportData.data.tours.length} tours...`);
      for (const tour of exportData.data.tours) {
        try {
          const { id, ...tourData } = tour;
          await prisma.tour.upsert({
            where: { slug: tour.slug },
            update: tourData,
            create: tourData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing tour ${tour.slug}:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} tours\n`);
      importedCount = 0;
    }

    // Import Hotels
    if (exportData.data.hotels && exportData.data.hotels.length > 0) {
      console.log(`📊 Importing ${exportData.data.hotels.length} hotels...`);
      for (const hotel of exportData.data.hotels) {
        try {
          const { id, ...hotelData } = hotel;
          await prisma.hotel.upsert({
            where: { id: hotel.id },
            update: hotelData,
            create: hotelData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing hotel ${hotel.name}:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} hotels\n`);
      importedCount = 0;
    }

    // Import Attractions
    if (exportData.data.attractions && exportData.data.attractions.length > 0) {
      console.log(`📊 Importing ${exportData.data.attractions.length} attractions...`);
      for (const attraction of exportData.data.attractions) {
        try {
          const { id, ...attractionData } = attraction;
          await prisma.attraction.upsert({
            where: { id: attraction.id },
            update: attractionData,
            create: attractionData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing attraction ${attraction.name}:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} attractions\n`);
      importedCount = 0;
    }

    // Import Blogs
    if (exportData.data.blogs && exportData.data.blogs.length > 0) {
      console.log(`📊 Importing ${exportData.data.blogs.length} blogs...`);
      for (const blog of exportData.data.blogs) {
        try {
          const { id, ...blogData } = blog;
          await prisma.blog.upsert({
            where: { slug: blog.slug },
            update: blogData,
            create: blogData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing blog ${blog.slug}:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} blogs\n`);
      importedCount = 0;
    }

    // Import Galleries
    if (exportData.data.galleries && exportData.data.galleries.length > 0) {
      console.log(`📊 Importing ${exportData.data.galleries.length} galleries...`);
      for (const gallery of exportData.data.galleries) {
        try {
          const { id, ...galleryData } = gallery;
          await prisma.gallery.upsert({
            where: { slug: gallery.slug },
            update: galleryData,
            create: galleryData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing gallery ${gallery.slug}:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} galleries\n`);
      importedCount = 0;
    }

    // Import Testimonials
    if (exportData.data.testimonials && exportData.data.testimonials.length > 0) {
      console.log(`📊 Importing ${exportData.data.testimonials.length} testimonials...`);
      for (const testimonial of exportData.data.testimonials) {
        try {
          const { id, ...testimonialData } = testimonial;
          await prisma.testimonial.create({
            data: testimonialData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing testimonial:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} testimonials\n`);
      importedCount = 0;
    }

    // Import Bookings
    if (exportData.data.bookings && exportData.data.bookings.length > 0) {
      console.log(`📊 Importing ${exportData.data.bookings.length} bookings...`);
      for (const booking of exportData.data.bookings) {
        try {
          const { id, ...bookingData } = booking;
          await prisma.booking.create({
            data: bookingData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing booking:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} bookings\n`);
      importedCount = 0;
    }

    // Import Contact Inquiries
    if (exportData.data.contactInquiries && exportData.data.contactInquiries.length > 0) {
      console.log(`📊 Importing ${exportData.data.contactInquiries.length} contact inquiries...`);
      for (const inquiry of exportData.data.contactInquiries) {
        try {
          const { id, ...inquiryData } = inquiry;
          await prisma.contactInquiry.create({
            data: inquiryData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing contact inquiry:`, error.message);
        }
      }
      console.log(`✅ Imported ${importedCount} contact inquiries\n`);
    }

    console.log('✨ Import completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('JSON')) {
      console.error('💡 The JSON file has invalid characters. Try recreating it.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndImport();

