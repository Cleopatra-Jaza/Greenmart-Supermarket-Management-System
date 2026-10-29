import { ChevronDown } from 'lucide-react'
import type { ChangeEvent, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  className?: string
  placeholder?: string
  children?: ReactNode
}

export function Select({
  value,
  onChange,
  options,
  label,
  className,
}: SelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) =>
    onChange(event.target.value)

  return (
    <div className={cn('select', className)}>
      {label ? <span className="select__label">{label}</span> : null}
      <div className="select__control">
        <select
          className="select__input"
          value={value}
          onChange={handleChange}
          aria-label={label ?? 'Select'}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select__chevron" size={15} />
      </div>
    </div>
  )
}
