import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const resolvedParams = await params
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId: resolvedParams.ticketId },
      include: {
        notes: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Returns: { ticket_id, customer_name, customer_email, subject, description, status, notes }
    const mappedTicket = {
      ticket_id: ticket.ticketId,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority, // Keep our bonus field
      created_at: ticket.createdAt,
      notes: ticket.notes,
    }

    return NextResponse.json(mappedTicket)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const resolvedParams = await params
  try {
    const body = await request.json()
    const { status, priority, notes } = body

    const existingTicket = await prisma.ticket.findUnique({
      where: { ticketId: resolvedParams.ticketId },
    })

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const updatedTicket = await prisma.ticket.update({
      where: { ticketId: resolvedParams.ticketId },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(notes && {
          notes: {
            create: {
              text: notes,
            },
          },
        }),
      },
    })

    // Returns: { success: true, updated_at }
    return NextResponse.json(
      { success: true, updated_at: updatedTicket.updatedAt },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
