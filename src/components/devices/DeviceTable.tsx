import { useNavigate } from 'react-router-dom'
import type { Device } from '@/types'
import { RiskBadge } from '@/components/common/RiskBadge'

export function DeviceTable({ devices }: { devices: Device[] }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-x-auto">
      <table className="table-shell">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Fingerprint</th>
            <th>Type</th>
            <th>OS</th>
            <th>People</th>
            <th>Accounts</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id} className="cursor-pointer" onClick={() => navigate(`/devices/${d.id}`)}>
              <td className="font-mono text-accent">{d.id}</td>
              <td className="font-mono text-ink-500 text-xs">{d.fingerprint}</td>
              <td className="text-ink-300">{d.type ?? '—'}</td>
              <td className="text-ink-300">{d.operating_system ?? '—'}</td>
              <td className="tabular-nums text-ink-300">{d.associated_people?.length ?? 0}</td>
              <td className="tabular-nums text-ink-300">{d.associated_accounts?.length ?? 0}</td>
              <td>{d.risk ? <RiskBadge level={d.risk} size="sm" /> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
