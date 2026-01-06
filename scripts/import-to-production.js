#!/usr/bin/env node
/**
 * Import exported data to production database
 * Usage: node scripts/import-to-production.js < export-file.json
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const readline = require('readline');

// Production database URL (should be set in environment)
const PROD_DB_URL = process.env.DATABASE_URL;

if (!PROD_DB_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
  console.error('💡 Please set DATABASE_URL to your production database connection string.');
  process.exit(1);
}

// Override DATABASE_URL for this script
process.env.DATABASE_URL = PROD_DB_URL;

const prisma = new PrismaClient();

async function importDatabase(exportData) {
  console.error('📦 Starting database import to production...');
  console.error(`📍 Database: ${PROD_DB_URL.replace(/:[^:@]+@/, ':****@')}`);
  console.error(`📅 Export date: ${exportData.exportedAt}`);
  console.error(`📊 Source: ${exportData.source}\n`);

  try {
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Import Tours
    if (exportData.data.tours && exportData.data.tours.length > 0) {
      console.error(`📊 Importing ${exportData.data.tours.length} tours...`);
      for (const tour of exportData.data.tours) {
        try {
          // Remove id to let database generate new one, or keep if you want to preserve IDs
          const { id, ...tourData } = tour;
          await prisma.tour.upsert({
            where: { slug: tour.slug },
            update: tourData,
            create: tourData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing tour "${tour.title}":`, error.message);
          errorCount++;
        }
      }
      console.error(`✅ Imported ${importedCount} tours`);
      importedCount = 0;
    }

    // Import Hotels
    if (exportData.data.hotels && exportData.data.hotels.length > 0) {
      console.error(`📊 Importing ${exportData.data.hotels.length} hotels...`);
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
          // Try by name if id fails
          try {
            const existing = await prisma.hotel.findFirst({
              where: { name: hotel.name, location: hotel.location }
            });
            if (existing) {
              await prisma.hotel.update({
                where: { id: existing.id },
                data: hotel,
              });
              skippedCount++;
            } else {
              await prisma.hotel.create({ data: hotel });
              importedCount++;
            }
          } catch (e) {
            console.error(`⚠️  Error importing hotel "${hotel.name}":`, e.message);
            errorCount++;
          }
        }
      }
      console.error(`✅ Imported ${importedCount} hotels, updated ${skippedCount}`);
      importedCount = 0;
      skippedCount = 0;
    }

    // Import Attractions
    if (exportData.data.attractions && exportData.data.attractions.length > 0) {
      console.error(`📊 Importing ${exportData.data.attractions.length} attractions...`);
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
          try {
            const existing = await prisma.attraction.findFirst({
              where: { name: attraction.name }
            });
            if (existing) {
              await prisma.attraction.update({
                where: { id: existing.id },
                data: attraction,
              });
              skippedCount++;
            } else {
              await prisma.attraction.create({ data: attraction });
              importedCount++;
            }
          } catch (e) {
            console.error(`⚠️  Error importing attraction "${attraction.name}":`, e.message);
            errorCount++;
          }
        }
      }
      console.error(`✅ Imported ${importedCount} attractions, updated ${skippedCount}`);
      importedCount = 0;
      skippedCount = 0;
    }

    // Import Blogs
    if (exportData.data.blogs && exportData.data.blogs.length > 0) {
      console.error(`📊 Importing ${exportData.data.blogs.length} blogs...`);
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
          console.error(`⚠️  Error importing blog "${blog.title}":`, error.message);
          errorCount++;
        }
      }
      console.error(`✅ Imported ${importedCount} blogs`);
      importedCount = 0;
    }

    // Import Galleries
    if (exportData.data.galleries && exportData.data.galleries.length > 0) {
      console.error(`📊 Importing ${exportData.data.galleries.length} galleries...`);
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
          console.error(`⚠️  Error importing gallery "${gallery.title}":`, error.message);
          errorCount++;
        }
      }
      console.error(`✅ Imported ${importedCount} galleries`);
      importedCount = 0;
    }

    // Import Testimonials
    if (exportData.data.testimonials && exportData.data.testimonials.length > 0) {
      console.error(`📊 Importing ${exportData.data.testimonials.length} testimonials...`);
      for (const testimonial of exportData.data.testimonials) {
        try {
          const { id, ...testimonialData } = testimonial;
          await prisma.testimonial.create({ data: testimonialData });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing testimonial:`, error.message);
          errorCount++;
        }
      }
      console.error(`✅ Imported ${importedCount} testimonials`);
      importedCount = 0;
    }

    // Import Bookings (optional - you might want to skip these)
    if (exportData.data.bookings && exportData.data.bookings.length > 0) {
      console.error(`📊 Importing ${exportData.data.bookings.length} bookings...`);
      for (const booking of exportData.data.bookings) {
        try {
          // Find tour by slug or title
          const tour = await prisma.tour.findFirst({
            where: {
              OR: [
                { id: booking.tourId },
                { slug: { contains: booking.tourId } }
              ]
            }
          });
          
          if (tour) {
            const { id, tourId, ...bookingData } = booking;
            await prisma.booking.create({
              data: {
                ...bookingData,
                tourId: tour.id
              }
            });
            importedCount++;
          } else {
            console.error(`⚠️  Skipping booking - tour not found: ${booking.tourId}`);
            skippedCount++;
          }
        } catch (error) {
          console.error(`⚠️  Error importing booking:`, error.message);
          errorCount++;
        }
      }
      console.error(`✅ Imported ${importedCount} bookings, skipped ${skippedCount}`);
      importedCount = 0;
      skippedCount = 0;
    }

    // Import Contact Inquiries
    if (exportData.data.contactInquiries && exportData.data.contactInquiries.length > 0) {
      console.error(`📊 Importing ${exportData.data.contactInquiries.length} contact inquiries...`);
      for (const inquiry of exportData.data.contactInquiries) {
        try {
          const { id, ...inquiryData } = inquiry;
          await prisma.contactInquiry.create({ data: inquiryData });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing inquiry:`, error.message);
          errorCount++;
        }
      }
      console.error(`✅ Imported ${importedCount} contact inquiries`);
      importedCount = 0;
    }

    // Import Newsletter Subscriptions
    if (exportData.data.newsletters && exportData.data.newsletters.length > 0) {
      console.error(`📊 Importing ${exportData.data.newsletters.length} newsletter subscriptions...`);
      for (const newsletter of exportData.data.newsletters) {
        try {
          const { id, ...newsletterData } = newsletter;
          await prisma.newsletter.upsert({
            where: { email: newsletter.email },
            update: newsletterData,
            create: newsletterData,
          });
          importedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing newsletter subscription:`, error.message);
          errorCount++;
        }
      }
      console.error(`✅ Imported ${importedCount} newsletter subscriptions`);
      importedCount = 0;
    }

    // Import Users (without passwords - they'll need to reset)
    if (exportData.data.users && exportData.data.users.length > 0) {
      console.error(`📊 Importing ${exportData.data.users.length} users (passwords excluded - users will need to reset)...`);
      for (const user of exportData.data.users) {
        try {
          const { id, ...userData } = user;
          // Don't import users without passwords - they'll need to be recreated
          console.error(`⚠️  Skipping user "${user.email}" - password not included (security)`);
          skippedCount++;
        } catch (error) {
          console.error(`⚠️  Error importing user:`, error.message);
          errorCount++;
        }
      }
      console.error(`⚠️  Skipped ${skippedCount} users (passwords not exported for security)`);
      skippedCount = 0;
    }

    console.error('\n✨ Import completed!');
    console.error(`✅ Successfully imported data`);
    if (errorCount > 0) {
      console.error(`⚠️  ${errorCount} errors occurred (check logs above)`);
    }

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Read JSON from stdin
let inputData = '';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  inputData += line + '\n';
});

rl.on('close', () => {
  try {
    const exportData = JSON.parse(inputData);
    importDatabase(exportData);
  } catch (error) {
    console.error('❌ Error parsing JSON:', error.message);
    process.exit(1);
  }
});

