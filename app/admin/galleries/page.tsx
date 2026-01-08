'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import { SafeImage } from '@/components/SafeImage'
import { PhotoIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Gallery {
  id: string
  title: string
  slug: string
  description: string | null
  tourName: string
  images: string[]
  featuredImage: string | null
  featured: boolean
  published: boolean
}

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchGalleries()
  }, [])

  async function fetchGalleries() {
    try {
      const res = await fetch('/api/admin/galleries')
      if (!res.ok) {
        throw new Error('Failed to fetch galleries')
      }
      const data = await res.json()
      setGalleries(data)
    } catch (error) {
      console.error('Error fetching galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteGallery(id: string) {
    if (!confirm('Are you sure you want to delete this gallery?')) return

    try {
      const res = await fetch(`/api/galleries/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchGalleries()
      }
    } catch (error) {
      console.error('Error deleting gallery:', error)
    }
  }

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <Link
            href="/admin/galleries/new"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Gallery
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading galleries...</p>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No galleries found.</p>
            <Link
              href="/admin/galleries/new"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              Create Your First Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <div key={gallery.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <SafeImage
                    src={gallery.featuredImage || gallery.images[0]}
                    alt={gallery.title}
                    fill
                    className="object-cover"
                  />
                  {!gallery.published && (
                    <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Draft
                    </div>
                  )}
                  {gallery.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{gallery.tourName}</p>
                  <p className="text-xs text-gray-500 mb-4">{gallery.images.length} images</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/galleries/${gallery.id}/edit`}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteGallery(gallery.id)}
                      className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </AdminLayout>
  )
}

