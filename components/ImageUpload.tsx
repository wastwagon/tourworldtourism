'use client'

import { useState, useRef } from 'react'
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { SafeImage } from './SafeImage'

interface ImageUploadProps {
  value: string
  onChange: (path: string) => void
  category?: string // 'tours', 'galleries', 'hotels', 'blogs'
  subfolder?: string // optional subfolder
  label?: string
  required?: boolean
}

export function ImageUpload({
  value,
  onChange,
  category = 'general',
  subfolder = '',
  label = 'Image',
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)
      if (subfolder) {
        formData.append('subfolder', subfolder)
      }

      // Use public upload endpoint for testimonials, admin endpoint for everything else
      const uploadEndpoint = category === 'testimonials' ? '/api/upload' : '/api/admin/upload'
      
      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        console.log('Upload successful:', data)
        if (!data.path) {
          console.error('Upload response missing path:', data)
          setError('Upload succeeded but no image path was returned')
          setPreview(null)
          return
        }
        onChange(data.path)
        setPreview(null) // Clear preview since we have the actual path
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Upload failed:', res.status, errorData)
        const errorMessage = errorData.error || errorData.details || 'Failed to upload image'
        setError(errorMessage)
        setPreview(null)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Upload Area */}
      <div className="space-y-4">
        {/* File Input */}
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
                PNG, JPG, WEBP, GIF up to 10MB
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

        {/* Preview or Current Image */}
        {(preview || value) && (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
              <SafeImage
                src={preview || value}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                title="Remove image"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {value && !preview && (
              <p className="text-xs text-gray-500 mt-2 truncate">{value}</p>
            )}
          </div>
        )}

        {/* Manual URL Input (Fallback) */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Or enter image URL manually:
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/galleries/tour-name/image.jpg"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

