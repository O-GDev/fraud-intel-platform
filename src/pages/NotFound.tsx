import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <ShieldAlert size={28} className="text-ink-700" />
      <h2 className="text-lg font-semibold text-ink-100">Page not found</h2>
      <p className="text-sm text-ink-500">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn-primary mt-2">Back to Dashboard</Link>
    </div>
  )
}
