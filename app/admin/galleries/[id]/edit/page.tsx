'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import slugify from 'slugify'
import { MultipleImageUpload } from '@/components/MultipleImageUpload'

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    tourName: '',
    images: [] as string[],
    featuredImage: '',
    featured: false,
    published: true,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function getId() {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getId()
  }, [params])

  useEffect(() => {
    if (!id) return

    async function fetchGallery() {
      try {
        const res = await fetch(`/api/galleries/${id}`)
        if (res.ok) {
          const gallery = await res.json()
          setFormData({
            title: gallery.title,
            slug: gallery.slug,
            description: gallery.description || '',
            tourName: gallery.tourName,
            images: gallery.images || [],
            featuredImage: gallery.featuredImage || gallery.images[0] || '',
            featured: gallery.featured || false,
            published: gallery.published !== undefined ? gallery.published : true,
          })
        }
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setFetching(false)
      }
    }
    fetchGallery()
  }, [id])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = slugify(title, { lower: true, strict: true })
    setFormData({ ...formData, title, slug })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/galleries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/galleries')
      } else {
        alert('Failed to update gallery')
      }
    } catch (error) {
      console.error('Error updating gallery:', error)
      alert('Error updating gallery')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/galleries"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Galleries
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Gallery</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Name *
              </label>
              <input
                type="text"
                value={formData.tourName}
                onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <MultipleImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              featuredImage={formData.featuredImage}
              onFeaturedChange={(image) => setFormData({ ...formData, featuredImage: image })}
              category="galleries"
              subfolder={formData.slug || 'general'}
              label="Images"
              required
            />

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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || formData.images.length === 0}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Gallery'}
              </button>
              <Link
                href="/admin/galleries"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

