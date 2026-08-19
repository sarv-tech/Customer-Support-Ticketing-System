import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatDistanceToNow, differenceInHours } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import SearchFilters from '@/components/SearchFilters'

// Allow passing dynamic search params to this page
export const dynamic = 'force-dynamic'

const PRIORITY_ORDER = {
  Urgent: 1,
  High: 2,
  Medium: 3,
  Low: 4,
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams
  const search = resolvedParams.search || ''
  const statusFilter = resolvedParams.status || ''
  const priorityFilter = resolvedParams.priority || ''

  const whereClause: any = {}
  if (statusFilter) whereClause.status = statusFilter
  if (priorityFilter) whereClause.priority = priorityFilter
  if (search) {
    whereClause.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { ticketId: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Fallback if DB doesn't exist yet, we catch the error to prevent full crash
  let tickets: any[] = []
  try {
    tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    tickets.sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 99
      const pB = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 99
      if (pA !== pB) return pA - pB
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  } catch (error) {
    console.error("Database connection failed or not setup:", error)
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tickets Overview</h1>
      </div>

      {/* Filters & Search Form */}
      <SearchFilters 
        initialSearch={search} 
        initialStatus={statusFilter} 
        initialPriority={priorityFilter} 
      />

      {/* Tickets List */}
      <div className="bg-white shadow-md border border-slate-200 rounded-2xl overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-16 text-center text-slate-500 font-medium text-lg">
            No tickets found. Please adjust your filters or create a new ticket.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {tickets.map((ticket) => {
              const isOpen = ticket.status === 'Open'
              const hoursOpen = differenceInHours(new Date(), new Date(ticket.createdAt))
              const isSlaBreach = isOpen && hoursOpen > 24

              return (
                <li key={ticket.id} className="group hover:bg-blue-50/50 transition-colors duration-200">
                  <Link href={`/tickets/${ticket.ticketId}`} className="block p-5 sm:px-8">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <p className="text-sm font-bold text-slate-700 tracking-wide uppercase">
                            {ticket.ticketId}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${priorityColors[ticket.priority]}`}>
                            {ticket.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${statusColors[ticket.status]}`}>
                            {ticket.status}
                          </span>
                          {isSlaBreach && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide bg-red-100 text-red-800 border border-red-300 shadow-sm animate-pulse">
                              <AlertCircle className="w-3.5 h-3.5" />
                              SLA Breach
                            </span>
                          )}
                        </div>
                        <p className="text-xl font-bold text-slate-900 truncate mb-1.5 group-hover:text-blue-700 transition-colors">
                          {ticket.subject}
                        </p>
                        <p className="text-sm text-slate-600 truncate flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{ticket.customerName}</span>
                          <span className="text-slate-300">•</span>
                          Opened {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="hidden sm:block flex-shrink-0 transform group-hover:translate-x-1 transition-transform duration-200">
                        <span className="text-sm text-blue-600 font-bold flex items-center gap-1">
                          View details <span className="text-lg">&rarr;</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
