'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    try {
      const res = await fetch('/api/admin/inquiries')
      if (res.ok) {
        const data = await res.json()
        setInquiries(data.inquiries || [])
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        fetchInquiries()
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status })
        }
      } else {
        alert('Failed to update inquiry')
      }
    } catch (error) {
      alert('Error updating inquiry')
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
        <p className="text-gray-600 mt-2">Manage customer inquiries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No inquiries found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Inquiries ({inquiries.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {inquiries.map((inquiry) => (
                  <button
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedInquiry?.id === inquiry.id ? 'bg-red-50 border-l-4 border-red-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{inquiry.subject}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {inquiry.status === 'unread' && (
                        <span className="ml-2 w-2 h-2 bg-red-600 rounded-full"></span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedInquiry.subject}</h2>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">From:</span> {selectedInquiry.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {selectedInquiry.email}
                    </p>
                    {selectedInquiry.phone && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {selectedInquiry.phone}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Message</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

