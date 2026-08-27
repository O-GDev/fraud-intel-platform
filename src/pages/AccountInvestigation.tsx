import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, Landmark, Smartphone, ArrowLeftRight, Info } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getAccountInvestigation, getFraudSignals } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusPill } from '@/components/common/StatusPill'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { GraphViewer } from '@/components/graph/GraphViewer'
import { formatCurrency } from '@/utils/format'
import { computeIllustrativeScore, scoreToRiskLevel, signalsForAccount } from '@/utils/riskEngine'
import type { GraphEdgeData, GraphNodeData } from '@/types'

export default function AccountInvestigation() {
  const { accountId = '' } = useParams()
  const { data, status, error, reload } = useAsync(() => getAccountInvestigation(accountId), [accountId])
  const signals = useAsync(getFraudSignals, [])

  const accountSignals = useMemo(
    () => (signals.data ? signalsForAccount(signals.data, accountId) : []),
    [signals.data, accountId],
  )
  const illustrativeScore = useMemo(() => computeIllustrativeScore(accountSignals.map((s) => s.type)), [accountSignals])

  const { nodes, edges } = useMemo<{ nodes: GraphNodeData[]; edges: GraphEdgeData[] }>(() => {
    if (!data) return { nodes: [], edges: [] }
    const nodes: GraphNodeData[] = []
    const edges: GraphEdgeData[] = []

    if (data.person_name) {
      nodes.push({ id: data.person_id ?? 'person', type: 'person', label: data.person_name })
      edges.push({ id: 'owns', source: data.person_id ?? 'person', target: data.account_id, relationship: 'OWNS' })
    }
    nodes.push({ id: data.account_id, type: 'account', label: data.account_id, sublabel: data.account_type, risk: data.risk })

    if (data.bank_name) {
      nodes.push({ id: data.bank_id ?? 'bank', type: 'bank', label: data.bank_name, sublabel: data.bank_code })
      edges.push({ id: 'provides', source: data.bank_id ?? 'bank', target: data.account_id, relationship: 'PROVIDES' })
    }

    data.devices.forEach((d) => {
      nodes.push({ id: d.id, type: 'device', label: d.id, sublabel: d.operating_system })
      edges.push({ id: `uses-${d.id}`, source: data.account_id, target: d.id, relationship: 'USES_DEVICE' })
    })

    data.transactions.slice(0, 6).forEach((t) => {
      const isSource = t.source_account === data.account_id
      nodes.push({ id: t.id, type: 'transaction', label: t.id, sublabel: formatCurrency(t.amount, t.currency) })
      if (isSource) {
        edges.push({ id: `send-${t.id}`, source: data.account_id, target: t.id, relationship: 'SENDS', amount: t.amount })
        if (t.destination_account) {
          nodes.push({ id: t.destination_account, type: 'account', label: t.destination_account })
          edges.push({ id: `recv-${t.id}`, source: t.id, target: t.destination_account, relationship: 'RECEIVED_BY' })
        }
      } else {
        if (t.source_account) {
          nodes.push({ id: t.source_account, type: 'account', label: t.source_account })
          edges.push({ id: `send-${t.id}`, source: t.source_account, target: t.id, relationship: 'SENDS', amount: t.amount })
        }
        edges.push({ id: `recv-${t.id}`, source: t.id, target: data.account_id, relationship: 'RECEIVED_BY' })
      }
    })

    // de-dupe nodes by id
    const seen = new Set<string>()
    const dedupedNodes = nodes.filter((n) => (seen.has(n.id) ? false : (seen.add(n.id), true)))
    return { nodes: dedupedNodes, edges }
  }, [data])

  if (status === 'loading') return <LoadingState label={`Loading account ${accountId}…`} />
  if (status === 'error') return <ErrorState error={error} onRetry={reload} />
  if (!data) return <EmptyState title="Account not found." />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-ink-100 font-mono">{data.account_id}</h2>
            {data.risk && <RiskBadge level={data.risk} />}
          </div>
          <p className="text-sm text-ink-500 mt-1">
            {data.account_number} · {data.account_type}
          </p>
        </div>
        {accountSignals.length > 0 && (
          <div className="panel px-4 py-3 flex items-center gap-3">
            <div>
              <div className="label-eyebrow">Illustrative Risk Score</div>
              <div className="text-2xl font-semibold text-ink-100 tabular-nums">{illustrativeScore}<span className="text-sm text-ink-500">/100</span></div>
            </div>
            <RiskBadge level={scoreToRiskLevel(illustrativeScore)} />
          </div>
        )}
      </div>

      {accountSignals.length > 0 && (
        <div className="flex items-start gap-2 rounded-sm border border-risk-medium/30 bg-risk-medium/10 px-3 py-2 text-xs text-risk-medium">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>
            Illustrative risk score, derived client-side from {accountSignals.length} detected signal{accountSignals.length > 1 ? 's' : ''}. Not a backend-calculated value.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <User size={15} className="text-ink-500" />
            <span className="label-eyebrow">Owner</span>
          </div>
          {data.person_name ? (
            <dl className="space-y-2 text-sm">
              <Row label="Name" value={data.person_name} />
              <Row label="Phone" value={data.person_phone ?? '—'} />
              <Row label="Email" value={data.person_email ?? '—'} />
            </dl>
          ) : (
            <p className="text-sm text-ink-500">No owner linked to this account.</p>
          )}
        </div>

        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Landmark size={15} className="text-ink-500" />
            <span className="label-eyebrow">Bank</span>
          </div>
          {data.bank_name ? (
            <dl className="space-y-2 text-sm">
              <Row label="Name" value={data.bank_name} />
              <Row label="Code" value={data.bank_code ?? '—'} />
            </dl>
          ) : (
            <p className="text-sm text-ink-500">No bank linked to this account.</p>
          )}
        </div>

        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={15} className="text-ink-500" />
            <span className="label-eyebrow">Devices ({data.devices.length})</span>
          </div>
          {data.devices.length === 0 ? (
            <p className="text-sm text-ink-500">No devices associated with this account.</p>
          ) : (
            <ul className="space-y-2">
              {data.devices.map((d) => (
                <li key={d.id}>
                  <Link to={`/devices/${d.id}`} className="flex items-center justify-between text-sm hover:text-accent">
                    <span className="font-mono">{d.id}</span>
                    <span className="text-ink-500 text-xs">{d.operating_system} · {d.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="text-sm font-medium text-ink-100">Investigation Graph</span>
        </div>
        <div className="p-3">
          <GraphViewer nodes={nodes} edges={edges} height={420} />
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={15} className="text-ink-500" />
            <span className="text-sm font-medium text-ink-100">Transactions ({data.transactions.length})</span>
          </div>
        </div>
        {data.transactions.length === 0 ? (
          <EmptyState title="No transactions found." />
        ) : (
          <TransactionTable transactions={data.transactions} />
        )}
      </div>

      {accountSignals.length > 0 && (
        <div className="panel p-4">
          <div className="label-eyebrow mb-2">Related fraud signals</div>
          <div className="flex flex-wrap gap-2">
            {accountSignals.map((s) => (
              <Link key={s.id} to="/signals" className="rounded-sm border border-base-600 px-2.5 py-1 text-xs flex items-center gap-2 hover:border-accent">
                {s.type.replace(/_/g, ' ')}
                <StatusPill status={s.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-ink-100 font-medium">{value}</dd>
    </div>
  )
}
