import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim().toUpperCase()
    if (!q) return
    if (q.startsWith('A')) navigate(`/investigations/accounts/${q}`)
    else if (q.startsWith('T')) navigate(`/transactions/${q}`)
    else if (q.startsWith('D')) navigate(`/devices/${q}`)
    else navigate(`/accounts?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'w-full' : 'w-full max-w-md'}>
      <div className="relative">
        <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search account, transaction, or device ID (A001, T020, D001)"
          aria-label="Search accounts, transactions, or devices"
          className="input-field w-full pl-8"
        />
      </div>
    </form>
  )
}
