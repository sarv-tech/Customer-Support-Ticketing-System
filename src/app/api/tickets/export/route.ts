import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const VALID_STATUSES = ['Open', 'In Progress', 'Closed'] as const
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    const whereClause: {
      status?: string
      priority?: string
      OR?: Array<Record<string, unknown>>
    } = {}

    if (status && VALID_STATUSES.includes(status as any)) whereClause.status = status
    if (priority && VALID_PRIORITIES.includes(priority as any)) whereClause.priority = priority

    if (search) {
      whereClause.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { ticketId: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ]
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    // Escape CSV cell helper
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`

    const headers = ['Ticket ID', 'Customer Name', 'Customer Email', 'Subject', 'Status', 'Priority', 'Created At']
    const rows = tickets.map(t => [
      escapeCsv(t.ticketId),
      escapeCsv(t.customerName),
      escapeCsv(t.customerEmail),
      escapeCsv(t.subject),
      escapeCsv(t.status),
      escapeCsv(t.priority),
      escapeCsv(t.createdAt.toISOString())
    ].join(','))

    const csvContent = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="tickets.csv"'
      }
    })
  } catch (error) {
    console.error('Export CSV error:', error)
    return new NextResponse('Error generating CSV', { status: 500 })
  }
}
