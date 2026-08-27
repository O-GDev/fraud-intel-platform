import { User, Wallet, ArrowLeftRight, Smartphone, Landmark, Network } from 'lucide-react'

const ITEMS = [
  { icon: User, label: 'Person', color: '#8b5cf6' },
  { icon: Wallet, label: 'Account', color: '#2f6fed' },
  { icon: ArrowLeftRight, label: 'Transaction', color: '#e8b93a' },
  { icon: Smartphone, label: 'Device', color: '#22c1c3' },
  { icon: Landmark, label: 'Bank', color: '#78829a' },
  { icon: Network, label: 'Fraud Ring', color: '#e5484d' },
]

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-sm border border-base-600 bg-base-900/90 px-3 py-2 text-[11px] text-ink-300">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className="flex h-4 w-4 items-center justify-center rounded-sm"
            style={{ backgroundColor: `${item.color}22`, color: item.color }}
          >
            <item.icon size={10} />
          </div>
          {item.label}
        </div>
      ))}
    </div>
  )
}
