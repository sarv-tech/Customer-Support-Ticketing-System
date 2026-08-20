import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const VALID_STATUSES = ['Open', 'In Progress', 'Closed'] as const
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const

export async function PUT(request: Request) {
  try {
    const { ticketIds, status, priority } = await request.json()

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json({ error: 'ticketIds array is required' }, { status: 400 })
    }

    if (status && !VALID_STATUSES.includes(status as any)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    if (priority && !VALID_PRIORITIES.includes(priority as any)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
    }

    const data: any = {}
    if (status) data.status = status
    if (priority) data.priority = priority

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    // We need to create system notes for each updated ticket
    // Prisma's updateMany doesn't support relation creates, so we loop
    let count = 0
    for (const ticketId of ticketIds) {
      const ticket = await prisma.ticket.findUnique({ where: { ticketId } })
      if (!ticket) continue

      const notesToCreate = []
      if (status && status !== ticket.status) {
        notesToCreate.push({ text: `[SYSTEM] Status changed from **${ticket.status}** to **${status}** (Bulk)` })
      }
      if (priority && priority !== ticket.priority) {
        notesToCreate.push({ text: `[SYSTEM] Priority changed from **${ticket.priority}** to **${priority}** (Bulk)` })
      }

      await prisma.ticket.update({
        where: { ticketId },
        data: {
          ...data,
          ...(notesToCreate.length > 0 && {
            notes: { create: notesToCreate }
          })
        }
      })
      count++
    }

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('PUT /api/tickets/bulk error:', error)
    return NextResponse.json({ error: 'Failed to bulk update' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { ticketIds } = await request.json()

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json({ error: 'ticketIds array is required' }, { status: 400 })
    }

    const result = await prisma.ticket.deleteMany({
      where: { ticketId: { in: ticketIds } }
    })

    return NextResponse.json({ success: true, count: result.count })
  } catch (error) {
    console.error('DELETE /api/tickets/bulk error:', error)
    return NextResponse.json({ error: 'Failed to bulk delete' }, { status: 500 })
  }
}
