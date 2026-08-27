import { Network } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getFraudRings } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { FraudRingCard } from '@/components/fraud-rings/FraudRingCard'

export default function FraudRings() {
  const { data, status, error, reload } = useAsync(getFraudRings, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink-100">Fraud Rings</h2>
        <p className="text-sm text-ink-500">Clusters of accounts, people, and devices connected by suspicious activity.</p>
      </div>

      {status === 'loading' && <LoadingState label="Clustering suspicious networks…" />}
      {status === 'error' && <ErrorState error={error} onRetry={reload} />}
      {status === 'success' && data && data.length === 0 && <EmptyState icon={Network} title="No fraud rings detected." />}
      {status === 'success' && data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((r) => (
            <FraudRingCard key={r.ring_id} ring={r} />
          ))}
        </div>
      )}
    </div>
  )
}
