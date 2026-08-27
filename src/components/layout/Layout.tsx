import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/accounts': 'Accounts',
  '/investigations': 'Investigations',
  '/transactions': 'Transactions',
  '/devices': 'Devices',
  '/signals': 'Fraud Signals',
  '/fraud-rings': 'Fraud Rings',
  '/settings': 'Settings',
}

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/investigations/accounts/')) return 'Account Investigation'
  if (pathname.startsWith('/transactions/')) return 'Transaction Details'
  if (pathname.startsWith('/devices/')) return 'Device Investigation'
  if (pathname.startsWith('/fraud-rings/')) return 'Fraud Ring Investigation'
  return 'Sentry'
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = resolveTitle(location.pathname)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base-950">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header title={title} onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
