import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SafeImage } from '@/components/SafeImage'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { UserIcon } from '@heroicons/react/24/outline'
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs'
import { FaqSection } from '@/components/FaqSection'
import { BLOG_FAQ } from '@/lib/faq-content'
import { createPageMetadata } from '@/lib/metadata-helpers'
import { devError } from '@/lib/dev-log'

async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })
    // Ensure proper serialization for Next.js server-to-client component passing
    return JSON.parse(JSON.stringify(blogs))
  } catch (error) {
    devError('Error fetching blogs:', error)
    return []
  }
}

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
    devError('Error fetching featured tour image:', error)
    return null
  }
}

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata = createPageMetadata({
  title: 'Blog - Tourworld Tourism',
  description:
    'Discover Ghana through our travel blog — culture, history, wildlife, and unforgettable experiences.',
  path: '/blog',
})

export default async function BlogPage() {
  let blogs: any[] = []
  let error: string | null = null
  let featuredTourImage: string | null = null

  try {
    blogs = await getBlogs()
    featuredTourImage = await getFeaturedTourImage()
  } catch (err) {
    devError('Failed to load blogs:', err)
    error = err instanceof Error ? err.message : 'Failed to load blogs'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          {featuredTourImage ? (
            <SafeImage
              src={featuredTourImage}
              alt="Discover Ghana"
              fill
              className="object-cover"
              variant="hero"
              sizes="100vw"
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
              Discover <span className="text-yellow-300">Ghana</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto">
              Stories, insights, and guides to help you explore Ghana's rich culture, history, and natural beauty
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <PageBreadcrumbs items={[{ name: 'Blog' }]} />
        </div>
        {/* Error Message */}
        {error && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  Unable to Load Blogs
                </h2>
                <p className="text-red-600">
                  {error}. Please check your database connection and try again.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* All Blogs */}
        {!error && blogs.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                  All <span className="text-red-600">Articles</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore our complete collection of Ghana travel stories and guides
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="surface-card-interactive overflow-hidden group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {blog.featuredImage ? (
                        <SafeImage
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 opacity-90"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                      <div className="absolute top-4 left-4 flex gap-2 z-20">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {blog.category}
                        </span>
                        {blog.featured && (
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {blog.author}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {blog.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!error && blogs.length === 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No Blog Posts Available
              </h2>
              <p className="text-gray-600">
                We're currently updating our blog content. Please check back soon.
              </p>
            </div>
          </section>
        )}

        <section className="py-10 sm:py-14 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FaqSection title="Blog" items={BLOG_FAQ} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

