import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Fix 1: Next.js 16 renamed middleware → proxy. The exported function must be
// named "proxy" (not "middleware") for Next.js 16 to pick it up.
export function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const isPublicRoute = pathname === '/login' || pathname.startsWith('/api/')

  // Unauthenticated user trying to access a protected route
  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged-in user trying to access login page
  if (authToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
