'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow, format, differenceInHours } from 'date-fns'
import { AlertCircle, ArrowLeft, Copy, Check, X } from 'lucide-react'

type Ticket = {
  id: string
  ticketId: string
  customerName: string
  customerEmail: string
  subject: string
  description: string
  status: string
  priority: string
  createdAt: string
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
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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
      setToast({ message: '✅ Ticket updated successfully!', type: 'success' })
      setTimeout(() => setToast(null), 3000)
      await fetchTicket()
      router.refresh()
    } catch (err: any) {
      setToast({ message: `❌ ${err.message}`, type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticket?.ticketId || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-32 bg-slate-200 rounded"></div>
                <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
                <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
            <div className="h-6 w-2/3 bg-slate-200 rounded mt-4"></div>
            <div className="flex gap-6 mt-2">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto mt-8 animate-fade-in-up">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center shadow-sm">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p className="font-medium text-lg">{error || 'Ticket not found'}</p>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isOpen = ticket.status === 'Open'
  const hoursOpen = differenceInHours(new Date(), new Date(ticket.createdAt))
  const isSlaBreach = isOpen && hoursOpen > 24

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 max-w-sm w-full border rounded-xl shadow-lg p-4 animate-slide-in-bottom ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <p className={`font-medium ${toast.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
              {toast.message}
            </p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {ticket.ticketId}
                </h1>
                <button
                  onClick={copyTicketId}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Copy ID"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${priorityColors[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
              {isSlaBreach && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-red-800 border border-red-300 shadow-sm animate-pulse-ring">
                  <AlertCircle className="w-3.5 h-3.5" />
                  SLA Breach
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <span>Opened {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}</span>
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
            {ticket.subject}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm inline-flex">
            <div className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-0.5">From</span> 
              <span className="font-medium text-slate-800">{ticket.customerName}</span>
            </div>
            <div className="hidden sm:block w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-0.5">Email</span> 
              <span className="font-medium text-slate-800">{ticket.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Description</h3>
          <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] p-5 sm:p-6 rounded-xl border border-slate-200 shadow-inner">
            {ticket.description}
          </div>
        </div>

        {/* Actions & Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Activity & Notes */}
          <div className="lg:col-span-2 p-6 sm:p-8">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Internal Notes</h3>
            
            <div className="space-y-4 mb-6">
              {ticket.notes.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 text-sm font-medium">No internal notes yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Add a note below to keep track of progress.</p>
                </div>
              ) : (
                ticket.notes.map((note) => (
                  <div key={note.id} className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 shadow-sm relative hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-amber-800/60 uppercase tracking-wider">Staff Note</span>
                      <span className="text-xs text-amber-700/80 font-medium">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={(e) => {
              e.preventDefault()
              if (noteText.trim()) handleUpdate({ notes: noteText })
            }} className="mt-6 pt-6 border-t border-slate-100">
              <label htmlFor="noteText" className="sr-only">Add a note</label>
              <textarea
                id="noteText"
                rows={3}
                className="block w-full rounded-xl border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm p-4 placeholder-slate-400 bg-slate-50 hover:bg-white focus:bg-white transition-colors resize-y"
                placeholder="Type your internal note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={isUpdating}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating || !noteText.trim()}
                  className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-900 disabled:opacity-50 transition-all duration-200 inline-flex items-center gap-2"
                >
                  {isUpdating ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Update Status/Priority */}
          <div className="p-6 sm:p-8 bg-slate-50">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Ticket Management</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select
                  value={ticket.status}
                  disabled={isUpdating}
                  onChange={(e) => handleUpdate({ status: e.target.value })}
                  className="block w-full bg-white rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm py-2.5 px-3 transition-colors cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <select
                  value={ticket.priority}
                  disabled={isUpdating}
                  onChange={(e) => handleUpdate({ priority: e.target.value })}
                  className="block w-full bg-white rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm py-2.5 px-3 transition-colors cursor-pointer"
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
