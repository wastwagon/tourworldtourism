import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import { SectionHeader } from './SectionHeader'
import { SafeImage } from './SafeImage'

async function getFeaturedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
        featured: true,
      },
      take: 3,
      orderBy: {
        publishedAt: 'desc',
      },
    })
    // Ensure proper serialization for Next.js server-to-client component passing
    return JSON.parse(JSON.stringify(blogs))
  } catch (error) {
    console.error('Error fetching featured blogs:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return []
  }
}

export async function FeaturedBlogs() {
  const blogs = await getFeaturedBlogs()

  if (blogs.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Latest from Our"
          titleHighlight="Blog"
          subtitle="Discover Ghana through our travel stories, guides, and insights"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                  <span className="flex items-center">
                    <UserIcon className="h-3 w-3 mr-1" />
                    {blog.author}
                  </span>
                  {blog.publishedAt && (
                    <span className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <span className="text-sm font-semibold text-red-600 group-hover:text-red-700">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            View All Blog Posts
          </Link>
        </div>
      </div>
    </section>
  )
}

