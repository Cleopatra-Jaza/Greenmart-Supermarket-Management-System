import type { CategoryShare, SalesPoint, TopProduct } from '../types'
import { categories } from './categories'
import { products } from './products'

function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' })
}

/**
 * Deterministic pseudo-random generator so the demo dataset stays stable
 * between renders while still looking organic.
 */
function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/** Daily revenue / orders for the last `days` days, oldest first. */
export function buildRevenueSeries(days = 14): SalesPoint[] {
  const series: SalesPoint[] = []
  const today = startOfDay(new Date())

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(today)
    date.setDate(date.getDate() - index)

    const wave = Math.sin((days - index) / 1.7) * 0.12
    const weekendBoost = [0, 6].includes(date.getDay()) ? 0.18 : 0
    const noise = (seeded((days - index) * 13.37) - 0.5) * 0.18
    const factor = 1 + wave + weekendBoost + noise

    const revenue = Math.round(1_180_000 * factor)
    const orders = Math.max(12, Math.round(revenue / 78_500))

    series.push({ label: dayLabel(date), revenue, orders })
  }

  return series
}

/** Weekly revenue buckets for the reports page. */
export function buildWeeklySeries(weeks = 8): SalesPoint[] {
  const series: SalesPoint[] = []
  const today = startOfDay(new Date())

  for (let index = weeks - 1; index >= 0; index -= 1) {
    const date = new Date(today)
    date.setDate(date.getDate() - index * 7)

    const growth = (weeks - index) / (weeks * 1.4)
    const noise = (seeded((weeks - index) * 7.77) - 0.5) * 0.14
    const revenue = Math.round(8_150_000 * (1 + growth) * (1 + noise))
    const orders = Math.round(revenue / 79_500)

    series.push({
      label: `W${weeks - index}`,
      revenue,
      orders,
    })
  }

  return series
}

/** Revenue split by category. */
export const categoryShare: CategoryShare[] = categories.map((category) => ({
  name: category.name,
  value: category.revenue,
  color: category.color,
}))

/** Best selling products by units moved. */
export const topProducts: TopProduct[] = [...products]
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 8)
  .map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    units: product.sales,
    revenue: product.sales * product.price,
    stock: product.stock,
  }))

/** Hourly distribution of in-store foot traffic for the POS heat map. */
export const hourlySales = [
  { label: '08:00', value: 18 },
  { label: '09:00', value: 34 },
  { label: '10:00', value: 52 },
  { label: '11:00', value: 68 },
  { label: '12:00', value: 84 },
  { label: '13:00', value: 76 },
  { label: '14:00', value: 61 },
  { label: '15:00', value: 55 },
  { label: '16:00', value: 66 },
  { label: '17:00', value: 88 },
  { label: '18:00', value: 72 },
  { label: '19:00', value: 47 },
]

/** Payment method split used on the reports page. */
export const paymentSplit = [
  { name: 'Cash', value: 34, color: '#10B981' },
  { name: 'Card', value: 28, color: '#047857' },
  { name: 'Mobile Wallet', value: 24, color: '#34D399' },
  { name: 'Bank Transfer', value: 14, color: '#065F46' },
]
