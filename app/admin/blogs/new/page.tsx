'use client'

import { devError } from '@/lib/dev-log'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import Link from 'next/link'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import slugify from 'slugify'
import { ImageUpload } from '@/components/ImageUpload'

export default function NewBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Tourism',
    tags: [] as string[],
    featuredImage: '',
    featured: false,
    published: false,
    author: 'TOURWORLD TOURISM',
  })

  const [newTag, setNewTag] = useState('')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = slugify(title, { lower: true, strict: true })
    setFormData({ ...formData, title, slug })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create blog')
      }
    } catch (error) {
      devError('Error creating blog:', error)
      alert('Error creating blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <Link
        href="/admin/blogs"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Blogs
      </Link>

      <div className="admin-surface p-8">
        <h1 className="admin-page-title mb-6">Create New Blog Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="admin-section-title">Basic Information</h2>
            
            <div>
              <label className="admin-label">
                Title *
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
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                rows={3}
                className="form-input"
                placeholder="A brief summary of the blog post..."
              />
            </div>

            <div>
              <label className="admin-label">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={15}
                className="form-input font-mono text-sm"
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="form-input"
                >
                  <option value="Tourism">Tourism</option>
                  <option value="Culture">Culture</option>
                  <option value="History">History</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Travel Tips">Travel Tips</option>
                </select>
              </div>
              <div>
                <label className="admin-label">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="admin-label">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Add a tag"
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-muted px-4 py-2 min-h-0"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h2 className="admin-section-title">Featured Image</h2>
            <ImageUpload
              value={formData.featuredImage}
              onChange={(path) => setFormData({ ...formData, featuredImage: path })}
              category="blogs"
              subfolder={formData.slug || 'general'}
              label="Featured Image"
            />
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
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/blogs"
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

