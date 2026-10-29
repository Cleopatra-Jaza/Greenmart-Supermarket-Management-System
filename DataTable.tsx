import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { EmptyState, ErrorState, LoadingState } from './States'

interface Column<T> {
  key: string
  header: string
  render: (row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  loading?: boolean
  error?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  caption?: string
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading = false,
  error,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search keywords.',
  emptyAction,
  caption,
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingState rows={5} />
  }

  if (error) {
    return <ErrorState description={error} />
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <div className="table-wrap">
      <table className="table">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  column.align && `is-${column.align}`,
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && 'is-clickable')}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    column.align && `is-${column.align}`,
                    column.className,
                  )}
                >
                  {column.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
