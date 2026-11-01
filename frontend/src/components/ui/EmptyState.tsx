import type { ReactNode } from 'react'
import './FeedbackState.css'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="feedback-state">
      <h2 className="feedback-state-title">{title}</h2>
      {description && <p className="feedback-state-description">{description}</p>}
      {action && <div className="feedback-state-action">{action}</div>}
    </section>
  )
}