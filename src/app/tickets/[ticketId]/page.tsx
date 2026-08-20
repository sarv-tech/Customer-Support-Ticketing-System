import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { format, differenceInHours } from 'date-fns'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import TicketActions from './TicketActions'

// Fix 7: Server Component — data fetched server-side, no client waterfall
export const dynamic = 'force-dynamic'

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

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params

  const ticket = await prisma.ticket.findUnique({
    where: { ticketId },
    include: { notes: { orderBy: { createdAt: 'asc' } } },
  })

  if (!ticket) notFound()

  const isOpen = ticket.status === 'Open'
  const hoursOpen = differenceInHours(new Date(), ticket.createdAt)
  const isSlaBreach = isOpen && hoursOpen > 24

  // Serialize Dates to ISO strings before passing to Client Component
  const serializedNotes = ticket.notes.map((n) => ({
    id: n.id,
    text: n.text,
    createdAt: n.createdAt.toISOString(),
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {ticket.ticketId}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${priorityColors[ticket.priority]}`}
              >
                {ticket.priority}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${statusColors[ticket.status]}`}
              >
                {ticket.status}
              </span>
              {isSlaBreach && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-red-800 border border-red-300 shadow-sm animate-pulse-ring">
                  <AlertCircle className="w-3.5 h-3.5" />
                  SLA Breach
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-slate-500">
              Opened {format(ticket.createdAt, 'MMM d, yyyy HH:mm')}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
            {ticket.subject}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-0.5">
                From
              </span>
              <span className="font-medium text-slate-800">{ticket.customerName}</span>
            </div>
            <div className="hidden sm:block w-px bg-slate-200" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-0.5">
                Email
              </span>
              <span className="font-medium text-slate-800">{ticket.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
            Description
          </h3>
          <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] p-5 sm:p-6 rounded-xl border border-slate-200 shadow-inner">
            {ticket.description}
          </div>
        </div>

        {/* Interactive section — Client Component */}
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
