#!/usr/bin/env node
/**
 * Import SQL dump using Node.js/Prisma
 * Works when psql and docker are not available
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importSQL() {
  const sqlFile = process.argv[2] || 'tourworld-dump.sql';
  
  console.log('🚀 Importing SQL dump with Node.js/Prisma...');
  console.log(`📄 File: ${sqlFile}\n`);

  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ File not found: ${sqlFile}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  // Split SQL into individual statements
  // Remove comments and empty lines
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s !== '\\.');

  console.log(`📊 Found ${statements.length} SQL statements\n`);

  let imported = 0;
  let errors = 0;

  // Execute statements in batches
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    
    // Skip empty statements
    if (!stmt || stmt.length < 10) continue;

    try {
      // Use executeRawUnsafe for DDL and DML
      await prisma.$executeRawUnsafe(stmt);
      imported++;
      
      // Progress indicator
      if (imported % 10 === 0) {
        process.stdout.write('.');
      }
    } catch (error) {
      errors++;
      // Only show first few errors to avoid spam
      if (errors <= 5) {
        console.error(`\n⚠️  Error at statement ${i + 1}:`, error.message.substring(0, 100));
      }
    }
  }

  console.log(`\n\n✅ Import completed!`);
  console.log(`   Imported: ${imported} statements`);
  if (errors > 0) {
    console.log(`   Errors: ${errors} statements`);
  }

  // Verify import
  console.log('\n🔍 Verifying import...');
  try {
    const [tours, hotels, attractions, blogs, galleries, testimonials] = await Promise.all([
      prisma.tour.count(),
      prisma.hotel.count(),
      prisma.attraction.count(),
      prisma.blog.count(),
      prisma.gallery.count(),
      prisma.testimonial.count(),
    ]);

    console.log(`✅ Tours: ${tours}`);
    console.log(`✅ Hotels: ${hotels}`);
    console.log(`✅ Attractions: ${attractions}`);
    console.log(`✅ Blogs: ${blogs}`);
    console.log(`✅ Galleries: ${galleries}`);
    console.log(`✅ Testimonials: ${testimonials}`);
  } catch (error) {
    console.error('❌ Verification error:', error.message);
  }

  await prisma.$disconnect();
}

importSQL().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});


