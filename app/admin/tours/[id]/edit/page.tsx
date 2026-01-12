'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import Link from 'next/link'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ImageUpload } from '@/components/ImageUpload'
import { MultipleImageUpload } from '@/components/MultipleImageUpload'
import slugify from 'slugify'

export default function EditTourPage() {
  const router = useRouter()
  const params = useParams()
  const tourId = params?.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    if (tourId) {
      fetchTour()
    }
  }, [tourId])

  async function fetchTour() {
    try {
      const res = await fetch(`/api/admin/tours/${tourId}`)
      if (res.ok) {
        const data = await res.json()
        const tour = data.tour
        setFormData({
          title: tour.title || '',
          slug: tour.slug || '',
          description: tour.description || '',
          durationDays: tour.durationDays?.toString() || '',
          durationNights: tour.durationNights?.toString() || '',
          regions: Array.isArray(tour.regions) ? tour.regions : [],
          tourType: tour.tourType || 'Culture & Heritage',
          highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
          itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
          inclusions: Array.isArray(tour.inclusions) ? tour.inclusions : [],
          exclusions: Array.isArray(tour.exclusions) ? tour.exclusions : [],
          hotels: Array.isArray(tour.hotels) ? tour.hotels : [],
          pricePerPerson: tour.pricePerPerson?.toString() || '',
          singleSupplement: tour.singleSupplement?.toString() || '',
          groupSizeMin: tour.groupSizeMin?.toString() || '',
          groupSizeMax: tour.groupSizeMax?.toString() || '',
          availableDates: Array.isArray(tour.availableDates) ? tour.availableDates : [],
          featured: tour.featured || false,
          status: tour.status || 'active',
          featuredImage: tour.featuredImage || '',
          galleryImages: Array.isArray(tour.galleryImages) ? tour.galleryImages : [],
          notes: tour.notes || '',
        })
      } else {
        alert('Failed to load tour')
        router.push('/admin/tours')
      }
    } catch (error) {
      console.error('Error fetching tour:', error)
      alert('Error loading tour')
      router.push('/admin/tours')
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Form submitted, tourId:', tourId)
    console.log('Form data:', formData)
    
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', res.status)
      const responseData = await res.json()
      console.log('Response data:', responseData)

      if (res.ok) {
        console.log('Tour updated successfully, redirecting...')
        router.push('/admin/tours')
      } else {
        console.error('Update failed:', responseData)
        alert(responseData.error || 'Failed to update tour')
        setSaving(false)
      }
    } catch (error: any) {
      console.error('Error updating tour:', error)
      alert(`Error updating tour: ${error.message || 'Unknown error'}`)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tour...</p>
          </div>
        </div>
      </AdminLayout>
    )
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

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Tour</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              {formData.slug && (
                <p className="mt-1 text-sm text-gray-500">Slug: {formData.slug}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration Days
                </label>
                <input
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration Nights
                </label>
                <input
                  type="number"
                  value={formData.durationNights}
                  onChange={(e) => setFormData({ ...formData, durationNights: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Type *
              </label>
              <select
                value={formData.tourType}
                onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="Culture & Heritage">Culture & Heritage</option>
                <option value="Eco-Tourism">Eco-Tourism</option>
                <option value="Historical">Historical</option>
                <option value="Adventure">Adventure</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Highlights</h2>
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => addArrayItem('highlights', newHighlight, setNewHighlight)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
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
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Per Person
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerPerson}
                  onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Single Supplement
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.singleSupplement}
                  onChange={(e) => setFormData({ ...formData, singleSupplement: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Group Size
                </label>
                <input
                  type="number"
                  value={formData.groupSizeMin}
                  onChange={(e) => setFormData({ ...formData, groupSizeMin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Group Size
                </label>
                <input
                  type="number"
                  value={formData.groupSizeMax}
                  onChange={(e) => setFormData({ ...formData, groupSizeMax: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Images</h2>
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
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Status</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/tours"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || loading}
              onClick={(e) => {
                console.log('Save button clicked, saving:', saving, 'loading:', loading)
                if (saving || loading) {
                  e.preventDefault()
                  console.log('Button disabled, preventing submit')
                }
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

