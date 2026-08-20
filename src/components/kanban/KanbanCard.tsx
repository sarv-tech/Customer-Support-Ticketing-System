'use client'

import { Draggable } from '@hello-pangea/dnd'
import type { KanbanTicket } from './KanbanBoard'
import { formatDistanceToNow, differenceInHours } from 'date-fns'
import { AlertCircle, Clock, MessageSquare, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface KanbanCardProps {
  ticket: KanbanTicket
  index: number
}

const priorityColor: Record<string, string> = {
  Urgent: 'border-l-red-500',
  High:   'border-l-orange-500',
  Medium: 'border-l-blue-500',
  Low:    'border-l-slate-400',
}

// Very basic sentiment analysis
function getSentimentEmoji(text: string) {
  const lower = text.toLowerCase()
  if (lower.match(/urgent|angry|frustrated|broken|hate|terrible|worst|unacceptable/)) return '😡'
  if (lower.match(/happy|great|awesome|love|thanks|thank you|excellent/)) return '😊'
  return '😐' // Neutral
}

export default function KanbanCard({ ticket, index }: KanbanCardProps) {
  const router = useRouter()
  
  // Derived "Smart" Features (Zero DB changes!)
  
  // 1. SLA Pulse (Age-based)
  const hoursOpen = differenceInHours(new Date(), new Date(ticket.createdAt))
  const isSlaBreach = ticket.status !== 'Closed' && hoursOpen > 12

  // 2. Infinite Loop Detection
  // Count how many times the status was changed back to "Open"
  const reopenCount = (ticket.notes || []).filter(note => 
    note.text.includes('[SYSTEM] Status changed') && note.text.includes('**Open**')
  ).length
  const isLooping = reopenCount >= 2

  // 3. Sentiment Aware
  const sentiment = getSentimentEmoji(ticket.description + ' ' + ticket.subject)

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => router.push(`/tickets/${ticket.ticketId}`)}
          className={`relative group rounded-xl border bg-white dark:bg-slate-900 p-3 shadow-sm hover:shadow-md transition-all border-l-4 cursor-grab active:cursor-grabbing ${priorityColor[ticket.priority]} ${
            snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl z-50 ring-2 ring-blue-500' : ''
          } ${isSlaBreach ? 'border-red-500 dark:border-red-500' : 'border-t-slate-200 border-r-slate-200 border-b-slate-200 dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800'}`}
        >
          {/* Loop Warning Badge */}
          {isLooping && (
            <div className="absolute -top-2 -right-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full p-1 shadow-sm border border-red-200 dark:border-red-800" title={`Reopened ${reopenCount} times`}>
              <RotateCcw className="w-3 h-3" />
            </div>
          )}

          {/* Header Row */}
          <div className="flex justify-between items-start mb-2">
            <code className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {ticket.ticketId}
            </code>
            <div className="flex gap-1.5 items-center">
              {/* Sentiment Emoji Badge */}
              <span className="text-sm bg-slate-50 dark:bg-slate-800 rounded-full w-5 h-5 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm" title="Estimated Sentiment">
                {sentiment}
              </span>
            </div>
          </div>

          {/* Subject */}
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 leading-snug line-clamp-2">
            {ticket.subject}
          </h4>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
              <span className="truncate max-w-[80px]">{ticket.customerName.split(' ')[0]}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 ${isSlaBreach ? 'text-red-600 dark:text-red-400 font-bold animate-pulse-ring' : ''}`}>
                {isSlaBreach ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {formatDistanceToNow(new Date(ticket.createdAt))}
              </span>
              {(ticket.notes?.length || 0) > 0 && (
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                  <MessageSquare className="w-3 h-3" />
                  {ticket.notes!.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
