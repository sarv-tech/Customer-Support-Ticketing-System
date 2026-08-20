import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const VALID_STATUSES = ['Open', 'In Progress', 'Closed'] as const
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId },
      include: {
        notes: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const mappedTicket = {
      ticket_id: ticket.ticketId,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.createdAt,
      notes: ticket.notes,
    }

    return NextResponse.json(mappedTicket)
  } catch (error) {
    console.error('GET /api/tickets/[ticketId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params
  try {
    const body = await request.json()
    const { status, priority, notes } = body

    // Fix 4 & 8: Validate incoming values
    if (status !== undefined && !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority as (typeof VALID_PRIORITIES)[number])) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
        { status: 400 }
      )
    }
    if (notes !== undefined && typeof notes !== 'string') {
      return NextResponse.json({ error: 'notes must be a string' }, { status: 400 })
    }
    if (notes !== undefined && !notes.trim()) {
      return NextResponse.json({ error: 'notes cannot be empty' }, { status: 400 })
    }

    const existingTicket = await prisma.ticket.findUnique({ where: { ticketId } })
    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const updatedTicket = await prisma.ticket.update({
      where: { ticketId },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(notes?.trim() && {
          notes: { create: { text: notes.trim() } },
        }),
      },
    })

    return NextResponse.json({ success: true, updated_at: updatedTicket.updatedAt })
  } catch (error) {
    console.error('PUT /api/tickets/[ticketId] error:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
