'use client'

import { useActionState, useState, useEffect } from 'react'
import { signIn } from '@/app/actions/auth'
import {
  Eye, EyeOff, CheckCircle2, Zap, ShieldCheck,
  BarChart3, Clock, MessageSquare, TrendingUp, Star,
} from 'lucide-react'

/* ─── Static data ─────────────────────────────── */
const stats = [
  { value: '98%',    label: 'Customer satisfaction' },
  { value: '< 2 hr', label: 'Avg. first response' },
  { value: '10k+',   label: 'Tickets resolved' },
]

const features = [
  { icon: Zap,          text: 'SLA breach alerts in real-time' },
  { icon: BarChart3,    text: 'Analytics & performance dashboard' },
  { icon: ShieldCheck,  text: 'Secure, role-based access control' },
  { icon: MessageSquare,text: 'Internal notes & team collaboration' },
]

const testimonial = {
  quote: 'Datastraw CRM cut our response time in half. Every ticket gets the attention it deserves.',
  name:  'Sarah K.',
  role:  'Head of Support, TechFlow Inc.',
}

/* ─── Animated ticket counter ─────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 40)
    const id = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(id) }
      else setCount(start)
    }, 30)
    return () => clearInterval(id)
  }, [target])
  return <>{count}{suffix}</>
}

/* ─── Floating ticket card (decorative) ────────── */
function FloatingCard({ className, subject, status, time, priority }: {
  className?: string; subject: string; status: string; time: string; priority: string
}) {
  const priorityColor: Record<string, string> = {
    Urgent: 'bg-red-400/20 text-red-300 border-red-400/30',
    High:   'bg-orange-400/20 text-orange-300 border-orange-400/30',
    Medium: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  }
  const statusColor: Record<string, string> = {
    Open:        'bg-emerald-400/20 text-emerald-300',
    'In Progress':'bg-purple-400/20 text-purple-300',
    Resolved:    'bg-slate-400/20 text-slate-300',
  }

  return (
    <div className={`absolute rounded-2xl border border-white/10 bg-white/8 backdrop-blur-md p-3.5 shadow-xl w-56 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <code className="text-[10px] font-mono text-blue-200/70">TKT-{Math.floor(Math.random() * 90000 + 10000)}</code>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusColor[status]}`}>{status}</span>
      </div>
      <p className="text-white text-xs font-semibold leading-snug mb-2 truncate">{subject}</p>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityColor[priority]}`}>{priority}</span>
        <span className="text-[10px] text-blue-200/60 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{time}</span>
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────── */
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex -mx-4 sm:-mx-6 lg:-mx-8 -my-8"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* ═══ LEFT PANEL — Branding ═══════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}>

        {/* Mesh / glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating ticket cards — decorative */}
        <FloatingCard className="top-[18%] right-[8%] animate-float-a"
          subject="Cannot access my account" status="Open" time="2m ago" priority="Urgent" />
        <FloatingCard className="top-[42%] right-[-2%] animate-float-b"
          subject="Billing discrepancy on invoice #4421" status="In Progress" time="1h ago" priority="High" />
        <FloatingCard className="top-[66%] right-[10%] animate-float-c"
          subject="Feature request: bulk export" status="Resolved" time="3h ago" priority="Medium" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xl text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              D
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight">Datastraw CRM</p>
              <p className="text-blue-300/70 text-xs">Customer Support Platform</p>
            </div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/20 rounded-full px-3 py-1">
              <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-semibold">Trusted by 500+ support teams</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Support that<br />
              <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                never sleeps.
              </span>
            </h1>
            <p className="text-blue-200/70 text-base leading-relaxed max-w-sm">
              Resolve tickets faster, keep customers happy, and hit your SLAs every day — all from one clean dashboard.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.2)' }}>
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <span className="text-sm text-blue-100/80 font-medium">{text}</span>
              </li>
            ))}
          </ul>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/8 p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-xl font-extrabold text-white">{s.value}</p>
                <p className="text-[11px] text-blue-200/60 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-blue-100/90 text-sm italic leading-relaxed mb-3">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              SK
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{testimonial.name}</p>
              <p className="text-blue-300/60 text-[10px]">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Sign-in form ══════════════════════════ */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-10 relative"
        style={{ background: 'var(--bg-page)' }}>

        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #3b82f640 0%, transparent 70%)' }} />

        <div className="w-full max-w-sm space-y-7 relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              D
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Datastraw CRM</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Sign in to your support workspace.
            </p>
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
          <form className="space-y-4" action={formAction} noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Work email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                defaultValue="demo@datastraw.com"
                className="block w-full t-input rounded-xl py-3 px-4 text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="block w-full t-input rounded-xl py-3 px-4 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye className="h-4 w-4" />}
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
              type="submit"
              id="sign-in-button"
              disabled={isPending}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isPending
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:shadow-blue-500/25 hover:-translate-y-0.5'
              }`}
              style={{ background: isPending ? '#3b82f6' : 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              {isPending ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign in to workspace <span className="ml-1">→</span></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Demo access</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Demo credentials box */}
          <div className="rounded-xl border p-4 space-y-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
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

          {/* Footer note */}
          <p className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
            By signing in you agree to our{' '}
            <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Floating card animations */}
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50% { transform: translateY(-8px) rotate(-0.5deg); }
        }
        .animate-float-a { animation: floatA 4s ease-in-out infinite; }
        .animate-float-b { animation: floatB 5s ease-in-out infinite 0.8s; }
        .animate-float-c { animation: floatC 4.5s ease-in-out infinite 1.5s; }
      `}</style>
    </div>
  )
}
