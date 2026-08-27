import { Bell, Menu, Command } from 'lucide-react'
import { SearchBar } from '@/components/common/SearchBar'

export function Header({ title, onOpenMobileNav }: { title: string; onOpenMobileNav: () => void }) {
  return (
    <header className="h-14 border-b border-base-700 bg-base-900/80 backdrop-blur px-4 flex items-center gap-4 shrink-0">
      <button
        onClick={onOpenMobileNav}
        className="lg:hidden text-ink-300 hover:text-ink-100"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-sm font-semibold text-ink-100 shrink-0 hidden sm:block">{title}</h1>

      <div className="flex-1 flex justify-center px-2">
        <SearchBar compact />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button className="hidden md:flex items-center gap-1.5 rounded-sm border border-base-600 px-2 py-1 text-xs text-ink-500 hover:text-ink-100 hover:border-ink-500">
          <Command size={12} /> K
        </button>
        <button className="relative text-ink-300 hover:text-ink-100" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-risk-critical" />
        </button>
        <div className="h-7 w-7 rounded-full bg-base-600 flex items-center justify-center text-[11px] font-semibold text-ink-100">
          NA
        </div>
      </div>
    </header>
  )
}
