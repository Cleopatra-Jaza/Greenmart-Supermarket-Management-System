import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ProgressBarProps {
  value: number
  max?: number
  tone?: 'success' | 'warning' | 'danger' | 'accent'
  label?: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'accent',
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('progress', className)}>
      {label || showValue ? (
        <div className="progress__meta">
          {label ? <span className="progress__label">{label}</span> : null}
          {showValue ? (
            <span className="progress__value">{Math.round(percentage)}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <span
          className={cn('progress__fill', `progress__fill--${tone}`)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('field', error && 'field--error', className)}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required ? <span className="field__required"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  )
}
