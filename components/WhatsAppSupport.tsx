'use client'

import { useState } from 'react'

export function WhatsAppSupport() {
  const [showTooltip, setShowTooltip] = useState(false)
  const phoneNumber = '233547783865'
  const message = encodeURIComponent('Hello! I am interested in booking a tour with Tourworld Tourism.')
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip */}
      <div 
        className={`bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl mb-3 text-sm font-semibold border border-green-100 transition-all duration-300 transform origin-bottom-right ${
          showTooltip ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        Chat with us on WhatsApp!
        <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-r border-b border-green-100 transform rotate-45"></div>
      </div>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group flex items-center justify-center relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp"
      >
        {/* Chat Icon */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
        </svg>

        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:hidden"></span>
      </a>
    </div>
  )
}

