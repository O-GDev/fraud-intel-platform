import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAsync } from '@/hooks/useAsync'
import { getTransaction } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { StatusPill } from '@/components/common/StatusPill'
import { GraphViewer } from '@/components/graph/GraphViewer'
import { formatCurrency, formatDateTime } from '@/utils/format'
import type { GraphEdgeData, GraphNodeData } from '@/types'

export default function TransactionDetails() {
  const { transactionId = '' } = useParams()
  const { data, status, error, reload } = useAsync(() => getTransaction(transactionId), [transactionId])

  const { nodes, edges } = useMemo<{ nodes: GraphNodeData[]; edges: GraphEdgeData[] }>(() => {
    if (!data) return { nodes: [], edges: [] }
    const nodes: GraphNodeData[] = []
    const edges: GraphEdgeData[] = []
    if (data.source_account) nodes.push({ id: data.source_account, type: 'account', label: data.source_account })
    nodes.push({ id: data.id, type: 'transaction', label: data.id, sublabel: formatCurrency(data.amount, data.currency) })
    if (data.destination_account) nodes.push({ id: data.destination_account, type: 'account', label: data.destination_account })
    if (data.device_id) nodes.push({ id: data.device_id, type: 'device', label: data.device_id })

    if (data.source_account) edges.push({ id: 'e1', source: data.source_account, target: data.id, relationship: 'SENDS' })
    if (data.destination_account) edges.push({ id: 'e2', source: data.id, target: data.destination_account, relationship: 'RECEIVED_BY' })
    if (data.device_id) edges.push({ id: 'e3', source: data.id, target: data.device_id, relationship: 'USES_DEVICE' })

    return { nodes, edges }
  }, [data])

  if (status === 'loading') return <LoadingState label={`Loading transaction ${transactionId}…`} />
  if (status === 'error') return <ErrorState error={error} onRetry={reload} />
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-ink-100 font-mono">{data.id}</h2>
        <StatusPill status={data.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Source Account" value={data.source_account} link={data.source_account ? `/investigations/accounts/${data.source_account}` : undefined} />
        <Field label="Destination Account" value={data.destination_account} link={data.destination_account ? `/investigations/accounts/${data.destination_account}` : undefined} />
        <Field label="Amount" value={formatCurrency(data.amount, data.currency)} />
        <Field label="Channel" value={data.channel.replace(/_/g, ' ')} />
        <Field label="Type" value={data.type} />
        <Field label="Timestamp" value={formatDateTime(data.timestamp)} />
        <Field label="Device" value={data.device_id} link={data.device_id ? `/devices/${data.device_id}` : undefined} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="text-sm font-medium text-ink-100">Transaction Flow</span>
        </div>
        <div className="p-3">
          <GraphViewer nodes={nodes} edges={edges} height={260} />
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, link }: { label: string; value?: string | null; link?: string }) {
  const display = value ?? '—'
  return (
    <div className="panel p-3">
      <div className="label-eyebrow mb-1">{label}</div>
      {link ? (
        <Link to={link} className="text-sm font-medium text-accent font-mono hover:underline">{display}</Link>
      ) : (
        <div className="text-sm font-medium text-ink-100">{display}</div>
      )}
    </div>
  )
}
