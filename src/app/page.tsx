import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatDistanceToNow, differenceInHours, format } from 'date-fns'
import { AlertCircle, Inbox, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import SearchFilters from '@/components/SearchFilters'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PRIORITY_ORDER = { Urgent: 1, High: 2, Medium: 3, Low: 4 }

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

// Stat Card Component (inline for simplicity)
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }

  return (
    <div className={`${bgColors[color]} border rounded-xl p-4 transition-all hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
    </div>
  )
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
      { subject: { contains: search, mode: 'insensitive' } },
    ]
  }

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
    console.error('Database error:', error)
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    closed: tickets.filter((t) => t.status === 'Closed').length,
    urgent: tickets.filter((t) => t.priority === 'Urgent').length,
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Tickets Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
        >
          <span className="text-lg leading-none">+</span>
          Create Ticket
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Total" value={stats.total} icon={<Inbox className="h-5 w-5" />} color="blue" />
        <StatCard label="Open" value={stats.open} icon={<AlertCircle className="h-5 w-5" />} color="emerald" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="h-5 w-5" />} color="purple" />
        <StatCard label="Closed" value={stats.closed} icon={<CheckCircle className="h-5 w-5" />} color="slate" />
        <StatCard label="Urgent" value={stats.urgent} icon={<TrendingUp className="h-5 w-5" />} color="red" />
      </div>

      {/* Search & Filters */}
      <SearchFilters initialSearch={search} initialStatus={statusFilter} initialPriority={priorityFilter} />

      {/* Ticket List */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Inbox className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No tickets found</h3>
            <p className="text-slate-500 mt-1">
              {search || statusFilter || priorityFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Create your first ticket to get started.'}
            </p>
            {!search && !statusFilter && !priorityFilter && (
              <Link
                href="/tickets/new"
                className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
              >
                <span className="text-lg">+</span>
                Create Ticket
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {tickets.map((ticket) => {
              const isOpen = ticket.status === 'Open'
              const hoursOpen = differenceInHours(new Date(), new Date(ticket.createdAt))
              const isSlaBreach = isOpen && hoursOpen > 24

              return (
                <li
                  key={ticket.id}
                  className="group hover:bg-slate-50 transition-all duration-200"
                >
                  <Link href={`/tickets/${ticket.ticketId}`} className="block p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-sm font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {ticket.ticketId}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[ticket.priority]}`}
                          >
                            {ticket.priority}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[ticket.status]}`}
                          >
                            {ticket.status}
                          </span>
                          {isSlaBreach && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse-ring">
                              <AlertCircle className="w-3 h-3" />
                              SLA Breach
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {ticket.subject}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-700">{ticket.customerName}</span>
                          <span className="text-slate-300">•</span>
                          <span>Opened {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                          <span className="text-slate-300 hidden sm:inline">•</span>
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">View →</span>
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
