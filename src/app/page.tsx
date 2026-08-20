import Link from 'next/link'
import prisma from '@/lib/prisma'
import { type Prisma, type Ticket } from '@prisma/client'
import { formatDistanceToNow, differenceInHours, format } from 'date-fns'
import { AlertCircle, Inbox, Clock, CheckCircle, TrendingUp, ChevronLeft, ChevronRight, Mail } from 'lucide-react'
import SearchFilters from '@/components/SearchFilters'
import { DonutChart, BarChart } from '@/components/Charts'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PAGE_SIZE = 10
const PRIORITY_ORDER = { Urgent: 1, High: 2, Medium: 3, Low: 4 }

const priorityColors: Record<string, string> = {
  Urgent: 'bg-red-100 text-red-800 border-red-200',
  High:   'bg-orange-100 text-orange-800 border-orange-200',
  Medium: 'bg-blue-100 text-blue-800 border-blue-200',
  Low:    'bg-slate-100 text-slate-800 border-slate-200',
}

const statusColors: Record<string, string> = {
  Open:        'bg-emerald-100 text-emerald-800 border-emerald-200',
  'In Progress':'bg-purple-100 text-purple-800 border-purple-200',
  Closed:      'bg-slate-100 text-slate-600 border-slate-200',
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const bgColors: Record<string, string> = {
    blue:    'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    purple:  'bg-purple-50 border-purple-200 text-purple-700',
    slate:   'bg-slate-50 border-slate-200 text-slate-700',
    red:     'bg-red-50 border-red-200 text-red-700',
  }
  return (
    <div className={`${bgColors[color]} border rounded-xl p-4 transition-all hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-40">{icon}</div>
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
  const page = Math.max(1, parseInt(resolvedParams.page || '1'))

  const whereClause: Prisma.TicketWhereInput = {}
  if (statusFilter) whereClause.status = statusFilter
  if (priorityFilter) whereClause.priority = priorityFilter
  if (search) {
    whereClause.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { ticketId:     { contains: search, mode: 'insensitive' } },
      { customerEmail:{ contains: search, mode: 'insensitive' } },
      { subject:      { contains: search, mode: 'insensitive' } },
    ]
  }

  let allTickets: Ticket[] = []
  try {
    allTickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })
    allTickets.sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 99
      const pB = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 99
      if (pA !== pB) return pA - pB
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  } catch (error) {
    console.error('Database error:', error)
  }

  // Stats (always from all tickets)
  const allForStats = await prisma.ticket.findMany().catch(() => [])
  const stats = {
    total:      allForStats.length,
    open:       allForStats.filter((t) => t.status === 'Open').length,
    inProgress: allForStats.filter((t) => t.status === 'In Progress').length,
    closed:     allForStats.filter((t) => t.status === 'Closed').length,
    urgent:     allForStats.filter((t) => t.priority === 'Urgent').length,
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(allTickets.length / PAGE_SIZE))
  const tickets = allTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    if (priorityFilter) params.set('priority', priorityFilter)
    if (p > 1) params.set('page', String(p))
    const q = params.toString()
    return q ? `/?${q}` : '/'
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Tickets Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {allTickets.length} ticket{allTickets.length !== 1 ? 's' : ''} found
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Total"       value={stats.total}      icon={<Inbox className="h-6 w-6" />}        color="blue" />
        <StatCard label="Open"        value={stats.open}       icon={<AlertCircle className="h-6 w-6" />}  color="emerald" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="h-6 w-6" />}        color="purple" />
        <StatCard label="Closed"      value={stats.closed}     icon={<CheckCircle className="h-6 w-6" />}  color="slate" />
        <StatCard label="Urgent"      value={stats.urgent}     icon={<TrendingUp className="h-6 w-6" />}   color="red" />
      </div>

      {/* Charts */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Status Breakdown</h2>
            <DonutChart
              data={[
                { label: 'Open',        value: stats.open,       color: '#10b981' },
                { label: 'In Progress', value: stats.inProgress, color: '#8b5cf6' },
                { label: 'Closed',      value: stats.closed,     color: '#94a3b8' },
              ]}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Priority Breakdown</h2>
            <BarChart
              data={[
                { label: 'Urgent', value: allForStats.filter(t => t.priority === 'Urgent').length, color: '#ef4444' },
                { label: 'High',   value: allForStats.filter(t => t.priority === 'High').length,   color: '#f97316' },
                { label: 'Medium', value: allForStats.filter(t => t.priority === 'Medium').length, color: '#3b82f6' },
                { label: 'Low',    value: allForStats.filter(t => t.priority === 'Low').length,    color: '#94a3b8' },
              ]}
            />
          </div>
        </div>
      )}

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
          <>
            <ul className="divide-y divide-slate-200">
              {tickets.map((ticket) => {
                const isOpen = ticket.status === 'Open'
                const hoursOpen = differenceInHours(new Date(), new Date(ticket.createdAt))
                const isSlaBreach = isOpen && hoursOpen > 24

                return (
                  <li key={ticket.id} className="group hover:bg-slate-50 transition-all duration-150">
                    <Link href={`/tickets/${ticket.ticketId}`} className="block p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {ticket.ticketId}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[ticket.priority]}`}>
                              {ticket.priority}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[ticket.status]}`}>
                              {ticket.status}
                            </span>
                            {isSlaBreach && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse-ring">
                                <AlertCircle className="w-3 h-3" />
                                SLA Breach
                              </span>
                            )}
                          </div>

                          {/* Subject */}
                          <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {ticket.subject}
                          </h3>

                          {/* Customer info — email prominently shown */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{ticket.customerName}</span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Mail className="h-3 w-3" />
                              {ticket.customerEmail}
                            </span>
                            <span className="text-slate-300 hidden sm:inline">•</span>
                            <span className="hidden sm:inline">
                              Opened {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                            </span>
                            <span className="text-slate-400 hidden md:inline">
                              · {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                          View →
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500">
                  Page <span className="font-medium text-slate-700">{page}</span> of{' '}
                  <span className="font-medium text-slate-700">{totalPages}</span>
                  &nbsp;·&nbsp;{allTickets.length} total
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 ? (
                    <Link
                      href={buildPageUrl(page - 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Prev
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-200 rounded-lg cursor-not-allowed bg-slate-50">
                      <ChevronLeft className="h-3.5 w-3.5" /> Prev
                    </span>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                      return (
                        <Link
                          key={p}
                          href={buildPageUrl(p)}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-all ${
                            p === page
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {p}
                        </Link>
                      )
                    })}
                  </div>

                  {page < totalPages ? (
                    <Link
                      href={buildPageUrl(page + 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all"
                    >
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-200 rounded-lg cursor-not-allowed bg-slate-50">
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
