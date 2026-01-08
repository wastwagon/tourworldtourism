'use client'

import { useState, useRef } from 'react'
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline'
import { SafeImage } from './SafeImage'

interface MultipleImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  featuredImage?: string
  onFeaturedChange?: (path: string) => void
  category?: string
  subfolder?: string
  label?: string
  required?: boolean
}

export function MultipleImageUpload({
  images,
  onChange,
  featuredImage,
  onFeaturedChange,
  category = 'general',
  subfolder = '',
  label = 'Images',
  required = false,
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate all files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only JPEG, PNG, WEBP, and GIF are allowed.`)
        return
      }
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`)
        return
      }
    }

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)
        if (subfolder) {
          formData.append('subfolder', subfolder)
        }

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Upload failed:', res.status, errorData)
          throw new Error(errorData.error || `Upload failed with status ${res.status}`)
        }

        const data = await res.json()
        console.log('Upload successful:', data)
        
        if (!data.path) {
          console.error('Upload response missing path:', data)
          throw new Error('Upload response missing image path')
        }
        
        return data.path
      })

      const uploadedPaths = await Promise.all(uploadPromises)
      console.log('All uploads completed. Paths:', uploadedPaths)
      
      const newImages = [...images, ...uploadedPaths]
      console.log('Updating images array. Total:', newImages.length)
      onChange(newImages)

      // Set first uploaded image as featured if no featured image exists
      if (onFeaturedChange && !featuredImage && uploadedPaths.length > 0) {
        console.log('Setting featured image:', uploadedPaths[0])
        onFeaturedChange(uploadedPaths[0])
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
    
    // If removed image was featured, set first remaining as featured
    if (onFeaturedChange && featuredImage === images[index] && newImages.length > 0) {
      onFeaturedChange(newImages[0])
    } else if (onFeaturedChange && newImages.length === 0) {
      onFeaturedChange('')
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
            uploading
              ? 'border-blue-400 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            multiple
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="text-center">
              <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                <span className="text-red-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP, GIF up to 10MB (multiple files supported)
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <SafeImage
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {/* Featured Badge */}
                  {featuredImage === image && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove image"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  {/* Set as Featured Button */}
                  {onFeaturedChange && featuredImage !== image && (
                    <button
                      type="button"
                      onClick={() => onFeaturedChange(image)}
                      className="absolute bottom-2 left-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Set Featured
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Manual URL Input (Fallback) */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Or add image URL manually:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const input = e.currentTarget as HTMLInputElement
                  if (input.value.trim() && !images.includes(input.value.trim())) {
                    const newImages = [...images, input.value.trim()]
                    onChange(newImages)
                    if (onFeaturedChange && !featuredImage) {
                      onFeaturedChange(input.value.trim())
                    }
                    input.value = ''
                  }
                }
              }}
              placeholder="/images/galleries/tour-name/image.jpg"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                if (input.value.trim() && !images.includes(input.value.trim())) {
                  const newImages = [...images, input.value.trim()]
                  onChange(newImages)
                  if (onFeaturedChange && !featuredImage) {
                    onFeaturedChange(input.value.trim())
                  }
                  input.value = ''
                }
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              Add URL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

