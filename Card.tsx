import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
  padded?: boolean
  interactive?: boolean
}

export function Card({
  children,
  className,
  padded = true,
  interactive = false,
}: CardProps) {
  return (
    <section
      className={cn(
        'card',
        padded && 'card--padded',
        interactive && 'card--interactive',
        className,
      )}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: CardHeaderProps) {
  return (
    <header className={cn('card__header', className)}>
      <div className="card__header-main">
        {icon ? <span className="card__header-icon">{icon}</span> : null}
        <div>
          <h2 className="card__title">{title}</h2>
          {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="card__header-action">{action}</div> : null}
    </header>
  )
}
