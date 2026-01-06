#!/bin/bash
# Complete import script for Coolify Terminal
# This script decodes the base64 dump and imports it

set -e

echo "🚀 PostgreSQL Dump Import for Coolify"
echo "======================================"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set it first:"
    echo "  export DATABASE_URL='your-database-url'"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo "Database: $(echo $DATABASE_URL | sed 's/:[^:@]*@/:****@/')"
echo ""

# Step 1: Check if base64 file exists
if [ -f "tourworld-dump-20260106-132703.sql.base64.txt" ]; then
    echo "📦 Found base64 file"
    BASE64_FILE="tourworld-dump-20260106-132703.sql.base64.txt"
else
    echo "❌ Base64 file not found in current directory"
    echo "Please upload the base64 file first, or paste it below"
    exit 1
fi

# Step 2: Decode base64 file
echo "🔓 Decoding base64 file..."
base64 -d "$BASE64_FILE" > tourworld-dump.sql 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Decoded successfully"
    echo "SQL file size: $(du -h tourworld-dump.sql | cut -f1)"
else
    echo "❌ Decode failed"
    exit 1
fi

# Step 3: Verify SQL file
echo ""
echo "🔍 Verifying SQL dump..."
if head -1 tourworld-dump.sql | grep -q "PostgreSQL"; then
    echo "✅ Valid PostgreSQL dump"
else
    echo "⚠️  Warning: File doesn't look like a PostgreSQL dump"
fi

# Step 4: Import using psql (if available)
if command -v psql &> /dev/null; then
    echo ""
    echo "📥 Importing into database using psql..."
    psql "$DATABASE_URL" < tourworld-dump.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Import completed successfully!"
    else
        echo "❌ Import failed"
        exit 1
    fi
# Step 4b: Import using Docker (if psql not available)
elif command -v docker &> /dev/null; then
    echo ""
    echo "📥 Importing into database using Docker..."
    docker run --rm -i postgres:16 psql "$DATABASE_URL" < tourworld-dump.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Import completed successfully!"
    else
        echo "❌ Import failed"
        exit 1
    fi
else
    echo "❌ Neither psql nor docker is available"
    echo "Please install one of them, or import manually"
    exit 1
fi

# Step 5: Verify import
echo ""
echo "🔍 Verifying import..."
echo "Run this to check record counts:"
echo "  node -e \"const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count(),p.gallery.count(),p.testimonial.count()]).then(([t,h,a,b,g,te])=>{console.log('Tours:',t);console.log('Hotels:',h);console.log('Attractions:',a);console.log('Blogs:',b);console.log('Galleries:',g);console.log('Testimonials:',te);p.\$disconnect();});\""

echo ""
echo "✨ Done!"

