import type { LucideIcon } from 'lucide-react'

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'text-ink-100',
  hint,
}: {
  label: string
  value: number | string | null
  icon: LucideIcon
  accent?: string
  hint?: string
}) {
  const display = value === null || value === undefined ? 'Data unavailable' : value
  const isUnavailable = value === null || value === undefined
  return (
    <div className="panel p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">{label}</span>
        <Icon size={16} className="text-ink-500" />
      </div>
      <div className={`text-2xl font-semibold tabular-nums ${isUnavailable ? 'text-ink-700 text-sm font-normal' : accent}`}>
        {display}
      </div>
      {hint && <div className="text-xs text-ink-500">{hint}</div>}
    </div>
  )
}
