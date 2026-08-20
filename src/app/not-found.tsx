import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4 animate-fade-in-up">
        {/* Big number */}
        <div className="relative inline-block mb-6">
          <span className="text-[120px] sm:text-[160px] font-black text-slate-100 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white text-2xl font-bold">D</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          Page not found
        </h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/tickets/new"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 transition-all"
          >
            Create a Ticket
          </Link>
        </div>
      </div>
    </div>
  )
}
