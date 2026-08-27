import { useNavigate } from 'react-router-dom'
import type { Account } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'

export function AccountTable({ accounts }: { accounts: Account[] }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-x-auto">
      <table className="table-shell">
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Owner</th>
            <th>Bank</th>
            <th>Type</th>
            <th>Risk</th>
            <th>Transactions</th>
            <th>Devices</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr
              key={a.account_id}
              className="cursor-pointer"
              onClick={() => navigate(`/investigations/accounts/${a.account_id}`)}
            >
              <td className="font-mono text-accent">{a.account_id}</td>
              <td>{a.person_name ?? '—'}</td>
              <td>{a.bank_name ?? '—'}</td>
              <td className="text-ink-300">{a.account_type}</td>
              <td>{a.risk ? <RiskBadge level={a.risk} size="sm" /> : '—'}</td>
              <td className="tabular-nums text-ink-300">{a.transaction_count ?? '—'}</td>
              <td className="tabular-nums text-ink-300">{a.device_count ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
