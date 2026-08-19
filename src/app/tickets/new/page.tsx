'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTicketPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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
        throw new Error('Failed to create ticket')
      }

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create New Ticket</h2>
          <p className="mt-1 text-sm text-slate-500">
            Please fill in the details below to open a new support ticket.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-base font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="customerName" className="block text-sm font-bold text-slate-800 tracking-wide uppercase mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                id="customerName"
                required
                className="block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-slate-50 hover:bg-white focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-bold text-slate-800 tracking-wide uppercase mb-2">
                Customer Email
              </label>
              <input
                type="email"
                name="customerEmail"
                id="customerEmail"
                required
                className="block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-slate-50 hover:bg-white focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-bold text-slate-800 tracking-wide uppercase mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              className="block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-slate-50 hover:bg-white focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-bold text-slate-800 tracking-wide uppercase mb-2">
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              defaultValue="Medium"
              className="block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-slate-50 hover:bg-white focus:bg-white transition-colors cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-slate-800 tracking-wide uppercase mb-2">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={5}
              required
              className="block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-slate-50 hover:bg-white focus:bg-white transition-colors resize-y"
            ></textarea>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-200 gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-3 px-6 border border-slate-300 rounded-xl shadow-sm text-base font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 border border-transparent rounded-xl shadow-md py-3 px-6 inline-flex justify-center text-base font-bold text-white hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
