#!/usr/bin/env node
/**
 * Create SQL dump file from base64 in Coolify
 * Usage: node scripts/create-dump-from-base64.js
 */

const fs = require('fs');
const path = require('path');

const BASE64_FILE = 'tourworld-dump-20260106-132703.sql.base64.txt';
const OUTPUT_FILE = 'tourworld-dump.sql';

console.log('🚀 Creating SQL dump from base64...');

try {
  // Check if base64 file exists
  if (!fs.existsSync(BASE64_FILE)) {
    console.error(`❌ Base64 file not found: ${BASE64_FILE}`);
    console.error('Please upload the base64 file to Coolify first.');
    process.exit(1);
  }

  // Read base64 file
  console.log(`📦 Reading ${BASE64_FILE}...`);
  const base64Content = fs.readFileSync(BASE64_FILE, 'utf8').trim();

  // Decode base64
  console.log('🔓 Decoding base64...');
  const sqlContent = Buffer.from(base64Content, 'base64').toString('utf8');

  // Write SQL file
  console.log(`💾 Writing ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, sqlContent);

  // Verify
  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`✅ SQL file created: ${OUTPUT_FILE}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);

  // Check if it's valid
  const firstLine = sqlContent.split('\n')[0];
  if (firstLine.includes('PostgreSQL')) {
    console.log('✅ Valid PostgreSQL dump');
  } else {
    console.log('⚠️  Warning: File might not be a valid PostgreSQL dump');
  }

  console.log('');
  console.log('✨ Next step: Run the import script');
  console.log('   ./scripts/import-dump-in-coolify.sh');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

