'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Copy, Check, X, Activity, Flag, Tag } from 'lucide-react'

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
  const statusDebounceRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const priorityDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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

  async function handleDelete() {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE' })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to delete ticket')
      }
      showToast('✅ Ticket deleted permanently', 'success')
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 500)
    } catch (err: unknown) {
      showToast(`❌ ${err instanceof Error ? err.message : 'Delete failed'}`, 'error')
      setIsUpdating(false)
    }
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
              notes.map((note, index) => {
                const isSystem = note.text.startsWith('[SYSTEM]')
                const rawText = isSystem ? note.text.replace('[SYSTEM]', '').trim() : note.text

                // Simple parser for **bold** text
                const formattedText = rawText.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                  part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="font-semibold text-slate-800 dark:text-slate-200">{part.slice(2, -2)}</strong> : part
                )

                let Icon = null
                if (isSystem) {
                  if (rawText.toLowerCase().includes('priority')) Icon = Flag
                  else if (rawText.toLowerCase().includes('status')) Icon = Activity
                  else Icon = Tag
                }

                return (
                  <div key={note.id} className="relative flex gap-4">
                    {/* Timeline vertical line */}
                    {index !== notes.length - 1 && (
                      <div className="absolute left-[1.4rem] top-10 bottom-[-1.5rem] w-px bg-slate-200 dark:bg-slate-700 z-0"></div>
                    )}
                    
                    {/* Avatar / Icon */}
                    <div className="relative z-10 flex-shrink-0 mt-1">
                      {isSystem ? (
                        <div className="w-11 h-11 rounded-full flex items-center justify-center border-[3px] border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 text-slate-500 shadow-sm">
                          {Icon && <Icon className="w-4 h-4" />}
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full flex items-center justify-center border-[3px] border-white dark:border-slate-950 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs shadow-sm">
                          SN
                        </div>
                      )}
                    </div>
                    
                    {/* Content Card */}
                    <div className={`flex-1 rounded-xl border p-4 transition-shadow hover:shadow-md mb-3 ${isSystem ? 'bg-transparent border-dashed' : ''}`}
                      style={{ background: isSystem ? 'transparent' : 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSystem ? 'text-slate-500 dark:text-slate-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {isSystem ? 'System Audit' : 'Staff Note'}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isSystem ? 'italic text-slate-500 dark:text-slate-400' : 'whitespace-pre-wrap'}`} style={isSystem ? {} : { color: 'var(--text-primary)' }}>
                        {formattedText}
                      </p>
                    </div>
                  </div>
                )
              })
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

            <div className="pt-5 mt-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <h3 className={labelCls} style={{ color: 'var(--text-tertiary)' }}>Danger Zone</h3>
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 p-4 bg-red-50/50 dark:bg-red-950/20">
                <p className="text-xs text-red-800 dark:text-red-400 mb-3 font-medium">
                  Once you delete a ticket, there is no going back. Please be certain.
                </p>
                <button
                  disabled={isUpdating}
                  onClick={() => {
                    if (window.confirm('Are you absolutely sure you want to delete this ticket? This action cannot be undone.')) {
                      handleDelete()
                    }
                  }}
                  className="w-full py-2 px-3 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                >
                  Delete Ticket
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
