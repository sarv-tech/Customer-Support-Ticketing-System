'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Ticket, Plus, ArrowRight, Keyboard, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TicketResult {
  ticketId: string
  subject: string
  customerName: string
  status: string
  priority: string
}

const statusColors: Record<string, string> = {
  Open:        'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
  'In Progress':'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
  Closed:      'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700',
}

const quickActions = [
  { id: 'new', label: 'Create new ticket', icon: Plus, action: '/tickets/new', shortcut: 'N' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TicketResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults([])
      setActiveIndex(0)
    }
  }, [open])

  // Search with debounce
  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/tickets?search=${encodeURIComponent(q)}&_limit=6`)
      if (!res.ok) return
      const data = await res.json()
      setResults(Array.isArray(data) ? data.slice(0, 6) : [])
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => search(query), 200)
    return () => clearTimeout(id)
  }, [query, search])

  // Keyboard navigation
  const totalItems = quickActions.length + results.length
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => (i + 1) % totalItems) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex((i) => (i - 1 + totalItems) % totalItems) }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (activeIndex < quickActions.length) {
          router.push(quickActions[activeIndex].action)
          setOpen(false)
        } else {
          const ticket = results[activeIndex - quickActions.length]
          if (ticket) { router.push(`/tickets/${ticket.ticketId}`); setOpen(false) }
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, activeIndex, results, totalItems, router])

  if (!open) return null

  return (
    <div className="palette-overlay animate-fade-in" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-xl mx-4 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700">
          <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
            placeholder="Search tickets or type a command..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none"
          />
          <div className="flex items-center gap-1.5">
            {loading && <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {/* Quick Actions */}
          {!query && (
            <div className="px-3 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 py-1">Quick Actions</p>
              {quickActions.map((action, i) => (
                <button
                  key={action.id}
                  onClick={() => { router.push(action.action); setOpen(false) }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    activeIndex === i
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeIndex === i ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded ${activeIndex === i ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    {action.shortcut}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {query && results.length === 0 && !loading && (
            <div className="py-10 text-center">
              <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No tickets found for "<span className="font-medium">{query}</span>"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="px-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 py-1">
                Tickets
              </p>
              {results.map((ticket, i) => {
                const idx = quickActions.length + i
                return (
                  <button
                    key={ticket.ticketId}
                    onClick={() => { router.push(`/tickets/${ticket.ticketId}`); setOpen(false) }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                      activeIndex === idx
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activeIndex === idx ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                      <Ticket className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-semibold ${activeIndex === idx ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {ticket.ticketId}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${activeIndex === idx ? 'bg-white/20 text-white' : statusColors[ticket.status]}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate leading-tight mt-0.5">{ticket.subject}</p>
                      <p className={`text-xs truncate ${activeIndex === idx ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                        {ticket.customerName}
                      </p>
                    </div>
                    <ArrowRight className={`h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-100 ${activeIndex === idx ? 'opacity-100' : ''}`} />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1"><kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-500 dark:text-slate-400">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-500 dark:text-slate-400">↵</kbd> select</span>
            <span className="flex items-center gap-1"><kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-500 dark:text-slate-400">Esc</kbd> close</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
            <Keyboard className="h-3 w-3" />
            <span>⌘K</span>
          </div>
        </div>
      </div>
    </div>
  )
}
