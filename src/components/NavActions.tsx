'use client'
import { signOut } from '@/app/actions/auth'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm font-medium px-3 py-2 rounded-xl transition-all hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        style={{ color: 'var(--text-muted)' }}
      >
        Sign Out
      </button>
    </form>
  )
}

export function SearchTriggerButton() {
  const open = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
  }
  return (
    <button
      onClick={open}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all border"
      style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', backgroundColor: 'var(--bg-muted)' }}
      title="Quick search (Ctrl+K)"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <span className="hidden lg:inline text-xs">Search tickets</span>
      <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--border-strong)', color: 'var(--text-muted)' }}>
        ⌘K
      </kbd>
    </button>
  )
}
