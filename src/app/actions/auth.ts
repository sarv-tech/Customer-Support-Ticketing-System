'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase()
  const password = formData.get('password')?.toString().trim()

  if (email !== 'demo@datastraw.com' || password !== 'password123') {
    return { error: 'Invalid email or password. Please use demo@datastraw.com and password123.' }
  }

  // Set a mock authentication cookie that expires in 1 day
  const cookieStore = await cookies()
  cookieStore.set('auth_token', 'mock_secure_token_12345', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  })

  // Redirect to the dashboard
  redirect('/')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  redirect('/login')
}
