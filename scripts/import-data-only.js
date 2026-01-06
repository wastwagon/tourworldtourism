#!/usr/bin/env node
/**
 * Import only DATA from SQL dump (skip DDL)
 * Prisma can't execute CREATE TABLE, ALTER TABLE, etc.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  const sqlFile = 'tourworld-dump.sql';
  
  console.log('🚀 Importing DATA from SQL dump...');
  console.log(`📄 File: ${sqlFile}\n`);

  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ File not found: ${sqlFile}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  // Extract only COPY/INSERT statements (data, not schema)
  const lines = sqlContent.split('\n');
  const dataStatements = [];
  let inCopyBlock = false;
  let copyStatement = '';
  let copyData = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Start of COPY statement
    if (line.startsWith('COPY public.')) {
      inCopyBlock = true;
      copyStatement = line;
      copyData = [];
      continue;
    }
    
    // End of COPY block
    if (inCopyBlock && line === '\\.') {
      inCopyBlock = false;
      // Convert COPY to INSERT statements
      const tableMatch = copyStatement.match(/COPY public\.(\w+)/);
      if (tableMatch) {
        const tableName = tableMatch[1];
        const columnsMatch = copyStatement.match(/\(([^)]+)\)/);
        const columns = columnsMatch ? columnsMatch[1].split(',').map(c => c.trim()) : [];
        
        // Process COPY data into INSERT statements
        for (const dataLine of copyData) {
          if (dataLine && !dataLine.startsWith('--')) {
            // Parse tab-separated values
            const values = dataLine.split('\t');
            if (values.length === columns.length) {
              // Escape values and create INSERT
              const escapedValues = values.map(v => {
                if (v === '\\N' || v === 'NULL') return 'NULL';
                // Escape single quotes
                const escaped = v.replace(/'/g, "''");
                return `'${escaped}'`;
              });
              const insertSQL = `INSERT INTO public."${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${escapedValues.join(', ')}) ON CONFLICT DO NOTHING;`;
              dataStatements.push(insertSQL);
            }
          }
        }
      }
      continue;
    }
    
    // Collect COPY data lines
    if (inCopyBlock) {
      copyData.push(line);
      continue;
    }
    
    // Regular INSERT statements
    if (line.startsWith('INSERT INTO') && line.endsWith(';')) {
      dataStatements.push(line);
    }
  }

  console.log(`📊 Found ${dataStatements.length} data statements\n`);

  let imported = 0;
  let errors = 0;

  for (let i = 0; i < dataStatements.length; i++) {
    const stmt = dataStatements[i];
    
    if (!stmt) continue;

    try {
      await prisma.$executeRawUnsafe(stmt);
      imported++;
      
      if (imported % 10 === 0) {
        process.stdout.write('.');
      }
    } catch (error) {
      errors++;
      if (errors <= 10) {
        console.error(`\n⚠️  Error at ${i + 1}:`, error.message.substring(0, 100));
      }
    }
  }

  console.log(`\n\n✅ Imported: ${imported} records`);
  if (errors > 0) {
    console.log(`⚠️  Errors: ${errors}`);
  }

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
  process.exit(1);
});

