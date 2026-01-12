/**
 * Script to create gallery via API
 * Make sure your Next.js dev server is running before executing this script
 * Usage: node scripts/create-gallery-api.js
 */

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3008';
  
  console.log('📸 Creating gallery via API...\n');
  console.log(`🌐 Using URL: ${baseUrl}/api/galleries\n`);

  try {
    const response = await fetch(`${baseUrl}/api/galleries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galleryData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Gallery created successfully!');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const error = await response.json();
      console.error('❌ Failed to create gallery:');
      console.error(JSON.stringify(error, null, 2));
      console.log('\n💡 Note: This endpoint requires admin authentication.');
      console.log('   You may need to create the gallery via the admin panel at /admin/galleries/new');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your Next.js dev server is running: npm run dev');
    console.log('   Or create the gallery manually via /admin/galleries/new');
  }
}

createGallery();
