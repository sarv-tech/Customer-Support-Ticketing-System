'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Copy, Check, X } from 'lucide-react'

type Note = { id: string; text: string; createdAt: string }

interface TicketActionsProps {
  ticketId: string
  currentStatus: string
  currentPriority: string
  notes: Note[]
}

export default function TicketActions({ ticketId, currentStatus, currentPriority, notes }: TicketActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating]     = useState(false)
  const [noteText, setNoteText]         = useState('')
  const [copied, setCopied]             = useState(false)
  const [toast, setToast]               = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [localStatus, setLocalStatus]   = useState(currentStatus)
  const [localPriority, setLocalPriority] = useState(currentPriority)
  const statusDebounceRef   = useRef<ReturnType<typeof setTimeout>>()
  const priorityDebounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => { setLocalStatus(currentStatus) },   [currentStatus])
  useEffect(() => { setLocalPriority(currentPriority) }, [currentPriority])

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
      router.refresh()
    } catch (err: unknown) {
      showToast(`❌ ${err instanceof Error ? err.message : 'Update failed'}`, 'error')
    } finally {
      setIsUpdating(false)
    }
  }

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

  const selectCls = "block w-full t-input rounded-lg py-2.5 px-3 text-sm cursor-pointer"
  const labelCls  = "block text-xs font-bold uppercase tracking-widest mb-2"

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 max-w-sm w-full border rounded-xl shadow-xl p-4 animate-slide-in-bottom ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/40'
            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/40'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <p className={`font-semibold text-sm ${toast.type === 'success' ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
              {toast.message}
            </p>
            <button onClick={() => setToast(null)} className="flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: 'var(--border)' }}>
        {/* Left: Notes */}
        <div className="lg:col-span-2 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className={labelCls} style={{ color: 'var(--text-tertiary)' }}>Internal Notes</h3>
            <button
              onClick={copyTicketId}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all hover:bg-[var(--bg-subtle)]"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : ticketId}
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {notes.length === 0 ? (
              <div className="text-center py-10 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-strong)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>No internal notes yet.</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)', opacity: 0.6 }}>Add a note below to track progress.</p>
              </div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="rounded-xl border p-4 transition-shadow hover:shadow-md"
                  style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Staff Note
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {note.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Note form */}
          <form onSubmit={e => { e.preventDefault(); if (noteText.trim()) handleUpdate({ notes: noteText }) }}
            className="pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            <textarea
              rows={3}
              className="block w-full t-input rounded-xl p-4 text-sm resize-y"
              placeholder="Type your internal note here..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              disabled={isUpdating}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating || !noteText.trim()}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500"
              >
                {isUpdating ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Management */}
        <div className="p-6 sm:p-8" style={{ background: 'var(--bg-card-header)' }}>
          <h3 className={labelCls} style={{ color: 'var(--text-tertiary)' }}>Ticket Management</h3>
          <div className="space-y-5">
            <div>
              <label className={labelCls} style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Status</label>
              <select value={localStatus} disabled={isUpdating} onChange={e => handleStatusChange(e.target.value)} className={selectCls}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>Saves automatically.</p>
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Priority</label>
              <select value={localPriority} disabled={isUpdating} onChange={e => handlePriorityChange(e.target.value)} className={selectCls}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>Saves automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
