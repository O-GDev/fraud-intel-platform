import type { RiskLevel } from '@/types'
import { RISK_LABEL } from '@/utils/riskEngine'

const DOT_CLASS: Record<RiskLevel, string> = {
  CRITICAL: 'bg-risk-critical',
  HIGH: 'bg-risk-high',
  MEDIUM: 'bg-risk-medium',
  LOW: 'bg-risk-low',
  INFO: 'bg-risk-info',
}

const TEXT_CLASS: Record<RiskLevel, string> = {
  CRITICAL: 'text-risk-critical',
  HIGH: 'text-risk-high',
  MEDIUM: 'text-risk-medium',
  LOW: 'text-risk-low',
  INFO: 'text-risk-info',
}

export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-base-600 bg-base-850 font-semibold uppercase tracking-wide ${TEXT_CLASS[level]} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[level]}`} aria-hidden />
      {RISK_LABEL[level]}
    </span>
  )
}
