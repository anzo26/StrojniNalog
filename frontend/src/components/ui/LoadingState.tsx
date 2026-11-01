import './FeedbackState.css'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Nalaganje podatkov …' }: LoadingStateProps) {
  return (
    <div className="feedback-state" role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <p className="feedback-state-description">{message}</p>
    </div>
  )
}