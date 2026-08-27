const STATUS_CLASS: Record<string, string> = {
  COMPLETED: 'text-risk-low border-risk-low/30 bg-risk-low/10',
  PENDING: 'text-risk-medium border-risk-medium/30 bg-risk-medium/10',
  FAILED: 'text-risk-critical border-risk-critical/30 bg-risk-critical/10',
  OPEN: 'text-risk-info border-risk-info/30 bg-risk-info/10',
  REVIEWING: 'text-risk-medium border-risk-medium/30 bg-risk-medium/10',
  CLOSED: 'text-ink-500 border-base-600 bg-base-850',
  CONFIRMED_FRAUD: 'text-risk-critical border-risk-critical/30 bg-risk-critical/10',
  DISMISSED: 'text-ink-500 border-base-600 bg-base-850',
}

export function StatusPill({ status }: { status: string }) {
  const cls = STATUS_CLASS[status] ?? 'text-ink-300 border-base-600 bg-base-850'
  return (
    <span className={`inline-block rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
