'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

// Credentials can be overridden via environment variables
const DEMO_EMAIL = process.env.AUTH_EMAIL ?? 'demo@datastraw.com'
const DEMO_PASSWORD = process.env.AUTH_PASSWORD ?? 'password123'

export async function signIn(prevState: unknown, formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase()
  const password = formData.get('password')?.toString().trim()

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return { error: 'Invalid email or password. Please use demo@datastraw.com and password123.' }
  }

  // Use a per-session random UUID instead of a static token
  const cookieStore = await cookies()
  cookieStore.set('auth_token', randomUUID(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'lax',
  })

  redirect('/dashboard')
}

export async function signUp(prevState: unknown, formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase()
  const password = formData.get('password')?.toString().trim()
  const fullName = formData.get('fullName')?.toString().trim()
  const company = formData.get('company')?.toString().trim()

  if (!email || !password || !fullName || !company) {
    return { error: 'All fields are required.' }
  }

  // MOCK SIGNUP: Since we don't have a users table, we just log them in
  // as the demo user immediately after they "sign up"
  const cookieStore = await cookies()
  cookieStore.set('auth_token', randomUUID(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'lax',
  })

  redirect('/dashboard')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  redirect('/login')
}
