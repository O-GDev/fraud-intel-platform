import { Handle, Position, type NodeProps } from 'reactflow'
import { User, Wallet, ArrowLeftRight, Smartphone, Landmark, Network } from 'lucide-react'
import type { GraphNodeData } from '@/types'
import { RISK_COLOR } from '@/utils/riskEngine'

const ICON = {
  person: User,
  account: Wallet,
  transaction: ArrowLeftRight,
  device: Smartphone,
  bank: Landmark,
  fraud_ring: Network,
} as const

const RING_COLOR = {
  person: '#8b5cf6',
  account: '#2f6fed',
  transaction: '#e8b93a',
  device: '#22c1c3',
  bank: '#78829a',
  fraud_ring: '#e5484d',
} as const

export function EntityNode({ data, selected }: NodeProps<GraphNodeData & { dimmed?: boolean }>) {
  const Icon = ICON[data.type]
  const color = data.risk ? RISK_COLOR[data.risk] : RING_COLOR[data.type]

  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-base-900 px-3 py-2 shadow-panel transition-opacity ${
        selected ? 'border-accent' : 'border-base-600'
      } ${data.dimmed ? 'opacity-30' : 'opacity-100'}`}
      style={{ minWidth: 140 }}
    >
      <Handle type="target" position={Position.Left} className="!bg-base-600 !border-none !h-1.5 !w-1.5" />
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: `${color}22`, color }}>
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-ink-100 truncate">{data.label}</div>
        {data.sublabel && <div className="text-[10px] text-ink-500 truncate">{data.sublabel}</div>}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-base-600 !border-none !h-1.5 !w-1.5" />
    </div>
  )
}

