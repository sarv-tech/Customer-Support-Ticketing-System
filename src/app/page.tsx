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

const priorityBadge: Record<string, string> = {
  Urgent: 'badge-urgent',
  High:   'badge-high',
  Medium: 'badge-medium',
  Low:    'badge-low',
}

const statusBadge: Record<string, string> = {
  Open:          'badge-open',
  'In Progress': 'badge-inprogress',
  Closed:        'badge-closed',
}

function StatCard({ label, value, icon, cls }: { label: string; value: number; icon: React.ReactNode; cls: string }) {
  return (
    <div className={`${cls} border rounded-xl p-4 transition-all hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-30">{icon}</div>
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
  const search        = resolvedParams.search   || ''
  const statusFilter  = resolvedParams.status   || ''
  const priorityFilter= resolvedParams.priority || ''
  const page          = Math.max(1, parseInt(resolvedParams.page || '1'))

  const whereClause: Prisma.TicketWhereInput = {}
  if (statusFilter)  whereClause.status   = statusFilter
  if (priorityFilter)whereClause.priority = priorityFilter
  if (search) {
    whereClause.OR = [
      { customerName:  { contains: search, mode: 'insensitive' } },
      { ticketId:      { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
      { subject:       { contains: search, mode: 'insensitive' } },
    ]
  }

  let allTickets: Ticket[] = []
  try {
    allTickets = await prisma.ticket.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } })
    allTickets.sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 99
      const pB = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 99
      return pA !== pB ? pA - pB : b.createdAt.getTime() - a.createdAt.getTime()
    })
  } catch (e) { console.error('DB error:', e) }

  const allForStats = await prisma.ticket.findMany().catch(() => [])
  const stats = {
    total:      allForStats.length,
    open:       allForStats.filter(t => t.status === 'Open').length,
    inProgress: allForStats.filter(t => t.status === 'In Progress').length,
    closed:     allForStats.filter(t => t.status === 'Closed').length,
    urgent:     allForStats.filter(t => t.priority === 'Urgent').length,
  }

  const totalPages = Math.max(1, Math.ceil(allTickets.length / PAGE_SIZE))
  const tickets    = allTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams()
    if (search)         params.set('search',   search)
    if (statusFilter)   params.set('status',   statusFilter)
    if (priorityFilter) params.set('priority', priorityFilter)
    if (p > 1)          params.set('page',     String(p))
    const q = params.toString()
    return q ? `/?${q}` : '/'
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Tickets Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {allTickets.length} ticket{allTickets.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm"
        >
          <span className="text-base leading-none">+</span>
          Create Ticket
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total"       value={stats.total}      icon={<Inbox className="h-6 w-6"/>}        cls="stat-blue" />
        <StatCard label="Open"        value={stats.open}       icon={<AlertCircle className="h-6 w-6"/>}  cls="stat-green" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="h-6 w-6"/>}        cls="stat-purple" />
        <StatCard label="Closed"      value={stats.closed}     icon={<CheckCircle className="h-6 w-6"/>}  cls="stat-slate" />
        <StatCard label="Urgent"      value={stats.urgent}     icon={<TrendingUp className="h-6 w-6"/>}   cls="stat-red" />
      </div>

      {/* Charts */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="t-card rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Status Breakdown
            </h2>
            <DonutChart data={[
              { label: 'Open',        value: stats.open,       color: '#10b981' },
              { label: 'In Progress', value: stats.inProgress, color: '#8b5cf6' },
              { label: 'Closed',      value: stats.closed,     color: '#64748b' },
            ]} />
          </div>
          <div className="t-card rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Priority Breakdown
            </h2>
            <BarChart data={[
              { label: 'Urgent', value: allForStats.filter(t => t.priority === 'Urgent').length, color: '#ef4444' },
              { label: 'High',   value: allForStats.filter(t => t.priority === 'High').length,   color: '#f97316' },
              { label: 'Medium', value: allForStats.filter(t => t.priority === 'Medium').length, color: '#3b82f6' },
              { label: 'Low',    value: allForStats.filter(t => t.priority === 'Low').length,    color: '#64748b' },
            ]} />
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <SearchFilters initialSearch={search} initialStatus={statusFilter} initialPriority={priorityFilter} />

      {/* Ticket List */}
      <div className="t-card rounded-xl overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-14 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'var(--bg-subtle)' }}>
              <Inbox className="h-7 w-7" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>No tickets found</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {search || statusFilter || priorityFilter
                ? 'Try adjusting your filters.'
                : 'Create your first ticket to get started.'}
            </p>
            {!search && !statusFilter && !priorityFilter && (
              <Link href="/tickets/new" className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all">
                + Create Ticket
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border)', background: 'var(--bg-card-header)' }}>
              <span>Ticket</span>
              <span>Opened</span>
            </div>

            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {tickets.map((ticket) => {
                const isOpen     = ticket.status === 'Open'
                const hoursOpen  = differenceInHours(new Date(), new Date(ticket.createdAt))
                const isSlaBreach= isOpen && hoursOpen > 24

                return (
                  <li key={ticket.id} className="group transition-colors duration-100" style={{ '--hover-bg': 'var(--bg-subtle)' } as React.CSSProperties}>
                    <Link
                      href={`/tickets/${ticket.ticketId}`}
                      className="block px-4 sm:px-5 py-4 hover:bg-[var(--bg-subtle)] transition-colors duration-100"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <code className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                              {ticket.ticketId}
                            </code>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${priorityBadge[ticket.priority]}`}>
                              {ticket.priority}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge[ticket.status]}`}>
                              {ticket.status}
                            </span>
                            {isSlaBreach && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/40 animate-pulse-ring">
                                <AlertCircle className="w-3 h-3" />SLA Breach
                              </span>
                            )}
                          </div>

                          {/* Subject */}
                          <h3 className="text-sm font-semibold truncate transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" style={{ color: 'var(--text-primary)' }}>
                            {ticket.subject}
                          </h3>

                          {/* Customer info */}
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{ticket.customerName}</span>
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-3 w-3" />{ticket.customerEmail}
                            </span>
                            <span className="hidden sm:inline">· {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400">
                          {format(new Date(ticket.createdAt), 'MMM d')}
                          <span className="ml-1">→</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-header)' }}>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Page <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{page}</span> of <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{totalPages}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  {page > 1 ? (
                    <Link href={buildPageUrl(page - 1)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all hover:bg-[var(--bg-subtle)]" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                      <ChevronLeft className="h-3.5 w-3.5" />Prev
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border opacity-40 cursor-not-allowed" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border)' }}>
                      <ChevronLeft className="h-3.5 w-3.5" />Prev
                    </span>
                  )}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                    return (
                      <Link key={p} href={buildPageUrl(p)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-all border ${p === page ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'hover:bg-[var(--bg-subtle)]'}`}
                        style={p === page ? {} : { color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
                      >
                        {p}
                      </Link>
                    )
                  })}
                  {page < totalPages ? (
                    <Link href={buildPageUrl(page + 1)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all hover:bg-[var(--bg-subtle)]" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                      Next<ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border opacity-40 cursor-not-allowed" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border)' }}>
                      Next<ChevronRight className="h-3.5 w-3.5" />
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
