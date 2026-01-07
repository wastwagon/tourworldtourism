import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminLayout } from '@/components/AdminLayout'
import Link from 'next/link'
import { EmailTester } from '@/components/admin/EmailTester'

async function getDashboardStats() {
  const [tours, bookings, inquiries, testimonials, subscribers, hotels, blogs, galleries] = await Promise.all([
    prisma.tour.count(),
    prisma.booking.count(),
    prisma.contactInquiry.count(),
    prisma.testimonial.count(),
    prisma.newsletter.count(),
    prisma.hotel.count(),
    prisma.blog.count(),
    prisma.gallery.count(),
  ])

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      tour: {
        select: {
          title: true,
        },
      },
    },
  })

  const pendingInquiries = await prisma.contactInquiry.count({
    where: {
      status: 'unread',
    },
  })

  const pendingTestimonials = await prisma.testimonial.count({
    where: {
      approved: false,
    },
  })

  const confirmedBookings = await prisma.booking.count({
    where: {
      status: 'confirmed',
    },
  })

  const totalRevenue = await prisma.booking.aggregate({
    where: {
      status: 'confirmed',
    },
    _sum: {
      totalPrice: true,
    },
  })

  return {
    tours,
    bookings,
    inquiries,
    testimonials,
    subscribers,
    hotels,
    blogs,
    galleries,
    recentBookings,
    pendingInquiries,
    pendingTestimonials,
    confirmedBookings,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login')
  }

  const stats = await getDashboardStats()

  return (
    <AdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session.user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.tours}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
            </div>
            <Link href="/admin/tours" className="text-sm text-red-600 hover:text-red-700 mt-2 inline-block">
              Manage Tours →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.bookings}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.confirmedBookings} confirmed</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <Link href="/admin/bookings" className="text-sm text-red-600 hover:text-red-700 mt-2 inline-block">
              View Bookings →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contact Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inquiries}</p>
                {stats.pendingInquiries > 0 && (
                  <p className="text-sm text-red-600 mt-1">{stats.pendingInquiries} pending</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✉️</span>
              </div>
            </div>
            <Link href="/admin/inquiries" className="text-sm text-red-600 hover:text-red-700 mt-2 inline-block">
              View Inquiries →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Testimonials</p>
                <p className="text-3xl font-bold text-gray-900">{stats.testimonials}</p>
                {stats.pendingTestimonials > 0 && (
                  <p className="text-sm text-red-600 mt-1">{stats.pendingTestimonials} pending</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <Link href="/admin/testimonials" className="text-sm text-red-600 hover:text-red-700 mt-2 inline-block">
              Manage Testimonials →
            </Link>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Hotels</p>
            <p className="text-2xl font-bold text-gray-900">{stats.hotels}</p>
            <Link href="/admin/hotels" className="text-xs text-red-600 hover:text-red-700 mt-1 inline-block">
              Manage →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Blogs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.blogs}</p>
            <Link href="/admin/blogs" className="text-xs text-red-600 hover:text-red-700 mt-1 inline-block">
              Manage →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Galleries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.galleries}</p>
            <Link href="/admin/galleries" className="text-xs text-red-600 hover:text-red-700 mt-1 inline-block">
              Manage →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Newsletter Subscribers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.subscribers}</p>
          </div>
        </div>

        {/* Recent Bookings and Email Tester */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-sm text-red-600 hover:text-red-700">
                View All →
              </Link>
            </div>
            {stats.recentBookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">{booking.tour.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Email System Status</h2>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm font-semibold text-green-800">SMTP Active</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Host: host17.registrar-servers.com</p>
              </div>
              <EmailTester />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/tours/new" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-red-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">➕ New Tour</h3>
            <p className="text-sm text-gray-600">Create a new tour package</p>
          </Link>
          <Link href="/admin/blogs/new" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-red-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">➕ New Blog</h3>
            <p className="text-sm text-gray-600">Write a new blog post</p>
          </Link>
          <Link href="/admin/hotels/new" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-red-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">➕ New Hotel</h3>
            <p className="text-sm text-gray-600">Add a new hotel</p>
          </Link>
          <Link href="/admin/galleries/new" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-red-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">➕ New Gallery</h3>
            <p className="text-sm text-gray-600">Create a photo gallery</p>
          </Link>
        </div>
      </AdminLayout>
  )
}

