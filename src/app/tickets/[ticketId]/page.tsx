'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'

type Ticket = {
  id: string
  ticket_id: string
  customer_name: string
  customer_email: string
  subject: string
  description: string
  status: string
  priority: string
  created_at: string
  notes: Note[]
}

type Note = {
  id: string
  text: string
  createdAt: string
}

const priorityColors: Record<string, string> = {
  Urgent: 'bg-red-100 text-red-800 border-red-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Medium: 'bg-blue-100 text-blue-800 border-blue-200',
  Low: 'bg-slate-100 text-slate-800 border-slate-200',
}

const statusColors: Record<string, string> = {
  Open: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function TicketDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.ticketId as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isUpdating, setIsUpdating] = useState(false)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  async function fetchTicket() {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`)
      if (!res.ok) throw new Error('Ticket not found')
      const data = await res.json()
      setTicket(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(updates: { status?: string; priority?: string; notes?: string }) {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update ticket')
      
      setNoteText('')
      await fetchTicket() // Reload data
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading ticket details...</div>
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
          {error || 'Ticket not found'}
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{ticket.ticket_id}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
            </div>
            <div className="text-sm text-slate-500">
              Opened {format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{ticket.subject}</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-slate-600">
            <div><span className="font-medium text-slate-700">From:</span> {ticket.customer_name}</div>
            <div><span className="font-medium text-slate-700">Email:</span> {ticket.customer_email}</div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Description</h3>
          <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
            {ticket.description}
          </div>
        </div>

        {/* Actions & Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Activity & Notes */}
          <div className="lg:col-span-2 p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Internal Notes</h3>
            
            <div className="space-y-6 mb-8">
              {ticket.notes.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No internal notes yet.</p>
              ) : (
                ticket.notes.map((note) => (
                  <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm relative">
                    <div className="absolute top-4 right-4 text-xs text-yellow-600 font-medium">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </div>
                    <p className="text-sm text-yellow-900 whitespace-pre-wrap pr-20">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={(e) => {
              e.preventDefault()
              if (noteText.trim()) handleUpdate({ notes: noteText })
            }}>
              <div className="mt-2">
                <textarea
                  rows={3}
                  className="block w-full rounded-xl border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 placeholder-slate-400"
                  placeholder="Add a new internal note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating || !noteText.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Update Status/Priority */}
          <div className="p-6 sm:p-8 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Manage Ticket</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Update Status</label>
                <select
                  value={ticket.status}
                  disabled={isUpdating}
                  onChange={(e) => handleUpdate({ status: e.target.value })}
                  className="block w-full bg-white rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Update Priority</label>
                <select
                  value={ticket.priority}
                  disabled={isUpdating}
                  onChange={(e) => handleUpdate({ priority: e.target.value })}
                  className="block w-full bg-white rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
