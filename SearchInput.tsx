import { Search, X } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { cn } from '../../lib/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  label = 'Search',
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value)

  return (
    <div className={cn('search', className)}>
      <Search className="search__icon" size={16} />
      <input
        type="search"
        className="search__input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={label}
      />
      {value ? (
        <button
          type="button"
          className="search__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  )
}
