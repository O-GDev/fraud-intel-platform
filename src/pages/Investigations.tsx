import { useMemo } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getAccounts, getFraudSignals } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { AccountTable } from '@/components/accounts/AccountTable'
import { SearchBar } from '@/components/common/SearchBar'

// Central hub for launching an investigation: search for an account,
// or jump straight into the accounts currently carrying elevated risk.
export default function Investigations() {
  const accounts = useAsync(getAccounts, [])
  const signals = useAsync(getFraudSignals, [])

  const flagged = useMemo(
    () => (accounts.data ?? []).filter((a) => a.risk === 'CRITICAL' || a.risk === 'HIGH'),
    [accounts.data],
  )

  return (
    <div className="space-y-6">
      <div className="panel p-6 flex flex-col items-center text-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 text-accent">
          <ShieldCheck size={20} />
        </div>
        <h2 className="text-lg font-semibold text-ink-100">Start an investigation</h2>
        <p className="text-sm text-ink-500 max-w-md">
          Search for an account, transaction, or device ID to open a full investigation view with owner, bank, devices, transactions, and the relationship graph.
        </p>
        <SearchBar />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ink-100">Accounts flagged for review</h3>
          <span className="text-xs text-ink-500">{signals.data?.length ?? 0} open signals across the network</span>
        </div>
        <div className="panel overflow-hidden">
          {accounts.status === 'loading' && <LoadingState label="Loading flagged accounts…" />}
          {accounts.status === 'error' && <ErrorState error={accounts.error} onRetry={accounts.reload} />}
          {accounts.status === 'success' && flagged.length === 0 && <EmptyState title="No accounts currently flagged for review." />}
          {accounts.status === 'success' && flagged.length > 0 && <AccountTable accounts={flagged} />}
        </div>
      </div>
    </div>
  )
}
