'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useRouter } from 'next/navigation'
import type { Ticket } from '@prisma/client'
import KanbanColumn from './KanbanColumn'
import { CheckCircle2, Flame, Award } from 'lucide-react'

// Extended ticket type that includes notes if available
export type KanbanTicket = Ticket & { notes?: { text: string; createdAt: Date }[] }

interface KanbanBoardProps {
  initialTickets: KanbanTicket[]
}

const COLUMNS = [
  { id: 'Open', title: 'Open', bg: 'bg-slate-50 dark:bg-slate-900/50' },
  { id: 'In Progress', title: 'In Progress', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { id: 'Closed', title: 'Closed', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
]

export default function KanbanBoard({ initialTickets }: KanbanBoardProps) {
  const router = useRouter()
  // Local state for optimistic UI updates
  const [tickets, setTickets] = useState<KanbanTicket[]>(initialTickets)

  // Sync with prop when it changes from server (e.g., after filter change)
  useEffect(() => {
    setTickets(initialTickets)
  }, [initialTickets])

  // Gamification Lite (Derived entirely from data, zero schema changes)
  const ticketsClosedToday = tickets.filter(t => 
    t.status === 'Closed' && 
    (new Date().getTime() - new Date(t.updatedAt).getTime()) < 24 * 60 * 60 * 1000
  ).length

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const draggedTicket = tickets.find(t => t.id === draggableId)
    if (!draggedTicket) return

    const newStatus = destination.droppableId

    // Optimistic UI Update
    setTickets(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t))

    try {
      const res = await fetch(`/api/tickets/${draggedTicket.ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) {
        throw new Error('Failed to update ticket status')
      }
      
      // Refresh to get server audit notes
      router.refresh()
    } catch (error) {
      console.error(error)
      // Revert optimistic update
      setTickets(initialTickets)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Gamification Lite Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Daily Standup Board
          </h2>
          <p className="text-sm text-blue-100 mt-1">Drag and drop tickets to update their status. Smart features are derived automatically.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Award className="w-8 h-8 text-yellow-300" />
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-200 font-bold">Closed Today</p>
              <p className="text-2xl font-black leading-none">{ticketsClosedToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(col => {
            const columnTickets = tickets.filter(t => t.status === col.id)
            return (
              <KanbanColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                bg={col.bg}
                tickets={columnTickets} 
              />
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
