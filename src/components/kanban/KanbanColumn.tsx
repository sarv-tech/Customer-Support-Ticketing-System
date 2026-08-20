'use client'

import { Droppable } from '@hello-pangea/dnd'
import type { KanbanTicket } from './KanbanBoard'
import KanbanCard from './KanbanCard'
import { Inbox } from 'lucide-react'

interface KanbanColumnProps {
  id: string
  title: string
  bg: string
  tickets: KanbanTicket[]
}

export default function KanbanColumn({ id, title, bg, tickets }: KanbanColumnProps) {
  return (
    <div className={`flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${bg}`}>
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur flex justify-between items-center">
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-700 dark:text-slate-300">
          {title}
        </h3>
        <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full">
          {tickets.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-3 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
            }`}
          >
            {tickets.map((ticket, index) => (
              <KanbanCard key={ticket.id} ticket={ticket} index={index} />
            ))}
            
            {provided.placeholder}

            {tickets.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-full flex flex-col items-center justify-center opacity-40 text-slate-500 py-10">
                <Inbox className="w-8 h-8 mb-2" />
                <p className="text-xs font-semibold">Drop tickets here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
