import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const isPublicRoute = pathname === '/login' || pathname.startsWith('/api/')

  // If the user is trying to access a protected route without a token
  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is already logged in and tries to access the login page
  if (authToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, we handle these separately or let them pass)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
