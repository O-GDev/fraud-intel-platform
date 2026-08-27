import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getTransactions } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { Pagination } from '@/components/common/Pagination'

const PAGE_SIZE = 10

export default function Transactions() {
  const { data, status, error, reload } = useAsync(getTransactions, [])
  const [q, setQ] = useState('')
  const [status_, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return (data ?? []).filter((t) => {
      if (status_ !== 'ALL' && t.status !== status_) return false
      if (q && !`${t.id} ${t.source_account} ${t.destination_account}`.toUpperCase().includes(q.toUpperCase())) return false
      return true
    })
  }, [data, q, status_])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-100">Transactions</h2>
          <p className="text-sm text-ink-500">Search, filter, and inspect every transaction on record.</p>
        </div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="Search ID or account…"
            className="input-field text-xs w-56"
          />
          <select value={status_} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="input-field text-xs">
            <option value="ALL">All statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      <div className="panel overflow-hidden">
        {status === 'loading' && <LoadingState label="Loading transactions…" />}
        {status === 'error' && <ErrorState error={error} onRetry={reload} />}
        {status === 'success' && filtered.length === 0 && <EmptyState icon={ArrowLeftRight} title="No transactions found." />}
        {status === 'success' && filtered.length > 0 && (
          <>
            <TransactionTable transactions={pageItems} />
            <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
