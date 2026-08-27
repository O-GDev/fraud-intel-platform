import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAsync } from '@/hooks/useAsync'
import { getDevice } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { GraphViewer } from '@/components/graph/GraphViewer'
import { RiskBadge } from '@/components/common/RiskBadge'
import type { GraphEdgeData, GraphNodeData } from '@/types'

export default function DeviceDetails() {
  const { deviceId = '' } = useParams()
  const { data, status, error, reload } = useAsync(() => getDevice(deviceId), [deviceId])

  const { nodes, edges } = useMemo<{ nodes: GraphNodeData[]; edges: GraphEdgeData[] }>(() => {
    if (!data) return { nodes: [], edges: [] }
    const nodes: GraphNodeData[] = [{ id: data.id, type: 'device', label: data.id, sublabel: data.operating_system }]
    const edges: GraphEdgeData[] = []
    ;(data.associated_people ?? []).forEach((p, i) => {
      const id = `person-${i}`
      nodes.push({ id, type: 'person', label: p })
      edges.push({ id: `e-${id}`, source: id, target: data.id, relationship: 'USES_DEVICE' })
    })
    return { nodes, edges }
  }, [data])

  if (status === 'loading') return <LoadingState label={`Loading device ${deviceId}…`} />
  if (status === 'error') return <ErrorState error={error} onRetry={reload} />
  if (!data) return null

  const isShared = (data.associated_people?.length ?? 0) > 1

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-ink-100 font-mono">{data.id}</h2>
        {data.risk && <RiskBadge level={data.risk} />}
        {isShared && <RiskBadge level="HIGH" />}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Fingerprint" value={data.fingerprint} mono />
        <Field label="Device Type" value={data.type} />
        <Field label="Operating System" value={data.operating_system} />
        <Field label="Associated People" value={String(data.associated_people?.length ?? 0)} />
      </div>

      {isShared && (
        <div className="rounded-sm border border-risk-high/30 bg-risk-high/10 px-3 py-2 text-xs text-risk-high">
          This device is associated with {data.associated_people?.length} distinct people — a strong shared-device fraud signal.
        </div>
      )}

      <div className="panel p-4">
        <div className="label-eyebrow mb-2">Associated people</div>
        <ul className="flex flex-wrap gap-2">
          {(data.associated_people ?? []).map((p) => (
            <li key={p} className="rounded-sm border border-base-600 px-2.5 py-1 text-xs text-ink-100">{p}</li>
          ))}
        </ul>
      </div>

      <div className="panel p-4">
        <div className="label-eyebrow mb-2">Associated accounts</div>
        <div className="flex flex-wrap gap-2">
          {(data.associated_accounts ?? []).map((a) => (
            <Link key={a} to={`/investigations/accounts/${a}`} className="rounded-sm border border-base-600 px-2.5 py-1 text-xs font-mono text-accent hover:border-accent">
              {a}
            </Link>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="text-sm font-medium text-ink-100">Device Graph</span>
        </div>
        <div className="p-3">
          <GraphViewer nodes={nodes} edges={edges} height={320} />
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="panel p-3">
      <div className="label-eyebrow mb-1">{label}</div>
      <div className={`text-sm font-medium text-ink-100 ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</div>
    </div>
  )
}
