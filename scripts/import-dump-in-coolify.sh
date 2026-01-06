#!/bin/bash
# Import PostgreSQL dump in Coolify
# This script will be available after deployment

set -e

echo "🚀 PostgreSQL Dump Import"
echo "=========================="

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL not set"
    exit 1
fi

echo "✅ DATABASE_URL found"
echo ""

# Check if dump file exists
DUMP_FILE="tourworld-dump.sql"

if [ ! -f "$DUMP_FILE" ]; then
    echo "📦 SQL dump file not found: $DUMP_FILE"
    echo ""
    echo "Creating from base64..."
    
    # Check if base64 file exists
    BASE64_FILE="tourworld-dump-20260106-132703.sql.base64.txt"
    
    if [ -f "$BASE64_FILE" ]; then
        echo "✅ Found base64 file, decoding..."
        base64 -d "$BASE64_FILE" > "$DUMP_FILE"
    else
        echo "❌ Base64 file not found either"
        echo ""
        echo "Please either:"
        echo "1. Upload tourworld-dump.sql to /app/"
        echo "2. Or upload tourworld-dump-20260106-132703.sql.base64.txt and run this script again"
        exit 1
    fi
fi

echo "✅ SQL dump file found: $DUMP_FILE"
echo "Size: $(du -h "$DUMP_FILE" | cut -f1)"
echo ""

# Verify it's a valid SQL file
if ! head -1 "$DUMP_FILE" | grep -q "PostgreSQL"; then
    echo "⚠️  Warning: File doesn't look like a PostgreSQL dump"
fi

# Import using psql or Docker
echo "📥 Importing into database..."

if command -v psql &> /dev/null; then
    echo "Using psql..."
    psql "$DATABASE_URL" < "$DUMP_FILE"
    IMPORT_STATUS=$?
elif command -v docker &> /dev/null; then
    echo "Using Docker..."
    docker run --rm -i postgres:16 psql "$DATABASE_URL" < "$DUMP_FILE"
    IMPORT_STATUS=$?
else
    echo "❌ Neither psql nor docker is available"
    exit 1
fi

if [ $IMPORT_STATUS -eq 0 ]; then
    echo ""
    echo "✅ Import completed successfully!"
    echo ""
    echo "🔍 Verifying import..."
    node -e "
    const {PrismaClient}=require('@prisma/client');
    const p=new PrismaClient();
    Promise.all([
      p.tour.count(),
      p.hotel.count(),
      p.attraction.count(),
      p.blog.count(),
      p.gallery.count(),
      p.testimonial.count()
    ]).then(([t,h,a,b,g,te])=>{
      console.log('✅ Tours:',t);
      console.log('✅ Hotels:',h);
      console.log('✅ Attractions:',a);
      console.log('✅ Blogs:',b);
      console.log('✅ Galleries:',g);
      console.log('✅ Testimonials:',te);
      p.\$disconnect();
    }).catch(e=>{
      console.error('Error:',e.message);
      p.\$disconnect();
    });
    "
else
    echo "❌ Import failed with exit code: $IMPORT_STATUS"
    exit 1
fi

echo ""
echo "✨ Done!"

