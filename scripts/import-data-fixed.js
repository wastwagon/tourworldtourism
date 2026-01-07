#!/usr/bin/env node
/**
 * Fixed data import - handles COPY statements correctly
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  console.log('🚀 Importing DATA from SQL dump...\n');
  
  const sqlContent = fs.readFileSync('tourworld-dump.sql', 'utf8');
  
  // Split by COPY blocks
  const copyBlocks = sqlContent.split(/COPY public\./);
  const insertStatements = [];
  
  for (let i = 1; i < copyBlocks.length; i++) {
    const block = copyBlocks[i];
    
    // Extract table name and columns
    const firstLine = block.split('\n')[0];
    const tableMatch = firstLine.match(/^(\w+)\s*\(([^)]+)\)/);
    
    if (!tableMatch) continue;
    
    const tableName = tableMatch[1];
    const columns = tableMatch[2].split(',').map(c => c.trim().replace(/"/g, ''));
    
    // Extract data rows (between COPY and \.)
    const dataSection = block.split('\\.')[0];
    const dataLines = dataSection.split('\n').slice(1).filter(l => l.trim() && !l.trim().startsWith('--'));
    
    // Process each data row
    for (const row of dataLines) {
      if (!row.trim()) continue;
      
      // Split by tab (COPY format uses tabs)
      const values = row.split('\t');
      
      if (values.length === columns.length) {
        // Escape values
        const escapedValues = values.map(v => {
          const val = v.trim();
          if (val === '\\N' || val === 'NULL' || val === '') return 'NULL';
          // Escape single quotes and wrap in quotes
          const escaped = val.replace(/'/g, "''").replace(/\\/g, '\\\\');
          return `'${escaped}'`;
        });
        
        const insertSQL = `INSERT INTO public."${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${escapedValues.join(', ')}) ON CONFLICT DO NOTHING;`;
        insertStatements.push(insertSQL);
      }
    }
  }
  
  // Also find regular INSERT statements
  const insertMatches = sqlContent.match(/INSERT INTO[^;]+;/g);
  if (insertMatches) {
    insertStatements.push(...insertMatches.map(s => s.trim()));
  }
  
  console.log(`📊 Found ${insertStatements.length} data records\n`);
  
  if (insertStatements.length === 0) {
    console.log('⚠️  No data found. Checking SQL file format...');
    const sample = sqlContent.substring(0, 2000);
    console.log('First 2000 chars:', sample);
    await prisma.$disconnect();
    return;
  }
  
  let imported = 0;
  let errors = 0;
  
  for (let i = 0; i < insertStatements.length; i++) {
    try {
      await prisma.$executeRawUnsafe(insertStatements[i]);
      imported++;
      if (imported % 20 === 0) process.stdout.write('.');
    } catch (e) {
      errors++;
      if (errors <= 10) {
        console.error(`\n⚠️  ${i + 1}: ${e.message.substring(0, 80)}`);
        // Show first problematic statement
        if (errors === 1) {
          console.error('Statement:', insertStatements[i].substring(0, 200));
        }
      }
    }
  }
  
  console.log(`\n\n✅ Imported: ${imported} records`);
  if (errors > 0) console.log(`⚠️  Errors: ${errors}`);
  
  // Verify
  console.log('\n🔍 Verifying...');
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
  } catch (e) {
    console.error('Verification error:', e.message);
  }
  
  await prisma.$disconnect();
}

importData().catch(e => {
  console.error('❌ Fatal:', e.message);
  console.error(e.stack);
  process.exit(1);
});


