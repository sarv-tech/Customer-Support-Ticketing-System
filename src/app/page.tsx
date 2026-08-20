import Link from 'next/link'
import { ArrowRight, BarChart3, Clock, ShieldCheck, Zap } from 'lucide-react'

export const dynamic = 'force-static'

const features = [
  {
    icon: Zap,
    title: 'Real-time SLA Tracking',
    desc: 'Never miss a deadline. Visual indicators and automated alerts keep your team on track.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    desc: 'Measure performance with beautiful charts detailing volume, priority, and resolution times.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Workspaces',
    desc: 'Enterprise-grade security built into every layer with robust session management.'
  },
  {
    icon: Clock,
    title: 'Lightning Fast Workflow',
    desc: 'Keyboard shortcuts (⌘K) and streamlined UIs mean less clicking and more resolving.'
  }
]

function KanbanAnimation() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[900px] h-[400px] pointer-events-none z-0 scale-50 sm:scale-75 lg:scale-100 opacity-60 dark:opacity-50" aria-hidden="true">
      <div className="relative w-full h-full flex justify-between gap-8">
        {/* Kanban Columns */}
        <div className="flex-1 rounded-3xl border-2 border-dashed border-blue-300 dark:border-blue-700/50 bg-white/40 dark:bg-slate-800/40 shadow-sm" />
        <div className="flex-1 rounded-3xl border-2 border-dashed border-blue-300 dark:border-blue-700/50 bg-white/40 dark:bg-slate-800/40 shadow-sm" />
        <div className="flex-1 rounded-3xl border-2 border-dashed border-blue-300 dark:border-blue-700/50 bg-white/40 dark:bg-slate-800/40 shadow-sm" />
        
        {/* Animated Ticket Card */}
        <div className="absolute top-[40px] left-[20px] w-[250px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-blue-500/20 dark:border-blue-400/20 p-5 animate-kanban-flow">
          <div className="flex justify-between items-center mb-4">
            <div className="w-16 h-4 bg-blue-500/20 rounded-full" />
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700" />
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-3" />
          <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-6" />
          <div className="flex gap-2">
            <div className="w-12 h-4 bg-red-400/20 rounded-full" />
            <div className="w-12 h-4 bg-emerald-400/20 rounded-full" />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes kanbanFlow {
          0% { transform: translate(0, 0) scale(0.9); opacity: 0; }
          10% { transform: translate(0, 0) scale(1); opacity: 1; }
          30% { transform: translate(0, 0) scale(1); opacity: 1; }
          40% { transform: translate(320px, 60px) scale(1.05) rotate(2deg); opacity: 1; }
          60% { transform: translate(320px, 60px) scale(1) rotate(0deg); opacity: 1; }
          70% { transform: translate(640px, -20px) scale(1.05) rotate(-2deg); opacity: 1; }
          90% { transform: translate(640px, -20px) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(640px, -20px) scale(0.9); opacity: 0; }
        }
        .animate-kanban-flow {
          animation: kanbanFlow 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32 relative">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <KanbanAnimation />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Datastraw CRM 2.0 is live
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Customer support that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              actually works.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The unified workspace for modern support teams. Resolve tickets faster, automate SLA tracking, and deliver exceptional customer experiences without the clutter.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Start for free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg transition-all"
            >
              Sign in to workspace
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to support at scale
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Datastraw CRM is built with performance and clarity in mind. We stripped away the bloat so your team can focus on what matters: the customer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="t-card p-6 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
