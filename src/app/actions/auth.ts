'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  // In a real application, you would validate credentials against a database here.
  // For this assignment, we are simulating a successful login.
  
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
