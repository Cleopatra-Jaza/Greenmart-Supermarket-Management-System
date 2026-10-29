import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from './Button'

interface LoadingStateProps {
  label?: string
  rows?: number
}

export function LoadingState({ label = 'Loading data…', rows = 3 }: LoadingStateProps) {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <Loader2 className="state__spinner" size={28} />
      <p className="state__title">{label}</p>
      <div className="state__skeletons" aria-hidden="true">
        {Array.from({ length: rows }).map((_, index) => (
          <span key={index} className="skeleton" />
        ))}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('state state--empty', className)}>
      <span className="state__icon">{icon ?? <Inbox size={26} />}</span>
      <p className="state__title">{title}</p>
      {description ? <p className="state__description">{description}</p> : null}
      {action ? <div className="state__action">{action}</div> : null}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'The data could not be loaded. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon state__icon--danger">
        <AlertTriangle size={26} />
      </span>
      <p className="state__title">{title}</p>
      <p className="state__description">{description}</p>
      {onRetry ? (
        <div className="state__action">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  )
}
