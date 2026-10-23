'use client'

import { devError } from '@/lib/dev-log'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import Link from 'next/link'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ImageUpload } from '@/components/ImageUpload'
import { MultipleImageUpload } from '@/components/MultipleImageUpload'
import slugify from 'slugify'

export default function NewTourPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    durationDays: '',
    durationNights: '',
    regions: [] as string[],
    tourType: 'Culture & Heritage',
    highlights: [] as string[],
    itinerary: [] as any[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    hotels: [] as any[],
    pricePerPerson: '',
    singleSupplement: '',
    groupSizeMin: '',
    groupSizeMax: '',
    availableDates: [] as string[],
    featured: false,
    status: 'active',
    featuredImage: '',
    galleryImages: [] as string[],
    notes: '',
  })

  const [newHighlight, setNewHighlight] = useState('')
  const [newInclusion, setNewInclusion] = useState('')
  const [newExclusion, setNewExclusion] = useState('')
  const [newDate, setNewDate] = useState('')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = slugify(title, { lower: true, strict: true })
    setFormData({ ...formData, title, slug })
  }

  const addArrayItem = (field: string, value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field as keyof typeof formData] as string[]), value.trim()],
      })
      setter('')
    }
  }

  const removeArrayItem = (field: string, index: number) => {
    const arr = formData[field as keyof typeof formData] as string[]
    setFormData({
      ...formData,
      [field]: arr.filter((_, i) => i !== index),
    })
  }

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        {
          day: formData.itinerary.length + 1,
          title: '',
          activities: [],
          meals: 'B/L/D',
          accommodation: '',
        },
      ],
    })
  }

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const newItinerary = [...formData.itinerary]
    newItinerary[index] = { ...newItinerary[index], [field]: value }
    setFormData({ ...formData, itinerary: newItinerary })
  }

  const addHotel = () => {
    setFormData({
      ...formData,
      hotels: [
        ...formData.hotels,
        {
          name: '',
          location: '',
          nights: 0,
          checkIn: '',
          checkOut: '',
        },
      ],
    })
  }

  const updateHotel = (index: number, field: string, value: any) => {
    const newHotels = [...formData.hotels]
    newHotels[index] = { ...newHotels[index], [field]: value }
    setFormData({ ...formData, hotels: newHotels })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (loading) {
      return
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.tourType) {
      alert('Please fill in Tour Title, Description, and Tour Type')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const responseData = await res.json().catch(() => ({}))

      if (res.ok) {
        router.push('/admin/tours')
      } else {
        alert(responseData.error || 'Failed to create tour')
      }
    } catch (error) {
      devError('Error creating tour:', error)
      alert('Error creating tour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <Link
        href="/admin/tours"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Tours
      </Link>

      <div className="admin-surface p-8">
        <h1 className="admin-page-title mb-6">Create New Tour</h1>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="admin-section-title">Basic Information</h2>
            
            <div>
              <label className="admin-label">
                Tour Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="form-input"
              />
              {formData.slug && (
                <p className="mt-1 text-sm text-gray-500">Slug: {formData.slug}</p>
              )}
            </div>

            <div>
              <label className="admin-label">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Duration Days
                </label>
                <input
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="admin-label">
                  Duration Nights
                </label>
                <input
                  type="number"
                  value={formData.durationNights}
                  onChange={(e) => setFormData({ ...formData, durationNights: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">
                Tour Type *
              </label>
              <select
                value={formData.tourType}
                onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                required
                className="form-input"
              >
                <option value="Culture & Heritage">Culture & Heritage</option>
                <option value="Eco-Tourism">Eco-Tourism</option>
                <option value="Historical">Historical</option>
                <option value="Adventure">Adventure</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="admin-label">
                Regions (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Greater Accra, Ashanti, Central"
                value={formData.regions.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    regions: e.target.value.split(',').map((r) => r.trim()).filter(Boolean),
                  })
                }
                className="form-input"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <h2 className="admin-section-title">Highlights</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addArrayItem('highlights', newHighlight, setNewHighlight)
                  }
                }}
                placeholder="Add a highlight"
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => addArrayItem('highlights', newHighlight, setNewHighlight)}
                className="btn-muted px-4 py-2 min-h-0"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{highlight}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('highlights', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="admin-section-title">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Price Per Person
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerPerson}
                  onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="admin-label">
                  Single Supplement
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.singleSupplement}
                  onChange={(e) => setFormData({ ...formData, singleSupplement: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Min Group Size
                </label>
                <input
                  type="number"
                  value={formData.groupSizeMin}
                  onChange={(e) => setFormData({ ...formData, groupSizeMin: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="admin-label">
                  Max Group Size
                </label>
                <input
                  type="number"
                  value={formData.groupSizeMax}
                  onChange={(e) => setFormData({ ...formData, groupSizeMax: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="admin-section-title">Images</h2>
            <div>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(path) => setFormData({ ...formData, featuredImage: path })}
                category="tours"
                label="Featured Image"
              />
            </div>
            <div>
              <MultipleImageUpload
                images={formData.galleryImages}
                onChange={(images) => setFormData({ ...formData, galleryImages: images })}
                category="tours"
                label="Gallery Images"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h2 className="admin-section-title">Status</h2>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
              <div>
                <label className="admin-label">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="admin-label">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="form-input"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/tours"
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit()}
              className="btn-primary"
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                zIndex: 9999,
                position: 'relative',
              }}
            >
              {loading ? 'Creating...' : 'Create Tour'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

