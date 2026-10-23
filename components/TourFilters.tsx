'use client'

import { useState, useEffect } from 'react'

export interface TourFilterValues {
  search: string
  tourType: string
  region: string
}

interface TourFiltersProps {
  onFilterChange: (filters: TourFilterValues) => void
  initialFilters?: TourFilterValues
}

export function TourFilters({ onFilterChange, initialFilters }: TourFiltersProps) {
  const [search, setSearch] = useState(initialFilters?.search ?? '')
  const [tourType, setTourType] = useState(initialFilters?.tourType ?? '')
  const [region, setRegion] = useState(initialFilters?.region ?? '')

  useEffect(() => {
    if (!initialFilters) return
    setSearch(initialFilters.search)
    setTourType(initialFilters.tourType)
    setRegion(initialFilters.region)
  }, [initialFilters?.search, initialFilters?.tourType, initialFilters?.region])

  const handleFilterChange = () => {
    onFilterChange({
      search,
      tourType,
      region,
    })
  }

  const handleReset = () => {
    setSearch('')
    setTourType('')
    setRegion('')
    onFilterChange({
      search: '',
      tourType: '',
      region: '',
    })
  }

  return (
    <div className="surface-card p-4 sm:p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Tours</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              onFilterChange({ search: e.target.value, tourType, region })
            }}
            placeholder="Search tours..."
            className="form-input"
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
              onFilterChange({ search, tourType: e.target.value, region })
            }}
            className="form-input"
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
              onFilterChange({ search, tourType, region: e.target.value })
            }}
            className="form-input"
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
      </div>

      {(search || tourType || region) && (
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

