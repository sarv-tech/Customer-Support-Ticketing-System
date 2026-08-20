'use client'

import dynamic from 'next/dynamic'

// Dynamically import so it's client-only
const CommandPalette = dynamic(() => import('./CommandPalette'), { ssr: false })

export default function CommandPaletteWrapper() {
  return <CommandPalette />
}
