'use client'

import { useActionState, useState } from 'react'
import { signUp } from '@/app/actions/auth'
import Link from 'next/link'
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, null)
  const [showPassword, setShowPassword] = useState(false)

  const features = [
    'Unlimited ticket tracking',
    'Real-time SLA monitoring',
    'Advanced analytics dashboard',
    'Secure role-based access'
  ]

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex -mx-4 sm:-mx-6 lg:-mx-8 -my-8"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* ═══ LEFT PANEL — Marketing ═══════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}>
        
        {/* Mesh / glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xl text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              D
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight">Datastraw CRM</p>
            </div>
          </Link>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8 mt-12 mb-auto">
          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Start delivering <br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              world-class support.
            </span>
          </h1>
          <p className="text-blue-200/70 text-base leading-relaxed max-w-sm">
            Join hundreds of teams using Datastraw to resolve tickets faster and keep customers happy.
          </p>

          <ul className="space-y-4 pt-4">
            {features.map((text, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.2)' }}>
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <span className="text-sm text-blue-100/90 font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Sign-up form ══════════════════════════ */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-10 relative"
        style={{ background: 'var(--bg-page)' }}>
        
        {/* Subtle top glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #3b82f640 0%, transparent 70%)' }} />

        <div className="w-full max-w-md space-y-7 relative z-10">
          
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              D
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Datastraw CRM</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Create your workspace
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Get started for free. No credit card required.
            </p>
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
                <label htmlFor="fullName" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Full Name
                </label>
                <input id="fullName" name="fullName" type="text" required placeholder="Jane Doe"
                  className="block w-full t-input rounded-xl py-3 px-4 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="company" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Company Name
                </label>
                <input id="company" name="company" type="text" required placeholder="Acme Inc."
                  className="block w-full t-input rounded-xl py-3 px-4 text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Work Email
              </label>
              <input id="email" name="email" type="email" required placeholder="jane@acme.com"
                className="block w-full t-input rounded-xl py-3 px-4 text-sm" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  className="block w-full t-input rounded-xl py-3 px-4 pr-12 text-sm"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                  style={{ color: 'var(--text-tertiary)' }} tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full flex items-center justify-center gap-2 mt-2 py-3 px-4 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isPending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/25 hover:-translate-y-0.5'
              }`}
              style={{ background: isPending ? '#3b82f6' : 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              {isPending ? (
                <><span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating workspace...</>
              ) : (
                <>Create workspace <span className="ml-1">→</span></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3 pt-2">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

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
    </div>
  )
}
