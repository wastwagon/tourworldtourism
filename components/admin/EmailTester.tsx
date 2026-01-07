'use client'

import { useState } from 'react'

export function EmailTester() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [formData, setFormData] = useState({
    subject: 'Test Email from Admin',
    message: 'This is a test message to verify the email system is working correctly.'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@tourworldtourism.com',
          ...formData
        })
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: 'Test email sent successfully! Check your inbox.' })
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send test email.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
        <span className="mr-2">📧</span> Quick Email Test
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500 outline-none min-h-[60px]"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-xs font-bold text-white rounded transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </button>
      </form>

      {status && (
        <div className={`mt-3 p-2 rounded text-[11px] font-medium ${
          status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  )
}

