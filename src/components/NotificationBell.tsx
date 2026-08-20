'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, AlertCircle, ExternalLink, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface BreachTicket {
  ticketId: string
  subject: string
  customerName: string
  hoursOpen: number
  priority: string
}

interface NotificationBellProps {
  breachTickets: BreachTicket[]
}

export default function NotificationBell({ breachTickets }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const visible = breachTickets.filter((t) => !dismissed.has(t.ticketId))
  const count = visible.length

  const priorityDot: Record<string, string> = {
    Urgent: 'bg-red-500',
    High:   'bg-orange-500',
    Medium: 'bg-blue-500',
    Low:    'bg-slate-400',
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${count > 0 ? ` (${count} SLA breaches)` : ''}`}
        className={`relative p-2 rounded-xl transition-all duration-150 ${
          open
            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
      >
        <Bell className={`h-5 w-5 transition-transform ${open ? 'rotate-12' : ''}`} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border-2 border-white dark:border-slate-800 animate-fade-in">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden animate-slide-down z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                SLA Breach Alerts
              </span>
              {count > 0 && (
                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </div>
            {count > 0 && (
              <button
                onClick={() => setDismissed(new Set(breachTickets.map((t) => t.ticketId)))}
                className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium transition-colors"
                title="Dismiss all"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Dismiss all
              </button>
            )}
          </div>

          {/* Ticket list */}
          <div className="max-h-80 overflow-y-auto">
            {visible.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                  <CheckCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">All clear!</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">No SLA breaches right now.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {visible.map((ticket) => (
                  <li key={ticket.ticketId} className="group">
                    <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                      {/* Priority dot */}
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[ticket.priority] || 'bg-slate-400'}`} />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{ticket.ticketId}</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight mt-0.5">
                          {ticket.subject}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {ticket.customerName} &middot;{' '}
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {ticket.hoursOpen}h overdue
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Link
                          href={`/tickets/${ticket.ticketId}`}
                          onClick={() => setOpen(false)}
                          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                          title="View ticket"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => setDismissed((s) => new Set([...s, ticket.ticketId]))}
                          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {visible.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <Link
                href="/?status=Open"
                onClick={() => setOpen(false)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold transition-colors"
              >
                View all open tickets →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
