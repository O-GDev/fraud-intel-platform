import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAsync } from '@/hooks/useAsync'
import { getFraudRing } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { GraphViewer } from '@/components/graph/GraphViewer'
import { RiskBadge } from '@/components/common/RiskBadge'
import { formatCurrency } from '@/utils/format'
import { scoreToRiskLevel } from '@/utils/riskEngine'
import type { GraphEdgeData, GraphNodeData, SignalType } from '@/types'

const REASON_COPY: Record<SignalType, string> = {
  SHARED_DEVICE: 'Multiple accounts in this ring share the same device fingerprint.',
  RAPID_MONEY_MOVEMENT: 'Funds move through the ring within seconds to minutes of each hop.',
  CIRCULAR_TRANSACTION: 'Money flows in a closed loop back to an originating account.',
  SUSPICIOUS_CONNECTION: 'Accounts are linked through unusual or indirect relationships.',
  FRAUD_RING: 'The graph clustering algorithm flagged this group as a coordinated ring.',
}

export default function FraudRingDetails() {
  const { ringId = '' } = useParams()
  const { data, status, error, reload } = useAsync(() => getFraudRing(ringId), [ringId])

  const { nodes, edges } = useMemo<{ nodes: GraphNodeData[]; edges: GraphEdgeData[] }>(() => {
    if (!data) return { nodes: [], edges: [] }
    const nodes: GraphNodeData[] = []
    const edges: GraphEdgeData[] = []
    ;(data.people ?? []).forEach((p, i) => nodes.push({ id: `p-${i}`, type: 'person', label: p }))
    ;(data.accounts ?? []).forEach((a) => nodes.push({ id: a, type: 'account', label: a, risk: 'HIGH' }))
    ;(data.devices ?? []).forEach((d) => nodes.push({ id: d, type: 'device', label: d }))

    ;(data.people ?? []).forEach((_, i) => {
      const acct = data.accounts?.[i]
      if (acct) edges.push({ id: `owns-${i}`, source: `p-${i}`, target: acct, relationship: 'OWNS' })
    })
    ;(data.accounts ?? []).forEach((a, i) => {
      const nextAcct = data.accounts?.[(i + 1) % (data.accounts?.length ?? 1)]
      if (nextAcct && nextAcct !== a) edges.push({ id: `flow-${i}`, source: a, target: nextAcct, relationship: 'SENDS' })
    })
    ;(data.devices ?? []).forEach((d, i) => {
      const acct = data.accounts?.[i]
      if (acct) edges.push({ id: `device-${i}`, source: acct, target: d, relationship: 'USES_DEVICE' })
    })

    return { nodes, edges }
  }, [data])

  if (status === 'loading') return <LoadingState label={`Loading ring ${ringId}…`} />
  if (status === 'error') return <ErrorState error={error} onRetry={reload} />
  if (!data) return null

  const risk = data.risk_score !== undefined ? scoreToRiskLevel(data.risk_score) : 'MEDIUM'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-ink-100 font-mono">{data.ring_id}</h2>
        <RiskBadge level={risk} />
        {data.risk_score !== undefined && <span className="text-xs text-ink-500">Risk score {data.risk_score}/100</span>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Accounts" value={data.account_count} />
        <Stat label="People" value={data.people_count} />
        <Stat label="Devices" value={data.device_count} />
        <Stat label="Transactions" value={data.transaction_count} />
        <Stat label="Total Value" value={formatCurrency(data.total_value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel lg:col-span-2">
          <div className="panel-header">
            <span className="text-sm font-medium text-ink-100">Ring Network</span>
          </div>
          <div className="p-3">
            <GraphViewer nodes={nodes} edges={edges} height={400} />
          </div>
        </div>

        <div className="panel p-4">
          <div className="label-eyebrow mb-2">Why is this ring suspicious?</div>
          <ul className="space-y-2.5">
            {data.signals.map((s) => (
              <li key={s} className="text-sm">
                <div className="font-medium text-ink-100">{s.replace(/_/g, ' ')}</div>
                <div className="text-xs text-ink-500">{REASON_COPY[s]}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(data.accounts?.length ?? 0) > 0 && (
        <div className="panel p-4">
          <div className="label-eyebrow mb-2">Accounts in this ring</div>
          <div className="flex flex-wrap gap-2">
            {data.accounts!.map((a) => (
              <Link key={a} to={`/investigations/accounts/${a}`} className="rounded-sm border border-base-600 px-2.5 py-1 text-xs font-mono text-accent hover:border-accent">
                {a}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="panel p-3 text-center">
      <div className="text-lg font-semibold text-ink-100 tabular-nums">{value}</div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  )
}
