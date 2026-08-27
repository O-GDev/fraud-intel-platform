import { Smartphone } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getDevices } from '@/api/fraudApi'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { DeviceTable } from '@/components/devices/DeviceTable'

export default function Devices() {
  const { data, status, error, reload } = useAsync(getDevices, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink-100">Devices</h2>
        <p className="text-sm text-ink-500">Devices seen across the transaction network, flagged when shared across people.</p>
      </div>

      <div className="panel overflow-hidden">
        {status === 'loading' && <LoadingState label="Loading devices…" />}
        {status === 'error' && <ErrorState error={error} onRetry={reload} />}
        {status === 'success' && data && data.length === 0 && <EmptyState icon={Smartphone} title="No devices found." />}
        {status === 'success' && data && data.length > 0 && <DeviceTable devices={data} />}
      </div>
    </div>
  )
}
