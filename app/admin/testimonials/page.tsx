'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { SafeImage } from '@/components/SafeImage'
import { StarIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Testimonial {
  id: string
  name: string
  email: string | null
  rating: number
  testimonial: string
  approved: boolean
  featured: boolean
  image: string | null
  createdAt: string
  tour: {
    title: string
  } | null
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchTestimonials()
  }, [filter])

  async function fetchTestimonials() {
    try {
      const url = filter === 'all' ? '/api/admin/testimonials' : `/api/admin/testimonials?approved=${filter === 'approved' ? 'true' : 'false'}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setTestimonials(data.testimonials || [])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateTestimonial(id: string, updates: { approved?: boolean; featured?: boolean }) {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchTestimonials()
      } else {
        alert('Failed to update testimonial')
      }
    } catch (error) {
      alert('Error updating testimonial')
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchTestimonials()
      } else {
        alert('Failed to delete testimonial')
      }
    } catch (error) {
      alert('Error deleting testimonial')
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-2">Manage customer testimonials</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/testimonials"
            target="_blank"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <EyeIcon className="h-5 w-5" />
            View Public Page
          </Link>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setLoading(true)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Testimonials</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No testimonials found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.image && (
                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      <SafeImage
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {!testimonial.approved && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-4">{testimonial.testimonial}</p>
              {testimonial.tour && (
                <p className="text-xs text-gray-500 mb-4">Tour: {testimonial.tour.title}</p>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  {!testimonial.approved && (
                    <button
                      onClick={() => updateTestimonial(testimonial.id, { approved: true })}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => updateTestimonial(testimonial.id, { featured: !testimonial.featured })}
                    className={`px-3 py-1 text-xs rounded ${
                      testimonial.featured
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {testimonial.featured ? 'Featured' : 'Feature'}
                  </button>
                </div>
                <button
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

