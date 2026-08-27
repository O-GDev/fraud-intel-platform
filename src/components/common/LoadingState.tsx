import { Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Loading data…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
      <Loader2 size={22} className="animate-spin text-accent" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
