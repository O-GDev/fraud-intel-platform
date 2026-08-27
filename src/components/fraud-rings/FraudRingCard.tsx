import { Network, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FraudRing } from '@/types'
import { formatCurrency } from '@/utils/format'
import { scoreToRiskLevel } from '@/utils/riskEngine'
import { RiskBadge } from '@/components/common/RiskBadge'

export function FraudRingCard({ ring }: { ring: FraudRing }) {
  const risk = ring.risk_score !== undefined ? scoreToRiskLevel(ring.risk_score) : 'MEDIUM'
  return (
    <Link to={`/fraud-rings/${ring.ring_id}`} className="panel p-4 flex flex-col gap-3 hover:border-accent transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-risk-critical/10 text-risk-critical">
            <Network size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-100">{ring.ring_id}</div>
            <div className="text-xs text-ink-500">{ring.signals.length} signal types detected</div>
          </div>
        </div>
        <RiskBadge level={risk} />
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div>
          <div className="text-base font-semibold text-ink-100 tabular-nums">{ring.account_count}</div>
          <div className="text-ink-500">Accounts</div>
        </div>
        <div>
          <div className="text-base font-semibold text-ink-100 tabular-nums">{ring.people_count}</div>
          <div className="text-ink-500">People</div>
        </div>
        <div>
          <div className="text-base font-semibold text-ink-100 tabular-nums">{ring.device_count}</div>
          <div className="text-ink-500">Devices</div>
        </div>
        <div>
          <div className="text-base font-semibold text-ink-100 tabular-nums">{ring.transaction_count}</div>
          <div className="text-ink-500">Txns</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-base-700 pt-3 text-sm">
        <span className="text-ink-500">Total movement</span>
        <span className="font-semibold text-ink-100 tabular-nums">{formatCurrency(ring.total_value)}</span>
      </div>

      <div className="flex items-center gap-1 text-xs text-accent">
        Investigate ring <ArrowRight size={12} />
      </div>
    </Link>
  )
}
