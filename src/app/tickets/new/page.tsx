'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      customer_name: formData.get('customerName'),
      customer_email: formData.get('customerEmail'),
      subject: formData.get('subject'),
      description: formData.get('description'),
      priority: formData.get('priority'),
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
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-emerald-50 border border-emerald-200 rounded-xl shadow-lg p-4 animate-slide-in-bottom">
          <p className="text-emerald-800 font-medium">{toast.message}</p>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create New Ticket</h2>
          <p className="mt-1 text-sm text-slate-500">Fill in the details below to open a new support ticket.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <span className="font-medium">Error:</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="customerName" className="block text-sm font-semibold text-slate-700">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                id="customerName"
                required
                placeholder="e.g. John Doe"
                className="mt-1.5 block w-full border border-slate-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-semibold text-slate-700">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="customerEmail"
                id="customerEmail"
                required
                placeholder="e.g. john@example.com"
                className="mt-1.5 block w-full border border-slate-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              placeholder="Brief summary of the issue"
              className="mt-1.5 block w-full border border-slate-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-slate-700">
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              defaultValue="Medium"
              className="mt-1.5 block w-full bg-white border border-slate-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              maxLength={MAX_CHARS}
              placeholder="Detailed description of the issue..."
              onChange={(e) => setCharCount(e.target.value.length)}
              className="mt-1.5 block w-full border border-slate-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow bg-slate-50 focus:bg-white"
            />
            <div className="flex justify-between mt-1.5 text-xs">
              <span className="text-slate-400">Required</span>
              <span className={charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-slate-400'}>
                {charCount}/{MAX_CHARS} characters
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto bg-white py-2.5 px-6 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 border border-transparent rounded-xl shadow-sm py-2.5 px-6 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
