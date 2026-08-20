'use client'

import { useState } from 'react'
import { Menu, X, PlusCircle, LogOut, Search } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  const openPalette = () => {
    setOpen(false)
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
    }, 150)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl transition-all"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--bg-surface)', borderLeft: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Datastraw CRM</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {/* Search */}
          <button
            onClick={openPalette}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Search className="h-5 w-5" />
            <span>Search Tickets</span>
            <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              ⌘K
            </kbd>
          </button>

          {/* Create */}
          <a
            href="/tickets/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            <PlusCircle className="h-5 w-5" />
            Create Ticket
          </a>
        </nav>

        {/* Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium transition-all hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
