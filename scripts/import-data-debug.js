#!/usr/bin/env node
/**
 * Debug version - shows what's actually in the data
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  console.log('🚀 Importing DATA from SQL dump...\n');
  
  const sqlContent = fs.readFileSync('tourworld-dump.sql', 'utf8');
  const copyBlocks = sqlContent.split(/COPY public\./);
  const insertStatements = [];
  
  console.log(`Found ${copyBlocks.length - 1} COPY blocks\n`);
  
  for (let i = 1; i < copyBlocks.length; i++) {
    const block = copyBlocks[i];
    const firstLine = block.split('\n')[0];
    const tableMatch = firstLine.match(/^(\w+)\s*\(([^)]+)\)/);
    
    if (!tableMatch) continue;
    
    const tableName = tableMatch[1];
    const columns = tableMatch[2].split(',').map(c => c.trim().replace(/"/g, ''));
    
    console.log(`📊 Processing ${tableName} (${columns.length} columns)`);
    
    const dataSection = block.split('\\.')[0];
    const dataLines = dataSection.split('\n').slice(1).filter(l => l.trim() && !l.trim().startsWith('--'));
    
    console.log(`   Found ${dataLines.length} data rows`);
    
    // Debug first row
    if (dataLines.length > 0) {
      const firstRow = dataLines[0];
      const values = firstRow.split('\t');
      console.log(`   First row: ${values.length} values (expected ${columns.length})`);
      console.log(`   Sample: ${firstRow.substring(0, 100)}`);
    }
    
    let matched = 0;
    for (const row of dataLines) {
      if (!row.trim()) continue;
      const values = row.split('\t');
      
      if (values.length === columns.length) {
        matched++;
        const escapedValues = values.map(v => {
          const val = v.trim();
          if (val === '\\N' || val === 'NULL' || val === '') return 'NULL';
          const escaped = val.replace(/'/g, "''").replace(/\\/g, '\\\\');
          return `'${escaped}'`;
        });
        
        insertStatements.push(`INSERT INTO public."${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${escapedValues.join(', ')}) ON CONFLICT DO NOTHING;`);
      }
    }
    console.log(`   ✅ Matched: ${matched}/${dataLines.length} rows\n`);
  }
  
  // Find INSERT statements
  const insertMatches = sqlContent.match(/INSERT INTO[^;]+;/g);
  if (insertMatches) {
    console.log(`📊 Found ${insertMatches.length} INSERT statements`);
    insertStatements.push(...insertMatches.map(s => s.trim()));
  }
  
  console.log(`\n📊 Total: ${insertStatements.length} records to import\n`);
  
  if (insertStatements.length === 0) {
    console.log('❌ No data found!');
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
      if (errors <= 5) console.error(`\n⚠️  ${e.message.substring(0, 80)}`);
    }
  }
  
  console.log(`\n\n✅ Imported: ${imported} records`);
  if (errors > 0) console.log(`⚠️  Errors: ${errors}`);
  
  // Verify
  const [tours, hotels, galleries] = await Promise.all([
    prisma.tour.count(),
    prisma.hotel.count(),
    prisma.gallery.count(),
  ]);
  console.log(`\n✅ Tours: ${tours}, Hotels: ${hotels}, Galleries: ${galleries}`);
  
  await prisma.$disconnect();
}

importData().catch(e => {
  console.error('❌', e.message);
  process.exit(1);
});

