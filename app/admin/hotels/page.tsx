'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import Link from 'next/link'
import { SafeImage } from '@/components/SafeImage'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

interface Hotel {
  id: string
  name: string
  location: string
  region: string
  rating: number | null
  featured: boolean
  featuredImage: string | null
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHotels()
  }, [])

  async function fetchHotels() {
    try {
      const res = await fetch('/api/admin/hotels')
      if (res.ok) {
        const data = await res.json()
        setHotels(data.hotels || [])
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteHotel(id: string) {
    if (!confirm('Are you sure you want to delete this hotel?')) return
    try {
      const res = await fetch(`/api/admin/hotels/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchHotels()
      } else {
        alert('Failed to delete hotel')
      }
    } catch (error) {
      alert('Error deleting hotel')
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotels Management</h1>
          <p className="text-gray-600 mt-2">Manage hotel listings</p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Hotel
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No hotels found.</p>
          <Link
            href="/admin/hotels/new"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Add Your First Hotel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48">
                <SafeImage
                  src={hotel.featuredImage}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
                {hotel.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{hotel.location}, {hotel.region}</p>
                {hotel.rating && (
                  <p className="text-sm text-gray-600 mb-4">Rating: {hotel.rating}/5</p>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/hotels/${hotel.id}/edit`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteHotel(hotel.id)}
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

