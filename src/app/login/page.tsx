'use client'

import { useActionState, useState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Eye, EyeOff, Ticket, ShieldCheck, Zap, BarChart2 } from 'lucide-react'

const features = [
  { icon: Ticket, title: 'Smart Ticketing', desc: 'Create, track and resolve support tickets with ease.' },
  { icon: Zap, title: 'Real-time Updates', desc: 'SLA breach alerts and live status updates.' },
  { icon: BarChart2, title: 'Analytics', desc: 'At-a-glance stats to stay on top of your queue.' },
  { icon: ShieldCheck, title: 'Secure Access', desc: 'Role-based auth with secure session management.' },
]

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-[90vh] flex items-stretch -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 right-12 w-40 h-40 bg-white/5 rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">D</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">Datastraw CRM</span>
          </div>
          <p className="mt-3 text-blue-100 text-sm font-medium">Customer Support Ticketing System</p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-3xl font-bold leading-tight">
            Resolve customer issues<br />
            <span className="text-blue-200">faster than ever.</span>
          </h2>
          <div className="space-y-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-blue-200 text-xs">
          Built for support teams who care about every customer.
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo (hidden on lg) */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-blue-700">Datastraw CRM</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
              Sign in to access your support dashboard.
            </p>
          </div>

          <form className="space-y-5" action={formAction}>
            {state?.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="font-semibold">⚠</span>
                {state.error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="you@company.com"
                  defaultValue="demo@datastraw.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full px-4 py-3 pr-11 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Your password"
                    defaultValue="password123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember-me"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              id="sign-in-button"
              disabled={isPending}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isPending
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {isPending ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in →'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-xs text-blue-700 dark:text-blue-300">
            <p className="font-bold mb-1">Demo credentials</p>
            <p>Email: <span className="font-mono">demo@datastraw.com</span></p>
            <p>Password: <span className="font-mono">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
