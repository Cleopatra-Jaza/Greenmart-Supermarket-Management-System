/**
 * Currency, number and date formatting helpers.
 * Every monetary amount in the app is rendered through `formatLKR` so that
 * the whole UI stays consistent (e.g. `LKR 1,250.50`).
 */

const LKR_GROUPER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const NUMBER_GROUPER = new Intl.NumberFormat('en-US')

const COMPACT_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/**
 * Formats a numeric amount as Sri Lankan Rupees.
 *
 * @example formatLKR(1250.5) // "LKR 1,250.50"
 */
export function formatLKR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return `LKR ${LKR_GROUPER.format(safe)}`
}

/**
 * Formats an amount with a custom currency code (used by Settings -> currency).
 */
export function formatCurrency(amount: number, currency = 'LKR'): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return `${currency} ${LKR_GROUPER.format(safe)}`
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0'
  return NUMBER_GROUPER.format(value)
}

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return '0'
  return COMPACT_FORMATTER.format(value)
}

export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '0%'
  return `${value.toFixed(digits)}%`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function relativeTime(iso: string): string {
  const date = new Date(iso).getTime()
  if (Number.isNaN(date)) return '—'
  const diff = Date.now() - date
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(iso)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function toISODate(date: Date): string {
  return date.toISOString()
}
