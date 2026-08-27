import { useState } from 'react'
import { ChevronDown, Smartphone, Zap, RefreshCw, Link2, Network } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FraudSignal, SignalType } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'
import { formatDateTime } from '@/utils/format'

const SIGNAL_META: Record<SignalType, { label: string; icon: typeof Smartphone }> = {
  SHARED_DEVICE: { label: 'Shared Device', icon: Smartphone },
  RAPID_MONEY_MOVEMENT: { label: 'Rapid Money Movement', icon: Zap },
  CIRCULAR_TRANSACTION: { label: 'Circular Transaction', icon: RefreshCw },
  SUSPICIOUS_CONNECTION: { label: 'Suspicious Connection', icon: Link2 },
  FRAUD_RING: { label: 'Fraud Ring', icon: Network },
}

export function SignalCard({ signal }: { signal: FraudSignal }) {
  const [open, setOpen] = useState(false)
  const meta = SIGNAL_META[signal.type]

  return (
    <div className="panel overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-base-850"
        aria-expanded={open}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent/10 text-accent">
          <meta.icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-ink-100">{meta.label}</span>
            <RiskBadge level={signal.severity} size="sm" />
            <StatusPill status={signal.status} />
          </div>
          <div className="text-xs text-ink-500 truncate mt-0.5">{signal.explanation}</div>
        </div>
        <span className="text-xs text-ink-500 shrink-0 hidden sm:block">{formatDateTime(signal.timestamp)}</span>
        <ChevronDown size={16} className={`shrink-0 text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-base-700 px-4 py-3 space-y-3 text-sm bg-base-850/40">
          <div>
            <div className="label-eyebrow mb-1">Explanation</div>
            <p className="text-ink-300">{signal.explanation}</p>
          </div>

          {signal.accounts.length > 0 && (
            <div>
              <div className="label-eyebrow mb-1">Accounts involved</div>
              <div className="flex flex-wrap gap-1.5">
                {signal.accounts.map((a) => (
                  <Link key={a} to={`/investigations/accounts/${a}`} className="rounded-sm border border-base-600 px-2 py-0.5 text-xs font-mono text-accent hover:border-accent">
                    {a}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {signal.transactions.length > 0 && (
            <div>
              <div className="label-eyebrow mb-1">Transactions</div>
              <div className="flex flex-wrap gap-1.5">
                {signal.transactions.map((t) => (
                  <Link key={t} to={`/transactions/${t}`} className="rounded-sm border border-base-600 px-2 py-0.5 text-xs font-mono text-accent hover:border-accent">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {signal.evidence && signal.evidence.length > 0 && (
            <div>
              <div className="label-eyebrow mb-1">Evidence</div>
              <ul className="space-y-1 text-ink-300 text-xs list-disc list-inside">
                {signal.evidence.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
