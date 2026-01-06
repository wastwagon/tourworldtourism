# 🚀 Paste This Script Directly in Coolify Terminal

Since the script isn't deployed yet, create it directly:

## Step 1: Create the Script

```bash
cat > import-sql.js << 'SCRIPTEOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importSQL() {
  const sqlFile = 'tourworld-dump.sql';
  
  console.log('🚀 Importing SQL dump...');
  console.log(`📄 File: ${sqlFile}\n`);

  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ File not found: ${sqlFile}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  // Split SQL into individual statements
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s !== '\\.' && s.length > 10);

  console.log(`📊 Found ${statements.length} SQL statements\n`);

  let imported = 0;
  let errors = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    
    if (!stmt) continue;

    try {
      await prisma.$executeRawUnsafe(stmt);
      imported++;
      
      if (imported % 10 === 0) {
        process.stdout.write('.');
      }
    } catch (error) {
      errors++;
      if (errors <= 5) {
        console.error(`\n⚠️  Error at ${i + 1}:`, error.message.substring(0, 80));
      }
    }
  }

  console.log(`\n\n✅ Imported: ${imported} statements`);
  if (errors > 0) {
    console.log(`⚠️  Errors: ${errors}`);
  }

  // Verify
  console.log('\n🔍 Verifying...');
  try {
    const [tours, hotels, galleries] = await Promise.all([
      prisma.tour.count(),
      prisma.hotel.count(),
      prisma.gallery.count(),
    ]);
    console.log(`✅ Tours: ${tours}`);
    console.log(`✅ Hotels: ${hotels}`);
    console.log(`✅ Galleries: ${galleries}`);
  } catch (e) {
    console.error('Verification error:', e.message);
  }

  await prisma.$disconnect();
}

importSQL().catch(e => {
  console.error('❌ Fatal:', e.message);
  process.exit(1);
});
SCRIPTEOF
```

## Step 2: Run It

```bash
node import-sql.js
```

---

**Copy the entire script above (from `cat > import-sql.js` to `SCRIPTEOF`) and paste it into Coolify Terminal, then run `node import-sql.js`**

