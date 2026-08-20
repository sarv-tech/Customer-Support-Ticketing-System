'use client'

import { useActionState, useState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8" style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        
        {/* Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            D
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Sign in to your Datastraw workspace.
            </p>
          </div>
        </div>

        {/* Error alert */}
        {state?.error && (
          <div className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm animate-fade-in"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#f87171' }}>
            <span className="font-bold mt-0.5 text-base">⚠</span>
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" action={formAction} noValidate>
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email-address" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Work email
            </label>
            <input
              id="email-address" name="email" type="email" autoComplete="email" required
              placeholder="you@company.com" defaultValue="demo@datastraw.com"
              className="block w-full t-input rounded-xl py-3 px-4 text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <Link href="#" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password" name="password" type={showPassword ? 'text' : 'password'}
                autoComplete="current-password" required placeholder="••••••••" defaultValue="password123"
                className="block w-full t-input rounded-xl py-3 px-4 pr-12 text-sm"
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                style={{ color: 'var(--text-tertiary)' }} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" name="remember-me"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer" />
            <span className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Keep me signed in
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit" disabled={isPending}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isPending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/25 hover:-translate-y-0.5'
            }`}
            style={{ background: isPending ? '#3b82f6' : 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            {isPending ? (
              <><span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
            ) : (
              <>Sign in to workspace</>
            )}
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-blue-500 hover:text-blue-400 transition-colors">
            Sign up here
          </Link>
        </p>

        {/* Demo credentials box */}
        <div className="rounded-xl border p-4 space-y-2 mt-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-blue-500/15 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 text-blue-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
              Test credentials
            </span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
            <span style={{ color: 'var(--text-tertiary)' }}>Email</span>
            <code className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>demo@datastraw.com</code>
            <span style={{ color: 'var(--text-tertiary)' }}>Password</span>
            <code className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>password123</code>
          </div>
        </div>

      </div>
    </div>
  )
}
