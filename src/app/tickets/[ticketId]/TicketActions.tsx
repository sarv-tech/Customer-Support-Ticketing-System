'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Copy, Check, X } from 'lucide-react'

type Note = {
  id: string
  text: string
  createdAt: string
}

interface TicketActionsProps {
  ticketId: string
  currentStatus: string
  currentPriority: string
  notes: Note[]
}

export default function TicketActions({
  ticketId,
  currentStatus,
  currentPriority,
  notes,
}: TicketActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Fix 11: Local optimistic state for selects — synced back from server after refresh
  const [localStatus, setLocalStatus] = useState(currentStatus)
  const [localPriority, setLocalPriority] = useState(currentPriority)

  // Sync local state when server re-renders with new props (after router.refresh())
  useEffect(() => { setLocalStatus(currentStatus) }, [currentStatus])
  useEffect(() => { setLocalPriority(currentPriority) }, [currentPriority])

  // Fix 11: Debounce refs — prevent accidental saves on fast changes
  const statusDebounceRef = useRef<ReturnType<typeof setTimeout>>()
  const priorityDebounceRef = useRef<ReturnType<typeof setTimeout>>()

  async function handleUpdate(updates: { status?: string; priority?: string; notes?: string }) {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to update ticket')
      }
      setNoteText('')
      showToast('✅ Ticket updated successfully!', 'success')
      router.refresh() // Re-runs the Server Component to get fresh data
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      showToast(`❌ ${msg}`, 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  // Fix 11: 600ms debounce — user has time to adjust without firing multiple requests
  function handleStatusChange(value: string) {
    setLocalStatus(value)
    clearTimeout(statusDebounceRef.current)
    statusDebounceRef.current = setTimeout(() => handleUpdate({ status: value }), 600)
  }

  function handlePriorityChange(value: string) {
    setLocalPriority(value)
    clearTimeout(priorityDebounceRef.current)
    priorityDebounceRef.current = setTimeout(() => handleUpdate({ priority: value }), 600)
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function copyTicketId() {
    navigator.clipboard.writeText(ticketId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-sm w-full border rounded-xl shadow-lg p-4 animate-slide-in-bottom ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <p
              className={`font-medium ${
                toast.type === 'success' ? 'text-emerald-800' : 'text-red-800'
              }`}
            >
              {toast.message}
            </p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 ml-3">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Notes */}
        <div className="lg:col-span-2 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              Internal Notes
            </h3>
            <button
              onClick={copyTicketId}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors"
              title="Copy Ticket ID"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied!' : ticketId}
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {notes.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm font-medium">No internal notes yet.</p>
                <p className="text-slate-400 text-xs mt-1">
                  Add a note below to keep track of progress.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-800/60 uppercase tracking-wider">
                      Staff Note
                    </span>
                    <span className="text-xs text-amber-700/80 font-medium">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">
                    {note.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Note Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (noteText.trim()) handleUpdate({ notes: noteText })
            }}
            className="mt-6 pt-6 border-t border-slate-100"
          >
            <label htmlFor="noteText" className="sr-only">
              Add a note
            </label>
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

        {/* Right Column: Status / Priority Management */}
        <div className="p-6 sm:p-8 bg-slate-50">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">
            Ticket Management
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={localStatus}
                disabled={isUpdating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="block w-full bg-white rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm py-2.5 px-3 transition-colors cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <p className="text-xs text-slate-400 mt-1.5">Saves automatically after a moment.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
              <select
                value={localPriority}
                disabled={isUpdating}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="block w-full bg-white rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm py-2.5 px-3 transition-colors cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              <p className="text-xs text-slate-400 mt-1.5">Saves automatically after a moment.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
