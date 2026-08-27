import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { GraphEdgeData, GraphNodeData } from '@/types'
import { nodeTypes } from './graphNodeTypes'
import { GraphLegend } from './GraphLegend'
import { formatCompactCurrency } from '@/utils/format'

interface GraphViewerProps {
  nodes: GraphNodeData[]
  edges: GraphEdgeData[]
  onNodeClick?: (node: GraphNodeData) => void
  height?: number
  layout?: 'horizontal' | 'circular'
}

// Very small deterministic layout: horizontal chains lay nodes left to
// right in the order they're first referenced; circular arranges nodes
// evenly around a ring (used for circular-transaction visualizations).
function computeLayout(nodes: GraphNodeData[], edges: GraphEdgeData[], layout: 'horizontal' | 'circular'): Node[] {
  if (layout === 'circular') {
    const r = 160
    const cx = 260
    const cy = 200
    return nodes.map((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
      return {
        id: n.id,
        type: 'entity',
        position: { x: cx + r * Math.cos(angle) - 70, y: cy + r * Math.sin(angle) - 20 },
        data: n,
      }
    })
  }

  // Horizontal: topological-ish placement by BFS depth from first node.
  const depth = new Map<string, number>()
  const adjacency = new Map<string, string[]>()
  edges.forEach((e) => {
    if (!adjacency.has(e.source)) adjacency.set(e.source, [])
    adjacency.get(e.source)!.push(e.target)
  })
  const roots = nodes.filter((n) => !edges.some((e) => e.target === n.id))
  const queue: string[] = roots.length ? roots.map((r) => r.id) : [nodes[0]?.id].filter(Boolean) as string[]
  queue.forEach((id) => depth.set(id, 0))
  let i = 0
  while (i < queue.length) {
    const id = queue[i++]
    const d = depth.get(id) ?? 0
    for (const next of adjacency.get(id) ?? []) {
      if (!depth.has(next)) {
        depth.set(next, d + 1)
        queue.push(next)
      }
    }
  }
  nodes.forEach((n) => {
    if (!depth.has(n.id)) depth.set(n.id, 0)
  })

  const columns = new Map<number, string[]>()
  nodes.forEach((n) => {
    const d = depth.get(n.id) ?? 0
    if (!columns.has(d)) columns.set(d, [])
    columns.get(d)!.push(n.id)
  })

  const nodeById = new Map(nodes.map((n) => [n.id, n]))
  const result: Node[] = []
  columns.forEach((ids, col) => {
    ids.forEach((id, row) => {
      result.push({
        id,
        type: 'entity',
        position: { x: col * 220 + 20, y: row * 100 + 40 },
        data: nodeById.get(id)!,
      })
    })
  })
  return result
}

export function GraphViewer({ nodes, edges, onNodeClick, height = 420, layout = 'horizontal' }: GraphViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const initialNodes = useMemo(() => computeLayout(nodes, edges, layout), [nodes, edges, layout])

  const connected = useMemo(() => {
    if (!selectedId) return null
    const set = new Set<string>([selectedId])
    edges.forEach((e) => {
      if (e.source === selectedId) set.add(e.target)
      if (e.target === selectedId) set.add(e.source)
    })
    return set
  }, [selectedId, edges])

  const flowNodes = useMemo(
    () =>
      initialNodes.map((n) => ({
        ...n,
        data: { ...n.data, dimmed: connected ? !connected.has(n.id) : false },
        selected: n.id === selectedId,
      })),
    [initialNodes, connected, selectedId],
  )

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => {
        const dimmed = connected ? !(connected.has(e.source) && connected.has(e.target)) : false
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.amount ? `${e.relationship} · ${formatCompactCurrency(e.amount)}` : e.relationship,
          labelStyle: { fill: '#aab2c2', fontSize: 10 },
          labelBgStyle: { fill: '#10141b' },
          style: { stroke: dimmed ? '#252c39' : '#3a4353', opacity: dimmed ? 0.3 : 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3a4353', width: 14, height: 14 },
        }
      }),
    [edges, connected],
  )

  const [rfNodes, setRfNodes] = useState<Node[]>(flowNodes)
  const [rfEdges, setRfEdges] = useState<Edge[]>(flowEdges)

  // flowNodes/flowEdges are recomputed whenever the underlying data or
  // selection changes; keep the controlled ReactFlow state in sync.
  useEffect(() => setRfNodes(flowNodes), [flowNodes])
  useEffect(() => setRfEdges(flowEdges), [flowEdges])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setRfNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setRfEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )

  const handleNodeClick = useCallback(
    (_: unknown, node: Node) => {
      setSelectedId((cur) => (cur === node.id ? null : node.id))
      onNodeClick?.(node.data as GraphNodeData)
    },
    [onNodeClick],
  )

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-ink-500 border border-dashed border-base-600 rounded-md" style={{ height }}>
        No graph data available for this record.
      </div>
    )
  }

  return (
    <div className="relative rounded-md border border-base-700 bg-base-950" style={{ height }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={() => setSelectedId(null)}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1b212c" gap={20} />
        <Controls showInteractive={false} className="!bg-base-900 !border-base-600 [&>button]:!bg-base-900 [&>button]:!border-base-600 [&>button]:!text-ink-300" />
      </ReactFlow>
      <div className="absolute bottom-3 left-3 z-10">
        <GraphLegend />
      </div>
    </div>
  )
}
