import { useState } from 'react'

export default function Settings() {
  const [apiBase] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')
  const [useMock] = useState(import.meta.env.VITE_USE_MOCK_DATA === 'true')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-ink-100">Settings</h2>
        <p className="text-sm text-ink-500">Environment and connection configuration for this analyst workstation.</p>
      </div>

      <div className="panel p-4 space-y-4">
        <div>
          <div className="label-eyebrow mb-1">API Base URL</div>
          <div className="input-field font-mono text-xs w-fit">{apiBase}</div>
          <p className="text-xs text-ink-500 mt-1">Set via VITE_API_BASE_URL in your .env file. Restart the dev server after changing it.</p>
        </div>
        <div>
          <div className="label-eyebrow mb-1">Mock Data Mode</div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${useMock ? 'bg-risk-medium' : 'bg-risk-low'}`} />
            <span className="text-sm text-ink-100">{useMock ? 'Enabled — using local mock data' : 'Disabled — using live backend'}</span>
          </div>
          <p className="text-xs text-ink-500 mt-1">Toggle VITE_USE_MOCK_DATA in your .env file to switch between mock and live data.</p>
        </div>
      </div>

      <div className="panel p-4">
        <div className="label-eyebrow mb-2">About</div>
        <p className="text-sm text-ink-300">
          Sentry is a fraud intelligence and investigation interface for the Neo4j-backed detection service. Analyst accounts, roles,
          and audit logging are managed by your institution's identity provider and are not configured from this screen.
        </p>
      </div>
    </div>
  )
}
