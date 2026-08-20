'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewTicketPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const MAX_CHARS = 500

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const data = {
      customer_name:  formData.get('customerName'),
      customer_email: formData.get('customerEmail'),
      subject:        formData.get('subject'),
      description:    formData.get('description'),
      priority:       formData.get('priority'),
    }
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create ticket')
      }
      setToast({ message: '✅ Ticket created successfully!', type: 'success' })
      setTimeout(() => { router.push('/dashboard'); router.refresh() }, 1000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  const inputCls = "mt-1.5 block w-full t-input rounded-xl py-2.5 px-4 text-sm"
  const labelCls = "block text-sm font-semibold"

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 max-w-sm w-full border rounded-xl shadow-lg p-4 animate-slide-in-bottom ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/40'
            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/40'
        }`}>
          <p className={`font-semibold text-sm ${toast.type === 'success' ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
            {toast.message}
          </p>
        </div>
      )}

      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="t-card rounded-2xl overflow-hidden">
        {/* Card header */}
        <div className="t-card-header px-6 py-5">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Create New Ticket
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Fill in the details below to open a new support ticket.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              <span className="font-bold mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="customerName" className={labelCls} style={{ color: 'var(--text-secondary)' }}>
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="customerName" id="customerName" required
                placeholder="e.g. John Doe" className={inputCls} />
            </div>
            <div>
              <label htmlFor="customerEmail" className={labelCls} style={{ color: 'var(--text-secondary)' }}>
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input type="email" name="customerEmail" id="customerEmail" required
                placeholder="e.g. john@example.com" className={inputCls} />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className={labelCls} style={{ color: 'var(--text-secondary)' }}>
              Subject <span className="text-red-500">*</span>
            </label>
            <input type="text" name="subject" id="subject" required
              placeholder="Brief summary of the issue" className={inputCls} />
          </div>

          <div>
            <label htmlFor="priority" className={labelCls} style={{ color: 'var(--text-secondary)' }}>
              Priority
            </label>
            <select name="priority" id="priority" defaultValue="Medium" className={inputCls + ' cursor-pointer'}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelCls} style={{ color: 'var(--text-secondary)' }}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea name="description" id="description" rows={4} required
              maxLength={MAX_CHARS}
              placeholder="Detailed description of the issue..."
              onChange={e => setCharCount(e.target.value.length)}
              className={inputCls + ' resize-y'} />
            <div className="flex justify-between mt-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>Required</span>
              <span className={charCount > MAX_CHARS * 0.9 ? 'text-red-500' : ''}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-[var(--bg-subtle)]"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
