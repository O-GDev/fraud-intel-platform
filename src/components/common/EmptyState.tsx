import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

export function EmptyState({ icon: Icon = Inbox, title, description }: { icon?: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Icon size={22} className="text-ink-700 mb-1" />
      <div className="text-sm text-ink-300 font-medium">{title}</div>
      {description && <div className="text-xs text-ink-500 max-w-xs">{description}</div>}
    </div>
  )
}
