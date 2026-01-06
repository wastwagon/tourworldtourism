#!/usr/bin/env node
/**
 * Export all data from local PostgreSQL database
 * Usage: node scripts/export-local-db.js > local-db-export.json
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Use local database URL
const LOCAL_DB_URL = process.env.LOCAL_DATABASE_URL || 'postgresql://postgres:password@localhost:5436/tourworld_tourism';

// Override DATABASE_URL for this script
process.env.DATABASE_URL = LOCAL_DB_URL;

const prisma = new PrismaClient();

async function exportDatabase() {
  console.error('📦 Starting database export from local PostgreSQL...');
  console.error(`📍 Database: ${LOCAL_DB_URL.replace(/:[^:@]+@/, ':****@')}`);

  try {
    const exportData = {
      exportedAt: new Date().toISOString(),
      source: 'local-postgresql',
      data: {}
    };

    // Export all tables
    console.error('📊 Exporting tours...');
    exportData.data.tours = await prisma.tour.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.tours.length} tours`);

    console.error('📊 Exporting hotels...');
    exportData.data.hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.hotels.length} hotels`);

    console.error('📊 Exporting attractions...');
    exportData.data.attractions = await prisma.attraction.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.attractions.length} attractions`);

    console.error('📊 Exporting blogs...');
    exportData.data.blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.blogs.length} blogs`);

    console.error('📊 Exporting galleries...');
    exportData.data.galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.galleries.length} galleries`);

    console.error('📊 Exporting testimonials...');
    exportData.data.testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.testimonials.length} testimonials`);

    console.error('📊 Exporting bookings...');
    exportData.data.bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.bookings.length} bookings`);

    console.error('📊 Exporting contact inquiries...');
    exportData.data.contactInquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.contactInquiries.length} contact inquiries`);

    console.error('📊 Exporting newsletters...');
    exportData.data.newsletters = await prisma.newsletter.findMany({
      orderBy: { subscribedAt: 'asc' }
    });
    console.error(`✅ Exported ${exportData.data.newsletters.length} newsletter subscriptions`);

    console.error('📊 Exporting users...');
    exportData.data.users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
        // Don't export passwords for security
      }
    });
    console.error(`✅ Exported ${exportData.data.users.length} users (passwords excluded for security)`);

    // Output JSON to stdout
    console.log(JSON.stringify(exportData, null, 2));

    console.error('\n✨ Export completed successfully!');
    console.error(`📁 Total records exported:`);
    console.error(`   - Tours: ${exportData.data.tours.length}`);
    console.error(`   - Hotels: ${exportData.data.hotels.length}`);
    console.error(`   - Attractions: ${exportData.data.attractions.length}`);
    console.error(`   - Blogs: ${exportData.data.blogs.length}`);
    console.error(`   - Galleries: ${exportData.data.galleries.length}`);
    console.error(`   - Testimonials: ${exportData.data.testimonials.length}`);
    console.error(`   - Bookings: ${exportData.data.bookings.length}`);
    console.error(`   - Contact Inquiries: ${exportData.data.contactInquiries.length}`);
    console.error(`   - Newsletter Subscriptions: ${exportData.data.newsletters.length}`);
    console.error(`   - Users: ${exportData.data.users.length}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase();

