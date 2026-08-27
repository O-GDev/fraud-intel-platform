import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getAccounts } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { AccountTable } from '@/components/accounts/AccountTable'
import { Pagination } from '@/components/common/Pagination'
import type { RiskLevel } from '@/types'

const PAGE_SIZE = 10

export default function Accounts() {
  const { data, status, error, reload } = useAsync(getAccounts, [])
  const [params, setParams] = useSearchParams()
  const [bank, setBank] = useState('ALL')
  const [risk, setRisk] = useState<'ALL' | RiskLevel>('ALL')
  const [page, setPage] = useState(1)
  const query = params.get('q') ?? ''

  const banks = useMemo(() => Array.from(new Set((data ?? []).map((a) => a.bank_name).filter(Boolean))) as string[], [data])

  const filtered = useMemo(() => {
    return (data ?? []).filter((a) => {
      if (bank !== 'ALL' && a.bank_name !== bank) return false
      if (risk !== 'ALL' && a.risk !== risk) return false
      if (query && !`${a.account_id} ${a.person_name}`.toUpperCase().includes(query.toUpperCase())) return false
      return true
    })
  }, [data, bank, risk, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-100">Account Explorer</h2>
          <p className="text-sm text-ink-500">Browse and filter every account known to the graph.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={bank}
            onChange={(e) => { setBank(e.target.value); setPage(1) }}
            className="input-field text-xs"
          >
            <option value="ALL">All banks</option>
            {banks.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            value={risk}
            onChange={(e) => { setRisk(e.target.value as 'ALL' | RiskLevel); setPage(1) }}
            className="input-field text-xs"
          >
            <option value="ALL">All risk levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          {query && (
            <button onClick={() => setParams({})} className="btn-ghost text-xs">
              Clear "{query}"
            </button>
          )}
        </div>
      </div>

      <div className="panel overflow-hidden">
        {status === 'loading' && <LoadingState label="Loading accounts…" />}
        {status === 'error' && <ErrorState error={error} onRetry={reload} />}
        {status === 'success' && filtered.length === 0 && <EmptyState icon={Wallet} title="No accounts match these filters." />}
        {status === 'success' && filtered.length > 0 && (
          <>
            <AccountTable accounts={pageItems} />
            <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
