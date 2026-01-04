'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { ImageUpload } from './ImageUpload'

interface TestimonialFormProps {
  tourId?: string
  tourTitle?: string
  onSuccess?: () => void
}

export function TestimonialForm({ tourId, tourTitle, onSuccess }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    testimonial: '',
    image: '',
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.rating || !formData.testimonial) {
      setSubmitStatus('error')
      setErrorMessage('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tourId: tourId || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit testimonial')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        rating: 0,
        testimonial: '',
        image: '',
      })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {tourTitle && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Sharing feedback for:</span> {tourTitle}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              {(hoveredRating >= star || formData.rating >= star) ? (
                <StarIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
          {formData.rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {formData.rating} out of 5
            </span>
          )}
        </div>
        {!formData.rating && (
          <p className="mt-1 text-xs text-red-600">Please select a rating</p>
        )}
      </div>

      <div>
        <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review *
        </label>
        <textarea
          id="testimonial"
          name="testimonial"
          rows={6}
          required
          value={formData.testimonial}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          placeholder="Share your experience with us..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Your testimonial will be reviewed before being published.
        </p>
      </div>

      <div>
        <ImageUpload
          value={formData.image}
          onChange={(path) => setFormData({ ...formData, image: path })}
          category="testimonials"
          label="Your Photo (Optional)"
        />
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Thank you for your testimonial!</p>
          <p className="text-sm mt-1">
            Your review has been submitted and will be reviewed before being published.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error submitting testimonial</p>
          <p className="text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || formData.rating === 0}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
      </button>
    </form>
  )
}

