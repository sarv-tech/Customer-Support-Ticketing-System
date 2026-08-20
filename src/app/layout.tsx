import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers'
import { signOut } from './actions/auth'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import MobileNav from '@/components/MobileNav'

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

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200">
        <ThemeProvider>
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">D</span>
                  </div>
                  <a href="/" className="text-xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">
                    Datastraw <span className="hidden sm:inline text-slate-400 font-normal">CRM</span>
                  </a>
                </div>

                {/* Desktop Nav */}
                {isAuthenticated && (
                  <nav className="hidden md:flex items-center space-x-3">
                    <a href="/" className="text-slate-600 hover:text-blue-700 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition-all">
                      Dashboard
                    </a>
                    <a
                      href="/tickets/new"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
                    >
                      + Create Ticket
                    </a>
                    <ThemeToggle />
                    <form action={signOut}>
                      <button type="submit" className="text-slate-500 hover:text-red-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
                        Sign Out
                      </button>
                    </form>
                  </nav>
                )}

                {/* Right side when not authenticated */}
                {!isAuthenticated && (
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                )}

                {/* Mobile hamburger */}
                {isAuthenticated && (
                  <div className="flex md:hidden items-center gap-2">
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

          <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
            Datastraw CRM &copy; {new Date().getFullYear()}
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
