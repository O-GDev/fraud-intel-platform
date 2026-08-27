import {
  LayoutDashboard,
  ShieldAlert,
  Wallet,
  ArrowLeftRight,
  Smartphone,
  Network,
  Settings,
  ShieldCheck,
  ChevronsLeft,
  ChevronsRight,
  CircleDot,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/investigations', label: 'Investigations', icon: ShieldCheck },
  { to: '/signals', label: 'Fraud Signals', icon: ShieldAlert },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/fraud-rings', label: 'Fraud Rings', icon: Network },
  { to: '/devices', label: 'Devices', icon: Smartphone },
]

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const [collapsed, setCollapsed] = useState(false)

  const content = (
    <div className="flex h-full flex-col bg-base-900 border-r border-base-700">
      <div className={`flex items-center gap-2.5 px-4 h-14 border-b border-base-700 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent/15 text-accent shrink-0">
          <ShieldCheck size={16} />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-sm font-semibold text-ink-100 tracking-tight">Sentry</div>
            <div className="text-[10px] text-ink-500 uppercase tracking-wider">Fraud Intelligence</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm transition-colors ${
                isActive ? 'bg-accent/15 text-accent font-medium' : 'text-ink-300 hover:bg-base-850 hover:text-ink-100'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={17} className="shrink-0" />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-base-700 px-3 py-3 space-y-2.5">
        {!collapsed && (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-ink-500">
              <span>API</span>
              <span className="flex items-center gap-1 text-risk-low">
                <CircleDot size={10} className="fill-current" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-ink-500">
              <span>Neo4j</span>
              <span className="flex items-center gap-1 text-risk-low">
                <CircleDot size={10} className="fill-current" /> Online
              </span>
            </div>
          </div>
        )}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm transition-colors ${
              isActive ? 'bg-accent/15 text-accent font-medium' : 'text-ink-300 hover:bg-base-850 hover:text-ink-100'
            } ${collapsed ? 'justify-center' : ''}`
          }
        >
          <Settings size={17} className="shrink-0" />
          {!collapsed && 'Settings'}
        </NavLink>
        <div className={`flex items-center gap-2.5 px-2.5 py-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="h-6 w-6 rounded-full bg-base-600 flex items-center justify-center text-[11px] font-semibold text-ink-100">
            NA
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-xs font-medium text-ink-100">Ngozi Adeleke</div>
              <div className="text-[10px] text-ink-500">Fraud Analyst</div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex w-full items-center justify-center gap-2 rounded-sm border border-base-600 py-1.5 text-xs text-ink-500 hover:text-ink-100 hover:border-ink-500"
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className={`hidden lg:block shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
          <div className="absolute inset-y-0 left-0 w-64">{content}</div>
        </div>
      )}
    </>
  )
}
