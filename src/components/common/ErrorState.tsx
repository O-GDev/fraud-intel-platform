import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ApiError } from '@/types'

export function ErrorState({ error, onRetry }: { error?: ApiError | null; onRetry?: () => void }) {
  const isNetwork = error?.status === 'network'
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-risk-critical/10 p-3">
        <AlertTriangle size={20} className="text-risk-critical" />
      </div>
      <div className="text-sm text-ink-100 font-medium">
        {isNetwork ? 'Unable to connect to the fraud detection server.' : error?.message || 'Something went wrong.'}
      </div>
      {isNetwork && <div className="text-xs text-ink-500 max-w-xs">Check that the FastAPI backend is running and reachable at the configured API base URL.</div>}
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-1">
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  )
}
