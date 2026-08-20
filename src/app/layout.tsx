import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { differenceInHours } from 'date-fns'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import MobileNav from '@/components/MobileNav'
import NotificationBell from '@/components/NotificationBell'
import CommandPaletteWrapper from '@/components/CommandPaletteWrapper'
import { SignOutButton, SearchTriggerButton } from '@/components/NavActions'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Datastraw Support CRM",
  description: "Customer Support Ticketing System — Manage tickets, track SLAs, and resolve issues faster.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.has('auth_token')

  // Fetch SLA breach tickets for notification bell (server-side)
  let breachTickets: { ticketId: string; subject: string; customerName: string; hoursOpen: number; priority: string }[] = []
  if (isAuthenticated) {
    try {
      const openTickets = await prisma.ticket.findMany({
        where: { status: 'Open' },
        select: { ticketId: true, subject: true, customerName: true, priority: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      })
      breachTickets = openTickets
        .map((t) => ({ ...t, hoursOpen: differenceInHours(new Date(), t.createdAt) }))
        .filter((t) => t.hoursOpen > 24)
        .slice(0, 20)
    } catch { /* ignore DB errors in layout */ }
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <ThemeProvider>
          {/* Command Palette — mounted globally */}
          {isAuthenticated && <CommandPaletteWrapper />}

          <header className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center gap-4">

                {/* ── Logo ── */}
                <div className="flex-shrink-0 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">D</span>
                  </div>
                  <a href={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Datastraw
                    <span className="hidden sm:inline font-normal text-sm ml-1.5" style={{ color: 'var(--text-muted)' }}>CRM</span>
                  </a>
                </div>

                {/* ── Desktop Nav ── */}
                {isAuthenticated && (
                  <nav className="hidden lg:flex items-center gap-2 flex-1 justify-end">
                    <SearchTriggerButton />
                    <NotificationBell breachTickets={breachTickets} />
                    <a
                      href="/tickets/new"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all flex-shrink-0 whitespace-nowrap"
                    >
                      + New Ticket
                    </a>
                    <ThemeToggle />
                    <SignOutButton />
                  </nav>
                )}

                {/* Unauthenticated */}
                {!isAuthenticated && (
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                )}

                {/* Mobile */}
                {isAuthenticated && (
                  <div className="flex lg:hidden items-center gap-2">
                    <NotificationBell breachTickets={breachTickets} />
                    <ThemeToggle />
                    <MobileNav />
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="py-4 text-center text-xs border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
            Datastraw CRM &copy; {new Date().getFullYear()} &middot; Customer Support Platform
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
