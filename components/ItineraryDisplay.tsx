'use client'

interface ItineraryDay {
  day: number
  title: string
  date?: string
  activities: string[]
  meals?: string
  accommodation?: string
}

interface ItineraryDisplayProps {
  itinerary: ItineraryDay[]
  tourTitle: string
}

export function ItineraryDisplay({ itinerary, tourTitle }: ItineraryDisplayProps) {
  if (!itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Itinerary</h2>
        <p className="text-xs sm:text-sm text-gray-600">Itinerary details coming soon.</p>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Complete Itinerary</h2>
        <p className="text-xs sm:text-sm text-gray-600">Day-by-day breakdown of your {tourTitle} experience</p>
      </div>

      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {itinerary.map((day, index) => (
          <div
            key={index}
            className="relative pl-6 sm:pl-8 pb-4 sm:pb-6 border-l-2 sm:border-l-4 border-red-600 last:border-l-0 last:pb-0"
          >
            {/* Day Number Badge */}
            <div className="absolute -left-4 sm:-left-5 md:-left-6 top-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base shadow-md">
                {day.day || index + 1}
              </div>
            </div>

            {/* Day Content */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
              {/* Day Title */}
              <div className="mb-2 sm:mb-3">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1">{day.title}</h3>
              </div>

              {/* Activities */}
              {day.activities && day.activities.length > 0 && (
                <div className="mb-2 sm:mb-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                    Activities
                  </h4>
                  <ul className="space-y-1 sm:space-y-1.5">
                    {day.activities.map((activity, actIdx) => (
                      <li key={actIdx} className="flex items-start text-xs sm:text-sm text-gray-700">
                        <span className="text-yellow-500 mr-2 sm:mr-2.5 mt-0.5 flex-shrink-0">•</span>
                        <span className="flex-1 leading-relaxed">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meals and Accommodation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-200">
                {day.meals && (
                  <div className="flex items-start">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">Meals:</span>
                      <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-600">
                        {day.meals === 'B' ? 'Breakfast' :
                         day.meals === 'L' ? 'Lunch' :
                         day.meals === 'D' ? 'Dinner' :
                         day.meals === 'B/L' ? 'Breakfast & Lunch' :
                         day.meals === 'B/D' ? 'Breakfast & Dinner' :
                         day.meals === 'L/D' ? 'Lunch & Dinner' :
                         day.meals === 'B/L/D' ? 'Breakfast, Lunch & Dinner' :
                         day.meals}
                      </span>
                    </div>
                  </div>
                )}
                {day.accommodation && (
                  <div className="flex items-start">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">Accommodation:</span>
                      <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-600">{day.accommodation}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

