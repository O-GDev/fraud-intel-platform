import { ShieldAlert, Wallet, ArrowLeftRight, Network, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAsync } from '@/hooks/useAsync'
import { getDashboardSummary, getFraudSignals, getRiskOverview, getAccounts } from '@/api/fraudApi'
import { StatCard } from '@/components/common/StatCard'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { RiskOverviewChart } from '@/components/dashboard/RiskOverviewChart'
import { SignalCard } from '@/components/signals/SignalCard'
import { RiskBadge } from '@/components/common/RiskBadge'
import { GraphViewer } from '@/components/graph/GraphViewer'
import { formatDateTime } from '@/utils/format'
import type { GraphEdgeData, GraphNodeData } from '@/types'

export default function Dashboard() {
  const summary = useAsync(getDashboardSummary, [])
  const risk = useAsync(getRiskOverview, [])
  const signals = useAsync(getFraudSignals, [])
  const accounts = useAsync(getAccounts, [])

  const flowNodes: GraphNodeData[] = [
    { id: 'A001', type: 'account', label: 'A001', sublabel: 'Daniel Okafor', risk: 'HIGH' },
    { id: 'T020', type: 'transaction', label: 'T020', sublabel: '₦2.5M' },
    { id: 'A003', type: 'account', label: 'A003', sublabel: 'Michael Adeyemi', risk: 'HIGH' },
    { id: 'T021', type: 'transaction', label: 'T021', sublabel: '₦2.3M' },
    { id: 'A007', type: 'account', label: 'A007', sublabel: 'Samuel Bello', risk: 'HIGH' },
  ]
  const flowEdges: GraphEdgeData[] = [
    { id: 'e1', source: 'A001', target: 'T020', relationship: 'SENDS' },
    { id: 'e2', source: 'T020', target: 'A003', relationship: 'RECEIVED_BY' },
    { id: 'e3', source: 'A003', target: 'T021', relationship: 'SENDS' },
    { id: 'e4', source: 'T021', target: 'A007', relationship: 'RECEIVED_BY' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-100">Fraud Intelligence Overview</h2>
        <p className="text-sm text-ink-500">Real-time signals across accounts, devices, and transaction networks.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Accounts Investigated" value={summary.data?.accounts_investigated ?? (summary.status === 'success' ? null : '…')} icon={Wallet} />
        <StatCard label="Active Fraud Signals" value={summary.data?.active_fraud_signals ?? (summary.status === 'success' ? null : '…')} icon={ShieldAlert} accent="text-risk-high" />
        <StatCard label="Suspicious Transactions" value={summary.data?.suspicious_transactions ?? (summary.status === 'success' ? null : '…')} icon={ArrowLeftRight} accent="text-risk-medium" />
        <StatCard label="Fraud Rings Detected" value={summary.data?.fraud_rings_detected ?? (summary.status === 'success' ? null : '…')} icon={Network} accent="text-risk-critical" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel lg:col-span-1">
          <div className="panel-header">
            <span className="text-sm font-medium text-ink-100">Risk Overview</span>
          </div>
          <div className="p-3">
            {risk.status === 'loading' && <LoadingState label="Loading risk profile…" />}
            {risk.status === 'error' && <ErrorState error={risk.error} onRetry={risk.reload} />}
            {risk.status === 'success' && risk.data && <RiskOverviewChart data={risk.data} />}
          </div>
        </div>

        <div className="panel lg:col-span-2">
          <div className="panel-header">
            <span className="text-sm font-medium text-ink-100">Suspicious Transaction Flow</span>
            <span className="text-xs text-ink-500">A001 → A003 → A007</span>
          </div>
          <div className="p-3">
            <GraphViewer nodes={flowNodes} edges={flowEdges} height={280} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-100">Recent Fraud Signals</h3>
            <Link to="/signals" className="text-xs text-accent flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {signals.status === 'loading' && <LoadingState />}
          {signals.status === 'error' && <ErrorState error={signals.error} onRetry={signals.reload} />}
          {signals.status === 'success' && signals.data && signals.data.length === 0 && (
            <EmptyState title="No fraud signals detected." icon={ShieldAlert} />
          )}
          {signals.status === 'success' && signals.data && signals.data.slice(0, 3).map((s) => <SignalCard key={s.id} signal={s} />)}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-100">Recent Investigations</h3>
            <Link to="/accounts" className="text-xs text-accent flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="panel overflow-hidden">
            {accounts.status === 'loading' && <LoadingState />}
            {accounts.status === 'error' && <ErrorState error={accounts.error} onRetry={accounts.reload} />}
            {accounts.status === 'success' && accounts.data && (
              <div className="divide-y divide-base-800">
                {accounts.data.slice(0, 5).map((a) => (
                  <Link key={a.account_id} to={`/investigations/accounts/${a.account_id}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-base-850">
                    <div>
                      <div className="text-sm font-medium text-ink-100 font-mono">{a.account_id}</div>
                      <div className="text-xs text-ink-500">{a.person_name} · {a.bank_name}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.risk && <RiskBadge level={a.risk} size="sm" />}
                      <span className="text-xs text-ink-500 hidden sm:block">{formatDateTime('2026-08-20T14:00:00')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
