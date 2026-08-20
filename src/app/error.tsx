'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-4xl">⚠️</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-500 mb-2 max-w-sm mx-auto">
          An unexpected error occurred. This has been logged.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
          >
            ↺ Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 transition-all"
          >
            ← Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
