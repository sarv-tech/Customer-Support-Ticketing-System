import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const PRIORITY_ORDER = {
  Urgent: 1,
  High: 2,
  Medium: 3,
  Low: 4,
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const search = searchParams.get('search') // The assignment specifies ?search=customer_name but we can search across all.

  const whereClause: any = {}

  if (status) {
    whereClause.status = status
  }
  
  if (priority) {
    whereClause.priority = priority
  }

  if (search) {
    whereClause.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { ticketId: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Sort by priority then by date
    tickets.sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 99
      const pB = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 99
      if (pA !== pB) return pA - pB
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    // Map to snake_case for exact assignment compliance
    const mappedTickets = tickets.map(t => ({
      ticket_id: t.ticketId,
      customer_name: t.customerName,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      created_at: t.createdAt
    }))

    return NextResponse.json(mappedTickets)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // assignment says body expects: { customer_name, customer_email, subject, description }
    const { customer_name, customer_email, subject, description, priority } = body

    // Generate a simple Ticket ID (e.g., TKT-123456)
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`

    const ticket = await prisma.ticket.create({
      data: {
        ticketId,
        customerName: customer_name,
        customerEmail: customer_email,
        subject,
        description,
        priority: priority || 'Medium',
      },
    })

    // Returns: { ticket_id, created_at }
    return NextResponse.json(
      { ticket_id: ticket.ticketId, created_at: ticket.createdAt },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
