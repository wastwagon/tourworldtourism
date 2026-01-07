'use client'

import { useState } from 'react'
import { 
  CalendarIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface BookingFormProps {
  tourId?: string
  tourTitle?: string
}

export function BookingForm({ tourId, tourTitle }: BookingFormProps) {
  const [formData, setFormData] = useState({
    tourId: tourId || '',
    customerName: '',
    email: '',
    phone: '',
    numberOfPeople: 5,
    preferredStartDate: '',
    specialRequests: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          numberOfPeople: parseInt(formData.numberOfPeople.toString()),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit booking')
      }

      setSubmitStatus('success')
      setFormData({
        tourId: tourId || '',
        customerName: '',
        email: '',
        phone: '',
        numberOfPeople: 1,
        preferredStartDate: '',
        specialRequests: '',
      })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
      {tourTitle && (
        <div className="relative bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 border-l-4 border-red-600 p-4 sm:p-5 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Booking for:</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight">{tourTitle}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="customerName" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
          <UserGroupIcon className="w-4 h-4 mr-1.5 text-red-600" />
          Full Name *
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          required
          value={formData.customerName}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm sm:text-base"
          placeholder="Enter your full name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="email" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
            <EnvelopeIcon className="w-4 h-4 mr-1.5 text-red-600" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm sm:text-base"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
            <PhoneIcon className="w-4 h-4 mr-1.5 text-red-600" />
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm sm:text-base"
            placeholder="+233 XX XXX XXXX"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="numberOfPeople" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
            <UserGroupIcon className="w-4 h-4 mr-1.5 text-red-600" />
            Number of People (Min. 5) *
          </label>
          <input
            type="number"
            id="numberOfPeople"
            name="numberOfPeople"
            min="5"
            required
            value={formData.numberOfPeople}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm sm:text-base"
            placeholder="5"
          />
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Perfect for families and small groups</p>
        </div>

        <div>
          <label htmlFor="preferredStartDate" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
            <CalendarIcon className="w-4 h-4 mr-1.5 text-red-600" />
            Preferred Travel Date
          </label>
          <input
            type="text"
            id="preferredStartDate"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm sm:text-base"
            placeholder="e.g. Summer 2026 or Any time"
          />
        </div>
      </div>

      <div>
        <label htmlFor="specialRequests" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
          <DocumentTextIcon className="w-4 h-4 mr-1.5 text-red-600" />
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          rows={4}
          value={formData.specialRequests}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm sm:text-base resize-none"
          placeholder="Any dietary requirements, accessibility needs, or special requests..."
        />
      </div>

      {submitStatus === 'success' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg p-4 shadow-sm">
          <div className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm sm:text-base font-semibold text-green-900">Booking submitted successfully!</p>
              <p className="text-xs sm:text-sm text-green-700 mt-1">We'll contact you shortly to confirm your booking.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-600 rounded-lg p-4 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm sm:text-base font-semibold text-red-900">Error submitting booking</p>
              <p className="text-xs sm:text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit Booking Request'
        )}
      </button>
    </form>
  )
}

