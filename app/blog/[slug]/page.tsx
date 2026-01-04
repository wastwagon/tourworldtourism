import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SafeImage } from '@/components/SafeImage'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'

async function getBlog(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    })
    return blog
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "Blog Post Not Found - TOURWORLD TOURISM",
    }
  }

  return {
    title: `${blog.title} - TOURWORLD TOURISM`,
    description: blog.excerpt,
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog || !blog.published) {
    notFound()
  }

  // Convert markdown-style content to HTML (simple conversion)
  const htmlContent = blog.content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
  
  const formattedContent = `<p>${htmlContent}</p>`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Image */}
      <div className="relative h-96">
        {blog.featuredImage ? (
          <>
            <SafeImage
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600"></div>
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-white opacity-90 text-xs sm:text-sm">
              <span className="flex items-center">
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                {blog.author}
              </span>
              {blog.publishedAt && (
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              <span className="bg-white/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                {blog.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Excerpt */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed italic border-l-4 border-red-600 pl-3 sm:pl-4 md:pl-6">
              {blog.excerpt}
            </p>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-8 flex-wrap">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Blog Content */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 lg:p-12 prose prose-sm sm:prose-base md:prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: formattedContent }}
              className="blog-content"
            />
          </div>

          {/* Related Blogs */}
          <div className="mt-6 sm:mt-8 lg:mt-12 bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Continue Reading</h2>
            <Link
              href="/blog"
              className="inline-block bg-red-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-red-700 transition-colors"
            >
              View All Blog Posts
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

