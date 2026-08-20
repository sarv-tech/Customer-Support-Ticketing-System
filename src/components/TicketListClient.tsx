'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow, differenceInHours, format } from 'date-fns'
import { AlertCircle, Mail, Trash2, CheckCircle2 } from 'lucide-react'
import type { Ticket } from '@prisma/client'

const priorityBadge: Record<string, string> = {
  Urgent: 'badge-urgent',
  High:   'badge-high',
  Medium: 'badge-medium',
  Low:    'badge-low',
}

const statusBadge: Record<string, string> = {
  Open:          'badge-open',
  'In Progress': 'badge-inprogress',
  Closed:        'badge-closed',
}

export default function TicketListClient({ tickets }: { tickets: Ticket[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isUpdating, setIsUpdating] = useState(false)

  const allSelected = tickets.length > 0 && selectedIds.size === tickets.length

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(tickets.map(t => t.ticketId)))
    }
  }

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleBulkUpdate = async (updates: { status?: string; priority?: string }) => {
    if (!window.confirm(`Are you sure you want to update ${selectedIds.size} tickets?`)) return
    setIsUpdating(true)
    try {
      const res = await fetch('/api/tickets/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds: Array.from(selectedIds), ...updates })
      })
      if (res.ok) {
        setSelectedIds(new Set())
        router.refresh()
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${selectedIds.size} tickets permanently?`)) return
    setIsUpdating(true)
    try {
      const res = await fetch('/api/tickets/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds: Array.from(selectedIds) })
      })
      if (res.ok) {
        setSelectedIds(new Set())
        router.refresh()
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[auto_1fr_auto] gap-4 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border-b items-center" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border)', background: 'var(--bg-card-header)' }}>
        <input 
          type="checkbox" 
          checked={allSelected} 
          onChange={toggleAll}
          className="rounded border-gray-300 w-3.5 h-3.5 cursor-pointer accent-blue-600"
        />
        <span>Ticket</span>
        <span>Opened</span>
      </div>

      <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {tickets.map((ticket) => {
          const isOpen     = ticket.status === 'Open'
          const hoursOpen  = differenceInHours(new Date(), new Date(ticket.createdAt))
          const isSlaBreach= isOpen && hoursOpen > 12
          const isSelected = selectedIds.has(ticket.ticketId)

          return (
            <li key={ticket.id} className={`group transition-colors duration-100 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`} style={isSelected ? {} : { '--hover-bg': 'var(--bg-subtle)' } as React.CSSProperties}>
              <div
                onClick={() => router.push(`/tickets/${ticket.ticketId}`)}
                className="flex px-4 sm:px-5 py-4 hover:bg-[var(--bg-subtle)] transition-colors duration-100 cursor-pointer"
              >
                {/* Checkbox column */}
                <div className="mr-4 flex-shrink-0 pt-1" onClick={e => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleSelect(ticket.ticketId, e as any)}
                    className="rounded border-gray-300 w-4 h-4 cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex-1 flex items-start justify-between gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <code className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                        {ticket.ticketId}
                      </code>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${priorityBadge[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      {isSlaBreach && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/40 animate-pulse-ring">
                          <AlertCircle className="w-3 h-3" />SLA Breach
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <h3 className="text-sm font-semibold truncate transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" style={{ color: 'var(--text-primary)' }}>
                      {ticket.subject}
                    </h3>

                    {/* Customer info */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{ticket.customerName}</span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />{ticket.customerEmail}
                      </span>
                      <span className="hidden sm:inline">· {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400">
                    {format(new Date(ticket.createdAt), 'MMM d')}
                    <span className="ml-1">→</span>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Bulk Action Bar */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-2 pl-4 flex items-center gap-4 transition-all duration-300 ${selectedIds.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <span className="text-sm font-semibold whitespace-nowrap bg-blue-600 px-2 py-1 rounded-md">
          {selectedIds.size} selected
        </span>
        
        <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
          <select 
            disabled={isUpdating}
            className="bg-slate-800 border border-slate-700 rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => {
              if (e.target.value) {
                handleBulkUpdate({ status: e.target.value })
                e.target.value = ""
              }
            }}
          >
            <option value="">Set Status...</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          <select 
            disabled={isUpdating}
            className="bg-slate-800 border border-slate-700 rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => {
              if (e.target.value) {
                handleBulkUpdate({ priority: e.target.value })
                e.target.value = ""
              }
            }}
          >
            <option value="">Set Priority...</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          
          <div className="w-px h-6 bg-slate-700 mx-1"></div>

          <button 
            disabled={isUpdating}
            onClick={handleBulkDelete}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950 rounded-lg transition-colors"
            title="Delete Selected"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
