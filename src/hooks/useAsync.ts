import { useCallback, useEffect, useRef, useState } from 'react'
import type { ApiError } from '@/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface UseAsyncResult<T> {
  data: T | null
  status: Status
  error: ApiError | null
  reload: () => void
}

// Small custom hook for "fetch on mount / dependency change, expose
// loading + error + retry" — the shape almost every page in this app
// needs. Deliberately kept dependency-free rather than pulling in
// React Query, since the data-fetching needs here are simple
// (no caching across routes, no background refetch).
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<ApiError | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const load = useCallback(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)
    fnRef
      .current()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setStatus('success')
      })
      .catch((err: ApiError) => {
        if (cancelled) return
        setError(err?.message ? err : { status: 'network', message: 'Something went wrong.' })
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const cancel = load()
    return cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, status, error, reload: load }
}
