import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type BadgeTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'purple'
  | 'accent'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  dot?: boolean
  className?: string
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span className={cn('badge', `badge--${tone}`, className)}>
      {dot ? <span className="badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}
