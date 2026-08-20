'use client'

import { useActionState, useState } from 'react'
import { signUp } from '@/app/actions/auth'
import Link from 'next/link'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8" style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        
        {/* Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Link href="/" className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            D
          </Link>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Create your workspace
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Get started for free. No credit card required.
            </p>
          </div>
        </div>

        {state?.error && (
          <div className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm animate-fade-in"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#f87171' }}>
            <span className="font-bold mt-0.5 text-base">⚠</span>
            <span>{state.error}</span>
          </div>
        )}

        <form className="space-y-4" action={formAction} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input id="fullName" name="fullName" type="text" required placeholder="Jane Doe" className="block w-full t-input rounded-xl py-3 px-4 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="company" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Company</label>
              <input id="company" name="company" type="text" required placeholder="Acme Inc." className="block w-full t-input rounded-xl py-3 px-4 text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Work Email</label>
            <input id="email" name="email" type="email" required placeholder="jane@acme.com" className="block w-full t-input rounded-xl py-3 px-4 text-sm" />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <input
                id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                className="block w-full t-input rounded-xl py-3 px-4 pr-12 text-sm"
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors" style={{ color: 'var(--text-tertiary)' }} tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={isPending}
            className={`w-full flex items-center justify-center gap-2 mt-2 py-3 px-4 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isPending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/25 hover:-translate-y-0.5'
            }`}
            style={{ background: isPending ? '#3b82f6' : 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            {isPending ? (
              <><span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating workspace...</>
            ) : (
              <>Create workspace</>
            )}
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-blue-500 hover:text-blue-400 transition-colors">
            Sign in here
          </Link>
        </p>

        <div className="rounded-xl border p-4 flex items-start gap-3 mt-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            <strong>Demo Note:</strong> Since this is a demo environment, signing up will automatically log you into the demo workspace with pre-populated data.
          </p>
        </div>

      </div>
    </div>
  )
}
