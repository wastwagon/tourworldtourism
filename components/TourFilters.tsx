'use client'

import { useState } from 'react'

interface TourFiltersProps {
  onFilterChange: (filters: {
    search: string
    tourType: string
    region: string
    minPrice: number
    maxPrice: number
    tourStatus: string
  }) => void
}

export function TourFilters({ onFilterChange }: TourFiltersProps) {
  const [search, setSearch] = useState('')
  const [tourType, setTourType] = useState('')
  const [region, setRegion] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [tourStatus, setTourStatus] = useState('')

  const handleFilterChange = () => {
    onFilterChange({
      search,
      tourType,
      region,
      minPrice: minPrice ? parseInt(minPrice) : 0,
      maxPrice: maxPrice ? parseInt(maxPrice) : 10000,
      tourStatus,
    })
  }

  const handleReset = () => {
    setSearch('')
    setTourType('')
    setRegion('')
    setMinPrice('')
    setMaxPrice('')
    setTourStatus('')
    onFilterChange({
      search: '',
      tourType: '',
      region: '',
      minPrice: 0,
      maxPrice: 10000,
      tourStatus: '',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Tours</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleFilterChange()
            }}
            placeholder="Search tours..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>

        {/* Tour Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Type
          </label>
          <select
            value={tourType}
            onChange={(e) => {
              setTourType(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="Culture & Heritage">Culture & Heritage</option>
            <option value="Eco-Tourism">Eco-Tourism</option>
            <option value="Historical">Historical</option>
            <option value="Adventure">Adventure</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            <option value="">All Regions</option>
            <option value="Greater Accra">Greater Accra</option>
            <option value="Ashanti">Ashanti</option>
            <option value="Central">Central</option>
            <option value="Eastern">Eastern</option>
            <option value="Western">Western</option>
            <option value="Volta">Volta</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($)
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value)
              handleFilterChange()
            }}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price ($)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value)
              handleFilterChange()
            }}
            placeholder="10000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>

        {/* Tour Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Status
          </label>
          <select
            value={tourStatus}
            onChange={(e) => {
              setTourStatus(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            <option value="">All Tours</option>
            <option value="upcoming">Upcoming Tours</option>
            <option value="past">Past Tours</option>
          </select>
        </div>
      </div>

      {(search || tourType || region || minPrice || maxPrice || tourStatus) && (
        <div className="mt-4">
          <button
            onClick={handleReset}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

