import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers'
import { signOut } from './actions/auth'

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
  description: "Customer Support Ticketing System",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.has('auth_token')

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">D</span>
                </div>
                <a href="/" className="text-xl font-bold text-blue-700 tracking-tight">
                  Datastraw CRM
                </a>
              </div>
              
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    Dashboard
                  </a>
                  <a
                    href="/tickets/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    + Create Ticket
                  </a>
                  <form action={signOut}>
                    <button type="submit" className="text-slate-500 hover:text-red-600 font-medium text-sm transition-colors">
                      Sign Out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
