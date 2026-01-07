import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'
import { SafeImage } from '@/components/SafeImage'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

async function getFeaturedTourImage() {
  try {
    const tour = await prisma.tour.findFirst({
      where: {
        featured: true,
        status: 'active',
        featuredImage: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        featuredImage: true,
      },
    })
    return tour?.featuredImage || null
  } catch (error) {
    console.error('Error fetching featured tour image:', error)
    return null
  }
}

export default async function ContactPage() {
  const featuredTourImage = await getFeaturedTourImage()
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          {featuredTourImage ? (
            <SafeImage
              src={featuredTourImage}
              alt="Contact Us"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-yellow-500/70 to-green-600/80"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
              Contact <span className="text-yellow-300">Us</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Send us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Get in Touch</h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">📍</span>
                      Our Offices
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">North Ridge Office</h4>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          No. 44, Sixth Avenue, Adjacent Republic Bank Head Office<br />
                          Sekou Toure Street, North Ridge<br />
                          Accra, Ghana.<br />
                          <span className="font-semibold text-red-600">GPS: GA-016-7761</span>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">Adenta Office</h4>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          No. 2 Ayeben Street, Adenta Housing Down<br />
                          Adenta, Accra, Ghana.<br />
                          <span className="text-gray-500 italic text-[11px] sm:text-xs">(Near Shield International School)</span><br />
                          <span className="font-semibold text-red-600">GPS: GD-040-1884</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">📞</span>
                      Phone
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700">
                      <a href="tel:+233547783865" className="hover:text-red-600 transition-colors">
                        +233 54 778 3865
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">✉️</span>
                      Email
                    </h3>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-700 break-all">
                        <a href="mailto:info@tourworldtourism.com" className="hover:text-red-600 transition-colors font-semibold">
                          info@tourworldtourism.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center">
                      <span className="text-red-600 mr-2">🕒</span>
                      Business Hours
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg p-4 sm:p-6 lg:p-8 text-white">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">GPS Locations</h3>
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm opacity-90 font-medium">North Ridge: GA-016-7761</p>
                  <p className="text-xs sm:text-sm opacity-90 font-medium">Adenta: GD-040-1884</p>
                </div>
                <p className="text-xs sm:text-sm mt-4 opacity-90">Licensed Tour Operator in Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
