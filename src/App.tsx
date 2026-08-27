import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Accounts from '@/pages/Accounts'
import Investigations from '@/pages/Investigations'
import AccountInvestigation from '@/pages/AccountInvestigation'
import Transactions from '@/pages/Transactions'
import TransactionDetails from '@/pages/TransactionDetails'
import Devices from '@/pages/Devices'
import DeviceDetails from '@/pages/DeviceDetails'
import FraudSignals from '@/pages/FraudSignals'
import FraudRings from '@/pages/FraudRings'
import FraudRingDetails from '@/pages/FraudRingDetails'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/investigations" element={<Investigations />} />
        <Route path="/investigations/accounts/:accountId" element={<AccountInvestigation />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:transactionId" element={<TransactionDetails />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/:deviceId" element={<DeviceDetails />} />
        <Route path="/signals" element={<FraudSignals />} />
        <Route path="/fraud-rings" element={<FraudRings />} />
        <Route path="/fraud-rings/:ringId" element={<FraudRingDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
