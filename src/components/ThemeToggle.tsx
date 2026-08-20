'use client'
import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className="relative p-2 rounded-xl transition-all duration-200 group"
      style={{ color: 'var(--text-muted)' }}
    >
      <span
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: 'var(--bg-muted)' }}
      />
      <span className="relative">
        {theme === 'dark'
          ? <Sun className="h-4.5 w-4.5 text-amber-400" />
          : <Moon className="h-4.5 w-4.5" />
        }
      </span>
    </button>
  )
}
