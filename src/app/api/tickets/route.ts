import { NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import prisma from '@/lib/prisma'

const PRIORITY_ORDER: Record<string, number> = {
  Urgent: 1,
  High: 2,
  Medium: 3,
  Low: 4,
}

const VALID_STATUSES = ['Open', 'In Progress', 'Closed'] as const
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const search = searchParams.get('search')

  // Fix 8: Validate query param values
  if (status && !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }
  if (priority && !VALID_PRIORITIES.includes(priority as (typeof VALID_PRIORITIES)[number])) {
    return NextResponse.json(
      { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
      { status: 400 }
    )
  }

  const whereClause: {
    status?: string
    priority?: string
    OR?: Array<Record<string, unknown>>
  } = {}

  if (status) whereClause.status = status
  if (priority) whereClause.priority = priority

  // Fix 10: search subject (aligned with dashboard) instead of description
  if (search) {
    whereClause.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { ticketId: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
    ]
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    // Sort by priority then by date
    tickets.sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority] ?? 99
      const pB = PRIORITY_ORDER[b.priority] ?? 99
      if (pA !== pB) return pA - pB
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    // Map to snake_case for assignment compliance
    const mappedTickets = tickets.map((t) => ({
      ticket_id: t.ticketId,
      customer_name: t.customerName,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      created_at: t.createdAt,
    }))

    return NextResponse.json(mappedTickets)
  } catch (error) {
    console.error('GET /api/tickets error:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_name, customer_email, subject, description, priority } = body

    // Fix 4: Validate required fields
    if (!customer_name?.toString().trim()) {
      return NextResponse.json({ error: 'Missing required field: customer_name' }, { status: 400 })
    }
    if (!customer_email?.toString().trim()) {
      return NextResponse.json({ error: 'Missing required field: customer_email' }, { status: 400 })
    }
    if (!subject?.toString().trim()) {
      return NextResponse.json({ error: 'Missing required field: subject' }, { status: 400 })
    }
    if (!description?.toString().trim()) {
      return NextResponse.json({ error: 'Missing required field: description' }, { status: 400 })
    }

    // Fix 8: Validate priority value
    const resolvedPriority = priority ?? 'Medium'
    if (!VALID_PRIORITIES.includes(resolvedPriority as (typeof VALID_PRIORITIES)[number])) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
        { status: 400 }
      )
    }

    // Fix 5: Use crypto.randomInt instead of Math.random()
    const ticketId = `TKT-${randomInt(100000, 1000000)}`

    const ticket = await prisma.ticket.create({
      data: {
        ticketId,
        customerName: customer_name.toString().trim(),
        customerEmail: customer_email.toString().trim(),
        subject: subject.toString().trim(),
        description: description.toString().trim(),
        priority: resolvedPriority,
      },
    })

    return NextResponse.json(
      { ticket_id: ticket.ticketId, created_at: ticket.createdAt },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/tickets error:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
