import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { format, differenceInHours } from 'date-fns'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import TicketActions from './TicketActions'

export const dynamic = 'force-dynamic'

const priorityBadge: Record<string, string> = {
  Urgent: 'badge-urgent', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low',
}
const statusBadge: Record<string, string> = {
  Open: 'badge-open', 'In Progress': 'badge-inprogress', Closed: 'badge-closed',
}

export default async function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params
  const ticket = await prisma.ticket.findUnique({
    where: { ticketId },
    include: { notes: { orderBy: { createdAt: 'asc' } } },
  })
  if (!ticket) notFound()

  const isOpen = ticket.status === 'Open'
  const hoursOpen = differenceInHours(new Date(), ticket.createdAt)
  const isSlaBreach = isOpen && hoursOpen > 24

  const serializedNotes = ticket.notes.map(n => ({
    id: n.id, text: n.text, createdAt: n.createdAt.toISOString(),
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in-up">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: 'var(--text-tertiary)' }}>
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="t-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="t-card-header px-6 sm:px-8 py-6 sm:py-7">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-mono" style={{ color: 'var(--text-primary)' }}>
                {ticket.ticketId}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${priorityBadge[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${statusBadge[ticket.status]}`}>
                {ticket.status}
              </span>
              {isSlaBreach && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/40 animate-pulse-ring">
                  <AlertCircle className="w-3.5 h-3.5" /> SLA Breach
                </span>
              )}
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Opened {format(ticket.createdAt, 'MMM d, yyyy HH:mm')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-5 leading-snug" style={{ color: 'var(--text-primary)' }}>
            {ticket.subject}
          </h2>

          {/* Customer info strip */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-tertiary)' }}>From</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ticket.customerName}</p>
            </div>
            <div className="hidden sm:block w-px" style={{ background: 'var(--border)' }} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Email</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{ticket.customerEmail}</p>
            </div>
            <div className="hidden sm:block w-px" style={{ background: 'var(--border)' }} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Last Updated</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {format(ticket.updatedAt, 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 sm:px-8 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>Description</h3>
          <div className="text-sm leading-relaxed whitespace-pre-wrap p-5 rounded-xl border" style={{ color: 'var(--text-primary)', background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            {ticket.description}
          </div>
        </div>

        {/* Actions — Client Component */}
        <TicketActions
          ticketId={ticket.ticketId}
          currentStatus={ticket.status}
          currentPriority={ticket.priority}
          notes={serializedNotes}
        />
      </div>
    </div>
  )
}
