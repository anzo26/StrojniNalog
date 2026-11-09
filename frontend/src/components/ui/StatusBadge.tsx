import './StatusBadge.css'

interface StatusBadgeProps {
  label: string
  tone?: 'neutral' | 'info' | 'progress' | 'success' | 'warning' | 'danger'
}

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${tone}`}>{label}</span>
}