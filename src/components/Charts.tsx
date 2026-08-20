// Pure SVG charts — no external dependencies

interface DataPoint {
  label: string
  value: number
  color: string
}

// ── Donut Chart ──────────────────────────────────────────────────────────────
export function DonutChart({ data }: { data: DataPoint[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <EmptyChart message="No data yet" />

  const size = 160
  const strokeWidth = 28
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        {/* Background circle */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth}
        />
        {data.map((d, i) => {
          const pct = d.value / total
          const dash = pct * circumference
          const el = (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset * circumference + circumference / 4}
              strokeLinecap="butt"
              className="transition-all duration-500"
            />
          )
          offset += pct
          return el
        })}
        {/* Center text */}
        <text x={size / 2} y={size / 2 - 6} textAnchor="middle" className="fill-slate-900 dark:fill-slate-100" fontSize={22} fontWeight="bold">
          {total}
        </text>
        <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fill="#94a3b8" fontSize={10}>
          Total
        </text>
      </svg>

      {/* Legend */}
      <ul className="space-y-2 text-sm flex-1 min-w-0">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-slate-600 truncate text-xs font-medium">{d.label}</span>
            </div>
            <span className="font-bold text-slate-800 text-xs tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Bar Chart ────────────────────────────────────────────────────────────────
export function BarChart({ data }: { data: DataPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-600">{d.label}</span>
            <span className="font-bold text-slate-800 tabular-nums">{d.value}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-20 text-slate-400 text-sm">
      {message}
    </div>
  )
}
