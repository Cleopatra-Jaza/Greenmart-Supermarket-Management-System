import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  trend?: number
  trendLabel?: string
  icon: ReactNode
  accent?: 'primary' | 'secondary' | 'accent' | 'amber' | 'sky' | 'rose'
  onClick?: () => void
}

export function StatCard({
  label,
  value,
  hint,
  trend,
  trendLabel,
  icon,
  accent = 'primary',
  onClick,
}: StatCardProps) {
  const direction = trend === undefined ? 'flat' : trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'
  const TrendIcon =
    direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus

  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn('stat-card', `stat-card--${accent}`, onClick && 'stat-card--clickable')}
    >
      <span className="stat-card__glow" aria-hidden="true" />
      <span className="stat-card__edge" aria-hidden="true" />
      <div className="stat-card__top">
        <span className="stat-card__icon">{icon}</span>
        {trend !== undefined ? (
          <span className={cn('stat-card__trend', `is-${direction}`)}>
            <TrendIcon size={14} strokeWidth={2.5} />
            {Math.abs(trend).toFixed(1)}%
          </span>
        ) : null}
      </div>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__hint">{trendLabel ?? hint}</p>
    </Wrapper>
  )
}
