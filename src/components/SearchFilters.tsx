'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchFilters({
  initialSearch,
  initialStatus,
  initialPriority,
}: {
  initialSearch: string
  initialStatus: string
  initialPriority: string
}) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [priority, setPriority] = useState(initialPriority)

  useEffect(() => {
    // Debounce search so it works as you type without spamming requests
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      if (priority) params.set('priority', priority)
      
      router.push(`/?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, status, priority, router])

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200 flex flex-col md:flex-row gap-5 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, name, email, or description..."
          className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 hover:bg-white focus:bg-white"
        />
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full md:w-44 py-3 px-4 border border-slate-300 bg-slate-50 hover:bg-white rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="block w-full md:w-44 py-3 px-4 border border-slate-300 bg-slate-50 hover:bg-white rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
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
