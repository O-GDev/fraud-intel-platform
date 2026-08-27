import { useNavigate } from 'react-router-dom'
import type { Transaction } from '@/types'
import { StatusPill } from '@/components/common/StatusPill'
import { formatCurrency, formatDateTime } from '@/utils/format'

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-x-auto">
      <table className="table-shell">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Amount</th>
            <th>Channel</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/transactions/${t.id}`)}>
              <td className="font-mono text-accent">{t.id}</td>
              <td className="font-mono text-ink-300">{t.source_account ?? '—'}</td>
              <td className="font-mono text-ink-300">{t.destination_account ?? '—'}</td>
              <td className="tabular-nums">{formatCurrency(t.amount, t.currency)}</td>
              <td className="text-ink-300">{t.channel.replace(/_/g, ' ')}</td>
              <td><StatusPill status={t.status} /></td>
              <td className="text-ink-500 whitespace-nowrap">{formatDateTime(t.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
