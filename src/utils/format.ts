// Small, dependency-free formatting helpers used across the app.

export function formatCurrency(amount: number | null | undefined, currency = 'NGN'): string {
  if (amount === null || amount === undefined) return '—'
  const symbols: Record<string, string> = { NGN: '\u20a6', USD: '$', GBP: '\u00a3', EUR: '\u20ac' }
  const symbol = symbols[currency] ?? ''
  return `${symbol}${amount.toLocaleString('en-NG')}`
}

export function formatCompactCurrency(amount: number | null | undefined, currency = 'NGN'): string {
  if (amount === null || amount === undefined) return '—'
  const symbols: Record<string, string> = { NGN: '\u20a6', USD: '$', GBP: '\u00a3', EUR: '\u20ac' }
  const symbol = symbols[currency] ?? ''
  if (Math.abs(amount) >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
  if (Math.abs(amount) >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}K`
  return `${symbol}${amount.toLocaleString('en-NG')}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

export function truncateMiddle(value: string, max = 18): string {
  if (value.length <= max) return value
  const half = Math.floor((max - 3) / 2)
  return `${value.slice(0, half)}...${value.slice(value.length - half)}`
}
