import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SafeImage } from '@/components/SafeImage'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  MapPinIcon
} from '@heroicons/react/24/solid'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'About Us - Tourworld Tourism',
  description: 'Learn about Tourworld Tourism, your trusted partner for unforgettable Ghanaian adventures since 2015.',
}

async function getTourImages() {
  try {
    const tours = await prisma.tour.findMany({
      where: {
        status: 'active',
        OR: [
          { featuredImage: { not: null } },
          { galleryImages: { isEmpty: false } }
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        galleryImages: true,
        tourType: true,
        regions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    })
    
    // Collect all images from tours with metadata
    const allImages: Array<{ 
      src: string; 
      tourTitle: string; 
      tourSlug: string; 
      tourType: string;
      fileName: string;
    }> = []
    
    tours.forEach(tour => {
      // Helper to extract filename from path
      const getFileName = (path: string) => {
        return path.split('/').pop()?.toLowerCase() || ''
      }
      
      if (tour.featuredImage) {
        allImages.push({
          src: tour.featuredImage,
          tourTitle: tour.title,
          tourSlug: tour.slug,
          tourType: tour.tourType,
          fileName: getFileName(tour.featuredImage),
        })
      }
      if (tour.galleryImages && Array.isArray(tour.galleryImages)) {
        tour.galleryImages.slice(0, 3).forEach((img: string) => {
          allImages.push({
            src: img,
            tourTitle: tour.title,
            tourSlug: tour.slug,
            tourType: tour.tourType,
            fileName: getFileName(img),
          })
        })
      }
    })
    
    return allImages.slice(0, 20) // Return up to 20 images
  } catch (error) {
    console.error('Error fetching tour images:', error)
    return []
  }
}

async function getFeaturedGalleryImage() {
  try {
    const gallery = await prisma.gallery.findFirst({
      where: {
        featured: true,
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return gallery?.featuredImage || gallery?.images[0] || null
  } catch (error) {
    console.error('Error fetching gallery image:', error)
    return null
  }
}

export default async function AboutPage() {
  const heroImage = await getFeaturedGalleryImage()
  const tourImages = await getTourImages()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <SafeImage
              src={heroImage}
              alt="Ghana Tourism Experience"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12 lg:pb-16">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
                  <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-red-600"></div>
                  <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-yellow-500"></div>
                  <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-green-600"></div>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">
                  About{' '}
                  <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                    Tourworld Tourism
                  </span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-white/90 font-light max-w-2xl leading-relaxed">
                  Your trusted partner for unforgettable Ghanaian adventures since 2015
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 hidden lg:block">
            <div className="w-32 h-32 border-2 border-yellow-400/30 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute bottom-32 left-10 hidden lg:block">
            <div className="w-24 h-24 border-2 border-red-500/30 rounded-full animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Story Section - Split Layout with Images */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Left Side - Content */}
              <div>
                <div className="inline-block mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wider">
                    Our Story
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
                  Crafting Authentic{' '}
                  <span className="text-red-600">Ghanaian</span> Experiences
                </h2>
                <div className="space-y-3 sm:space-y-4 md:space-y-6 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  <p>
                    <strong className="text-gray-900">Tourworld Tourism</strong> has been 
                    a leading tour operator in Ghana since 2015. We are licensed by the Ghana Tourism Authority and 
                    are a member in good standing of the Tour Operators Union of Ghana. 
                    We specialize in creating authentic, immersive experiences that showcase the rich culture, history, 
                    and natural beauty of Ghana.
                  </p>
                  <p>
                    Our mission is to provide exceptional travel experiences that connect visitors with 
                    Ghana's vibrant communities, historical sites, and breathtaking landscapes. We believe 
                    in responsible tourism that benefits local communities while preserving Ghana's cultural 
                    heritage and natural environment.
                  </p>
                  <p className="text-gray-600">
                    With years of experience and a deep understanding of Ghana's diverse regions, we offer 
                    carefully curated tours that cater to all interests - from cultural enthusiasts and 
                    history buffs to nature lovers and adventure seekers.
                  </p>
                </div>
              </div>

              {/* Right Side - Image Grid */}
              {tourImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  {tourImages.slice(0, 4).map((img, idx) => (
                    <Link
                      key={idx}
                      href={`/tours/${img.tourSlug}`}
                      className="group relative aspect-square overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <SafeImage
                        src={img.src}
                        alt={img.tourTitle}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs sm:text-sm font-semibold line-clamp-1">{img.tourTitle}</p>
                        <p className="text-white/80 text-xs">{img.tourType}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
            </div>
          </div>
        </section>


        {/* What We Offer - Modern Cards with Images */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="inline-block mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wider">
                  What We Offer
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Discover Ghana's{' '}
                <span className="text-red-600">Treasures</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                From cultural heritage to wildlife adventures, we offer diverse experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {/* Cultural Tours */}
              <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {(() => {
                  // Find image matching Cultural & Heritage
                  const culturalImage = tourImages.find(img => {
                    const fileName = img.fileName || ''
                    const title = img.tourTitle.toLowerCase()
                    const type = img.tourType.toLowerCase()
                    return (
                      fileName.includes('culture') ||
                      fileName.includes('heritage') ||
                      fileName.includes('ghana-culture') ||
                      type.includes('cultural') ||
                      type.includes('heritage') ||
                      title.includes('culture') ||
                      title.includes('heritage')
                    )
                  }) || tourImages.find(img => img.tourType.toLowerCase().includes('culture')) || tourImages[0]
                  
                  return culturalImage ? (
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <SafeImage
                        src={culturalImage.src}
                        alt="Cultural & Heritage Tours"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  ) : null;
                })()}
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Cultural & Heritage</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    Explore Ghana's rich cultural heritage, visit traditional villages, witness authentic 
                    ceremonies, and learn about the history of the Ashanti Kingdom.
                  </p>
                </div>
              </div>

              {/* Historical Tours */}
              <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {(() => {
                  // Find image matching Historical Tours
                  const historicalImage = tourImages.find(img => {
                    const fileName = img.fileName || ''
                    const title = img.tourTitle.toLowerCase()
                    const type = img.tourType.toLowerCase()
                    return (
                      fileName.includes('heritage') && !fileName.includes('culture') ||
                      fileName.includes('castle') ||
                      fileName.includes('coast') ||
                      fileName.includes('elmina') ||
                      type.includes('historical') ||
                      type.includes('history') ||
                      title.includes('castle') ||
                      title.includes('coast') ||
                      title.includes('elmina') ||
                      title.includes('slave') ||
                      title.includes('historical')
                    )
                  }) || tourImages.find(img => 
                    img.tourTitle.toLowerCase().includes('castle') ||
                    img.tourTitle.toLowerCase().includes('coast')
                  ) || tourImages.find(img => img.fileName.includes('heritage')) || tourImages[1]
                  
                  return historicalImage ? (
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <SafeImage
                        src={historicalImage.src}
                        alt="Historical Tours"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  ) : null;
                })()}
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Historical Tours</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    Visit UNESCO World Heritage sites including Cape Coast and Elmina Castles, learn about 
                    the transatlantic slave trade, and explore Ghana's journey to independence.
                  </p>
                </div>
              </div>

              {/* Wildlife Safaris */}
              <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <SafeImage
                    src="/images/tours/wildlife-wonders.jpg"
                    alt="Wildlife Safaris"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Wildlife Safaris</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    Discover Ghana's diverse wildlife in national parks and reserves, including Kakum 
                    National Park's canopy walkway and Mole National Park's elephant herds.
                  </p>
                </div>
              </div>

              {/* Custom Tours */}
              <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {(() => {
                  // Find image for Custom Tours - prefer general/experience tours
                  const customImage = tourImages.find(img => {
                    const fileName = img.fileName || ''
                    const title = img.tourTitle.toLowerCase()
                    return (
                      fileName.includes('experience') ||
                      fileName.includes('ultimate') ||
                      fileName.includes('general') ||
                      title.includes('experience') ||
                      title.includes('ultimate')
                    )
                  }) || tourImages[3] || tourImages[0]
                  
                  return customImage ? (
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <SafeImage
                        src={customImage.src}
                        alt="Custom Tours"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  ) : null;
                })()}
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Custom Tours</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    We create personalized itineraries tailored to your interests, schedule, and budget. 
                    Whether you're traveling solo, with family, or in a group.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - World-Class Design */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-block mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wider">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Your Trusted{' '}
                <span className="text-red-600">Travel Partner</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {/* Licensed & Experienced */}
              <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-200 overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight group-hover:text-red-600 transition-colors duration-300">
                    Licensed & Experienced
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-red-400 mb-4 sm:mb-5 rounded-full"></div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                    We are a licensed tour operator in Ghana (GPS: GA-016-7761) with over 15 years 
                    of experience in the tourism industry.
                  </p>
                </div>
              </div>

              {/* Local Expertise */}
              <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-200 overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight group-hover:text-yellow-600 transition-colors duration-300">
                    Local Expertise
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-yellow-400 mb-4 sm:mb-5 rounded-full"></div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                    Our team consists of local guides who have deep knowledge of Ghana's culture, 
                    history, and hidden gems that make your experience truly authentic.
                  </p>
                </div>
              </div>

              {/* Responsible Tourism */}
              <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight group-hover:text-green-600 transition-colors duration-300">
                    Responsible Tourism
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-green-400 mb-4 sm:mb-5 rounded-full"></div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                    We are committed to sustainable tourism practices that support local communities 
                    and preserve Ghana's cultural and natural heritage for future generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
              Ready to Explore Ghana?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Contact us today to start planning your unforgettable Ghanaian adventure
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
