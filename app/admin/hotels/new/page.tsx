'use client'

import { devError } from '@/lib/dev-log'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ImageUpload } from '@/components/ImageUpload'

export default function NewHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    region: '',
    address: '',
    phone: '',
    rating: '',
    description: '',
    website: '',
    featuredImage: '',
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/hotels')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create hotel')
      }
    } catch (error) {
      devError('Error creating hotel:', error)
      alert('Error creating hotel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <Link
        href="/admin/hotels"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Hotels
      </Link>

      <div className="admin-surface p-8">
        <h1 className="admin-page-title mb-6">Add New Hotel</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="admin-section-title">Basic Information</h2>
            
            <div>
              <label className="admin-label">
                Hotel Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="admin-label">
                  Region *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  required
                  className="form-input"
                >
                  <option value="">Select Region</option>
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Central">Central</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Western">Western</option>
                  <option value="Volta">Volta</option>
                  <option value="Northern">Northern</option>
                  <option value="Upper East">Upper East</option>
                  <option value="Upper West">Upper West</option>
                  <option value="Brong Ahafo">Brong Ahafo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="admin-label">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 XX XXX XXXX"
                  className="form-input"
                />
              </div>
              <div>
                <label className="admin-label">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="4.5"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                className="form-input"
              />
            </div>

            <div>
              <label className="admin-label">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="form-input"
                placeholder="Describe the hotel, its amenities, and what makes it special..."
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h2 className="admin-section-title">Image</h2>
            <ImageUpload
              value={formData.featuredImage}
              onChange={(path) => setFormData({ ...formData, featuredImage: path })}
              category="hotels"
              subfolder={formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : 'general'}
              label="Featured Image"
            />
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h2 className="admin-section-title">Status</h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Featured Hotel</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/hotels"
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Hotel'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

