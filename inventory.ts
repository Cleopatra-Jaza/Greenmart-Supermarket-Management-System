import type { Product, StockStatus } from '../types'

/** Derives the stock status of a product from its quantity and reorder level. */
export function getStockStatus(product: Product): StockStatus {
  if (product.stock <= 0) return 'out-of-stock'
  if (product.stock <= product.reorderLevel) return 'low-stock'
  return 'in-stock'
}

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
}

export function getStockLabel(product: Product): string {
  return STOCK_STATUS_LABEL[getStockStatus(product)]
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function generateSku(name: string, index: number): string {
  const prefix = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
  return `${prefix || 'GM'}-${String(index).padStart(4, '0')}`
}
