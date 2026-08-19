'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'

interface SearchFiltersProps {
  initialSearch: string
  initialStatus: string
  initialPriority: string
}

export default function SearchFilters({ initialSearch, initialStatus, initialPriority }: SearchFiltersProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [priority, setPriority] = useState(initialPriority)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      if (priority) params.set('priority', priority)
      router.push(`/?${params.toString()}`)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [search, status, priority, router])

  const hasFilters = search || status || priority

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setPriority('')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email, or description..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-slate-50 focus:bg-white"
            aria-label="Search tickets"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              isFilterOpen || hasFilters
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
            aria-expanded={isFilterOpen}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-0.5">
                {[search, status, priority].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-200 overflow-hidden ${
          isFilterOpen ? 'max-h-48 opacity-100 pt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  )
}
