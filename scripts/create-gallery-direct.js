require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Override DATABASE_URL to use port 5437 if not set correctly
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5437/tourworld_tourism';
const finalDbUrl = dbUrl.replace(':5436/', ':5437/').replace(':5432/', ':5437/');

if (!finalDbUrl) {
  console.error('❌ DATABASE_URL is not set. Please check your .env file.');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: finalDbUrl,
    },
  },
});

const galleryData = {
  title: 'New Additions January 2026',
  slug: 'new-additions-january-2026',
  description: 'New photos added to our gallery collection in January 2026',
  tourName: '2026 Tours Collection',
  images: [
    '/images/galleries/new-additions-january-2026/1768207319255-x289o6-WhatsApp Image 2026-01-08 at 05.13.38.jpg',
    '/images/galleries/new-additions-january-2026/1768207319340-f67617-WhatsApp Image 2026-01-08 at 21.06.01.jpg',
    '/images/galleries/new-additions-january-2026/1768207319419-xerf72-WhatsApp Image 2026-01-08 at 21.08.55 (1).jpg',
    '/images/galleries/new-additions-january-2026/1768207319517-yh0pq2-WhatsApp Image 2026-01-08 at 21.08.55 (2).jpg',
    '/images/galleries/new-additions-january-2026/1768207319641-l9c2to-WhatsApp Image 2026-01-08 at 21.08.55.jpg',
    '/images/galleries/new-additions-january-2026/1768207319771-xsrdhj-WhatsApp Image 2026-01-08 at 21.08.56 (1).jpg',
    '/images/galleries/new-additions-january-2026/1768207319849-0dtha1-WhatsApp Image 2026-01-08 at 21.08.56 (2).jpg',
    '/images/galleries/new-additions-january-2026/1768207319969-m47zjp-WhatsApp Image 2026-01-08 at 21.08.56 (3).jpg',
    '/images/galleries/new-additions-january-2026/1768207320040-0ib837-WhatsApp Image 2026-01-08 at 21.08.56 (4).jpg',
    '/images/galleries/new-additions-january-2026/1768207320132-2cqnku-WhatsApp Image 2026-01-08 at 21.08.56.jpg',
    '/images/galleries/new-additions-january-2026/1768207320214-4umcoq-WhatsApp Image 2026-01-08 at 21.08.57.jpg'
  ],
  featuredImage: '/images/galleries/new-additions-january-2026/1768207319255-x289o6-WhatsApp Image 2026-01-08 at 05.13.38.jpg',
  featured: true,
  published: true,
};

async function createGallery() {
  console.log('📸 Creating gallery entry...\n');

  try {
    // Check if gallery already exists
    const existing = await prisma.gallery.findUnique({
      where: { slug: galleryData.slug }
    });

    if (existing) {
      console.log('📝 Gallery already exists, updating...');
      const updated = await prisma.gallery.update({
        where: { id: existing.id },
        data: {
          ...galleryData,
          updatedAt: new Date(),
        },
      });
      console.log('✅ Gallery updated successfully!');
      console.log(`   Title: ${updated.title}`);
      console.log(`   Images: ${updated.images.length}`);
    } else {
      const gallery = await prisma.gallery.create({
        data: galleryData,
      });
      console.log('✅ Gallery created successfully!');
      console.log(`   Title: ${gallery.title}`);
      console.log(`   Slug: ${gallery.slug}`);
      console.log(`   Images: ${gallery.images.length}`);
      console.log(`   Featured: ${gallery.featured ? 'Yes' : 'No'}`);
      console.log(`   Published: ${gallery.published ? 'Yes' : 'No'}`);
    }

    console.log('\n🎉 Gallery is now available at:');
    console.log(`   Admin: http://localhost:3000/admin/galleries`);
    console.log(`   Public: http://localhost:3000/gallery`);

  } catch (error) {
    console.error('❌ Error creating gallery:', error.message);
    console.log('\n💡 Alternative: Create gallery via admin panel at /admin/galleries/new');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createGallery()
  .then(() => {
    console.log('\n✅ Process complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  });
