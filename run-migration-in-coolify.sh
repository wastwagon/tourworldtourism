#!/bin/bash
# Copy this script and run it in Coolify Terminal
# Or copy the commands below directly into Coolify Terminal

echo "🚀 Database Migration for Coolify"
echo "=================================="
echo ""

# Check if export file exists
if [ ! -f "local-db-export-final.json" ]; then
  echo "❌ Export file 'local-db-export-final.json' not found!"
  echo ""
  echo "📋 To upload the file:"
  echo "   1. Go to your local machine"
  echo "   2. Open: local-db-export-final.json"
  echo "   3. Copy all contents"
  echo "   4. In Coolify Terminal, run:"
  echo "      nano local-db-export-final.json"
  echo "   5. Paste contents, save (Ctrl+X, Y, Enter)"
  echo ""
  exit 1
fi

echo "✅ Export file found"
echo "📊 Starting import..."
echo ""

# Import the data
cat local-db-export-final.json | node scripts/import-to-production.js

echo ""
echo "✅ Import completed!"
echo ""
echo "🔍 Verifying import..."
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count(),p.gallery.count()]).then(([t,h,a,b,g])=>console.log('✅ Tours:',t,'Hotels:',h,'Attractions:',a,'Blogs:',b,'Galleries:',g));"

echo ""
echo "🎉 Migration complete!"
echo "💡 Check your site: http://tourworldtourism.com"

