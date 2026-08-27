import { useMemo, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getFraudSignals } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { SignalCard } from '@/components/signals/SignalCard'
import type { SignalType } from '@/types'

const CATEGORIES: { value: SignalType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All signals' },
  { value: 'SHARED_DEVICE', label: 'Shared Device' },
  { value: 'RAPID_MONEY_MOVEMENT', label: 'Rapid Money Movement' },
  { value: 'CIRCULAR_TRANSACTION', label: 'Circular Transactions' },
  { value: 'SUSPICIOUS_CONNECTION', label: 'Suspicious Connections' },
  { value: 'FRAUD_RING', label: 'Fraud Rings' },
]

export default function FraudSignals() {
  const { data, status, error, reload } = useAsync(getFraudSignals, [])
  const [category, setCategory] = useState<SignalType | 'ALL'>('ALL')

  const filtered = useMemo(() => (data ?? []).filter((s) => category === 'ALL' || s.type === category), [data, category])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-100">Fraud Signals</h2>
          <p className="text-sm text-ink-500">Every anomaly detected across shared devices, money movement, and transaction cycles.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-sm px-2.5 py-1 text-xs border ${
                category === c.value ? 'border-accent text-accent bg-accent/10' : 'border-base-600 text-ink-500 hover:text-ink-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' && <LoadingState label="Scanning for fraud signals…" />}
      {status === 'error' && <ErrorState error={error} onRetry={reload} />}
      {status === 'success' && filtered.length === 0 && <EmptyState icon={ShieldAlert} title="No fraud signals detected." />}
      {status === 'success' && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((s) => (
            <SignalCard key={s.id} signal={s} />
          ))}
        </div>
      )}
    </div>
  )
}
