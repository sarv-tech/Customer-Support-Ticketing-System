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
  const [search,   setSearch]   = useState(initialSearch)
  const [status,   setStatus]   = useState(initialStatus)
  const [priority, setPriority] = useState(initialPriority)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams()
      if (search)   params.set('search',   search)
      if (status)   params.set('status',   status)
      if (priority) params.set('priority', priority)
      router.push(`/?${params.toString()}`)
    }, 300)
    return () => clearTimeout(id)
  }, [search, status, priority, router])

  const hasFilters = search || status || priority
  const activeCount = [search, status, priority].filter(Boolean).length

  const clearFilters = () => { setSearch(''); setStatus(''); setPriority('') }

  const selectCls = "w-full py-2.5 px-3 t-input rounded-lg text-sm cursor-pointer"

  return (
    <div className="t-card rounded-xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, name, email, or subject..."
            className="w-full pl-9 pr-8 py-2.5 t-input rounded-lg text-sm"
            aria-label="Search tickets"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Filter toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-expanded={isFilterOpen}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold rounded-lg border transition-all ${
              isFilterOpen || hasFilters
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'hover:bg-[var(--bg-subtle)]'
            }`}
            style={isFilterOpen || hasFilters ? {} : { color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="text-[10px] font-bold bg-white/30 text-white px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </button>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2.5 text-sm font-medium rounded-lg border transition-all hover:bg-[var(--bg-subtle)]"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Expanded filters */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 transition-all duration-200 overflow-hidden ${
        isFilterOpen ? 'max-h-40 opacity-100 pt-1' : 'max-h-0 opacity-0'
      }`}>
        <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls} aria-label="Filter by status">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className={selectCls} aria-label="Filter by priority">
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
