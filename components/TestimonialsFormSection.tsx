'use client'

import { TestimonialForm } from './TestimonialForm'

export function TestimonialsFormSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Share Your Experience
      </h3>
      <p className="text-gray-600 text-center mb-6">
        We'd love to hear about your journey with us!
      </p>
      <TestimonialForm />
    </div>
  )
}

