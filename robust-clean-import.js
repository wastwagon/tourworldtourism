#!/usr/bin/env node
/**
 * Robust JSON cleaning and import script
 * Handles all types of control characters and malformed JSON
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function robustCleanAndImport() {
  console.log('📦 Reading export file...');
  
  try {
    let fileContent = fs.readFileSync('local-db-export-final.json', 'utf8');
    
    // More aggressive cleaning - remove ALL control characters
    // Keep only printable characters, newlines, tabs, and carriage returns
    fileContent = fileContent
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control chars
      .replace(/\u2028/g, '') // Line separator
      .replace(/\u2029/g, '') // Paragraph separator
      .replace(/[\uFEFF]/g, ''); // BOM
    
    // Try to fix common JSON issues
    fileContent = fileContent
      .replace(/,\s*}/g, '}') // Remove trailing commas before }
      .replace(/,\s*]/g, ']'); // Remove trailing commas before ]
    
    console.log('🧹 Cleaning control characters...');
    
    // Parse JSON with error handling
    let exportData;
    try {
      exportData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error('❌ JSON parse error at position:', parseError.message);
      console.error('💡 Trying alternative cleaning method...');
      
      // Alternative: Try to fix the specific problematic area
      // Find the problematic position and fix it
      const errorMatch = parseError.message.match(/position (\d+)/);
      if (errorMatch) {
        const pos = parseInt(errorMatch[1]);
        console.log(`📍 Error at position ${pos}`);
        // Show context around error
        const start = Math.max(0, pos - 100);
        const end = Math.min(fileContent.length, pos + 100);
        console.log('Context:', fileContent.substring(start, end));
      }
      
      // Try escaping problematic characters
      fileContent = fileContent
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
      
      try {
        exportData = JSON.parse(fileContent);
      } catch (e2) {
        console.error('❌ Still failing. Trying to extract and fix specific fields...');
        throw e2;
      }
    }
    
    console.log('✅ File cleaned and parsed successfully\n');
    console.log(`📅 Export date: ${exportData.exportedAt}`);
    console.log(`📊 Source: ${exportData.source}\n`);

    let importedCount = 0;
    let errorCount = 0;

    // Import Tours
    if (exportData.data.tours && exportData.data.tours.length > 0) {
      console.log(`📊 Importing ${exportData.data.tours.length} tours...`);
      for (const tour of exportData.data.tours) {
        try {
          const { id, ...tourData } = tour;
          // Clean tour data
          if (tourData.description) tourData.description = tourData.description.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
          await prisma.tour.upsert({
            where: { slug: tour.slug },
            update: tourData,
            create: tourData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing tour ${tour.slug}:`, error.message);
          errorCount++;
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
          errorCount++;
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
          errorCount++;
        }
      }
      console.log(`✅ Imported ${importedCount} attractions\n`);
      importedCount = 0;
    }

    // Import Blogs (this is where the error likely is)
    if (exportData.data.blogs && exportData.data.blogs.length > 0) {
      console.log(`📊 Importing ${exportData.data.blogs.length} blogs...`);
      for (const blog of exportData.data.blogs) {
        try {
          const { id, ...blogData } = blog;
          // Clean blog content aggressively
          if (blogData.content) {
            blogData.content = blogData.content
              .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
              .replace(/\u2028/g, '')
              .replace(/\u2029/g, '');
          }
          if (blogData.excerpt) {
            blogData.excerpt = blogData.excerpt.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
          }
          await prisma.blog.upsert({
            where: { slug: blog.slug },
            update: blogData,
            create: blogData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing blog ${blog.slug}:`, error.message);
          errorCount++;
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
          errorCount++;
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
          if (testimonialData.testimonial) {
            testimonialData.testimonial = testimonialData.testimonial.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
          }
          await prisma.testimonial.create({
            data: testimonialData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing testimonial:`, error.message);
          errorCount++;
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
          errorCount++;
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
          errorCount++;
        }
      }
      console.log(`✅ Imported ${importedCount} contact inquiries\n`);
    }

    console.log('✨ Import completed!');
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} errors occurred (check logs above)`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

robustCleanAndImport();

