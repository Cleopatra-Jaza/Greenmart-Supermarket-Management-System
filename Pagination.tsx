import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

interface PaginationProps {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  label?: string
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  label = 'items',
}: PaginationProps) {
  if (total === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination__summary">
        Showing <strong>{start}</strong>–<strong>{end}</strong> of{' '}
        <strong>{total}</strong> {label}
      </p>
      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={cn(
              'pagination__btn',
              pageNumber === page && 'is-active',
            )}
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  )
}
