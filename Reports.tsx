import { useMemo, useState } from 'react'
import {
  Boxes,
  CircleDollarSign,
  Package,
  Printer,
  ReceiptText,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import { CategoryDonut } from '../components/charts/CategoryDonut'
import { HourlySalesChart } from '../components/charts/HourlySalesChart'
import { RevenueChart } from '../components/charts/RevenueChart'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/Feedback'
import { Select } from '../components/ui/Select'
import { StatCard } from '../components/ui/StatCard'
import {
  buildRevenueSeries,
  buildWeeklySeries,
  categoryShare,
  hourlySales,
  paymentSplit,
  topProducts,
} from '../data/analytics'
import { formatCompact, formatLKR, formatNumber } from '../lib/format'
import { getStockStatus } from '../lib/inventory'
import { useStore } from '../store/storeContext'
import type { Product } from '../types'

export function Reports() {
  const { products, orders, categories, settings, pushToast } = useStore()
  const [period, setPeriod] = useState('14')

  const series = useMemo(
    () => buildRevenueSeries(Number(period)),
    [period],
  )
  const weeklySeries = useMemo(() => buildWeeklySeries(8), [])

  const summary = useMemo(() => {
    const revenue = series.reduce((sum, point) => sum + point.revenue, 0)
    const orderCount = series.reduce((sum, point) => sum + point.orders, 0)
    const averageOrder = orderCount > 0 ? revenue / orderCount : 0
    const unitsSold = products.reduce((sum, product) => sum + product.sales, 0)
    const stockValue = products.reduce(
      (sum, product) => sum + product.cost * product.stock,
      0,
    )
    const atRisk = products.filter(
      (product) => product.stock <= product.reorderLevel,
    )
    return {
      revenue,
      orderCount,
      averageOrder,
      unitsSold,
      stockValue,
      atRisk,
    }
  }, [series, products])

  const inventoryRows = useMemo(() => {
    return categories
      .map((category) => {
        const items = products.filter(
          (product) => product.categoryId === category.id,
        )
        const value = items.reduce(
          (sum, product) => sum + product.cost * product.stock,
          0,
        )
        const units = items.reduce((sum, product) => sum + product.stock, 0)
        const sold = items.reduce((sum, product) => sum + product.sales, 0)
        const atRisk = items.filter(
          (product) => product.stock <= product.reorderLevel,
        ).length
        return {
          id: category.id,
          name: category.name,
          color: category.color,
          products: items.length,
          units,
          value,
          sold,
          atRisk,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [categories, products])

  const maxInventoryValue = Math.max(
    ...inventoryRows.map((row) => row.value),
    1,
  )

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((product) => product.stock <= product.reorderLevel)
        .sort((a, b) => a.stock - b.stock),
    [products],
  )

  const topSelling = useMemo(
    () => [...topProducts].sort((a, b) => b.revenue - a.revenue),
    [],
  )

  const handlePrint = () => {
    const lines = [
      `${settings.storeName} — Sales report`,
      `Period: last ${period} days`,
      '',
      `Revenue: ${formatLKR(summary.revenue)}`,
      `Orders: ${formatNumber(summary.orderCount)}`,
      `Average order value: ${formatLKR(summary.averageOrder)}`,
      `Units sold: ${formatNumber(summary.unitsSold)}`,
      `Stock value: ${formatLKR(summary.stockValue)}`,
      '',
      'Top selling products:',
      ...topSelling.map(
        (product) =>
          `${product.name} — ${formatNumber(product.units)} units (${formatLKR(product.revenue)})`,
      ),
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `greenmart-report-${period}d.txt`
    link.click()
    URL.revokeObjectURL(url)

    pushToast({
      title: 'Report generated',
      message: `Sales report for the last ${period} days downloaded.`,
      variant: 'success',
    })
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Analytics"
        title="Reports"
        description="Sales summaries, revenue trends, best sellers and inventory health."
        actions={
          <>
            <Select
              value={period}
              onChange={setPeriod}
              label="Period"
              options={[
                { value: '7', label: 'Last 7 days' },
                { value: '14', label: 'Last 14 days' },
                { value: '30', label: 'Last 30 days' },
              ]}
            />
            <Button
              variant="secondary"
              icon={<Printer size={16} />}
              onClick={handlePrint}
            >
              Export report
            </Button>
          </>
        }
      />

      <div className="stat-grid stat-grid--compact">
        <StatCard
          label="Revenue"
          value={formatLKR(summary.revenue)}
          icon={<CircleDollarSign size={20} />}
          accent="primary"
          hint={`Last ${period} days`}
        />
        <StatCard
          label="Orders"
          value={formatNumber(summary.orderCount)}
          icon={<ReceiptText size={20} />}
          accent="secondary"
          hint={`${formatNumber(
            products.reduce((sum, product) => sum + product.sales, 0),
          )} units sold`}
        />
        <StatCard
          label="Average order value"
          value={formatLKR(summary.averageOrder)}
          icon={<TrendingUp size={20} />}
          accent="accent"
          hint="Revenue per completed order"
        />
        <StatCard
          label="Stock value"
          value={formatLKR(summary.stockValue)}
          icon={<Boxes size={20} />}
          accent="sky"
          hint={`${summary.atRisk.length} product(s) below reorder level`}
        />
      </div>

      <div className="grid grid--2-1">
        <Card>
          <CardHeader
            title="Revenue performance"
            subtitle={`Daily revenue over the last ${period} days`}
            icon={<TrendingUp size={18} />}
          />
          <RevenueChart data={series} height={300} />
        </Card>

        <Card>
          <CardHeader
            title="Revenue by category"
            subtitle="Share of total category revenue"
            icon={<Package size={18} />}
          />
          <CategoryDonut data={categoryShare} height={230} totalLabel="Category revenue" />
        </Card>
      </div>

      <div className="grid grid--2-1">
        <Card>
          <CardHeader
            title="Weekly revenue"
            subtitle="Last eight trading weeks"
            icon={<CircleDollarSign size={18} />}
          />
          <div className="weekly-bars">
            {weeklySeries.map((point) => {
              const max = Math.max(
                ...weeklySeries.map((entry) => entry.revenue),
                1,
              )
              return (
                <div key={point.label} className="weekly-bars__row">
                  <span className="weekly-bars__label">{point.label}</span>
                  <span className="weekly-bars__track">
                    <span
                      className="weekly-bars__fill"
                      style={{
                        width: `${(point.revenue / max) * 100}%`,
                      }}
                    />
                  </span>
                  <span className="weekly-bars__value">
                    {formatLKR(point.revenue)}
                  </span>
                  <span className="weekly-bars__orders">
                    {formatCompact(point.orders)} orders
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Payment methods"
            subtitle="Share of transactions"
            icon={<ReceiptText size={18} />}
          />
          <ul className="payment-split">
            {paymentSplit.map((method) => (
              <li key={method.name} className="payment-split__row">
                <span
                  className="payment-split__dot"
                  style={{ backgroundColor: method.color }}
                  aria-hidden="true"
                />
                <span className="payment-split__name">{method.name}</span>
                <span className="payment-split__bar">
                  <ProgressBar value={method.value} tone="accent" />
                </span>
                <span className="payment-split__value">{method.value}%</span>
              </li>
            ))}
          </ul>

          <h4 className="card__subheading">Busiest hours</h4>
          <HourlySalesChart data={hourlySales} height={180} />
        </Card>
      </div>

      <Card padded={false}>
        <div className="card__padding-x">
          <CardHeader
            title="Top selling products"
            subtitle="Ranked by revenue contribution"
            icon={<Package size={18} />}
          />
        </div>
        <DataTable
          caption="Top selling products"
          rows={topSelling}
          rowKey={(row) => row.id}
          emptyTitle="No sales recorded"
          emptyDescription="Top sellers will appear once products are sold."
          columns={[
            {
              key: 'rank',
              header: '#',
              width: '56px',
              render: (_row, index) => (
                <span className="rank-badge">{index + 1}</span>
              ),
            },
            {
              key: 'name',
              header: 'Product',
              render: (row) => (
                <div>
                  <span className="table__strong">{row.name}</span>
                  <span className="table__sub">{row.category}</span>
                </div>
              ),
            },
            {
              key: 'units',
              header: 'Units sold',
              align: 'right',
              render: (row) => (
                <span className="table__strong">{formatNumber(row.units)}</span>
              ),
            },
            {
              key: 'revenue',
              header: 'Revenue',
              align: 'right',
              render: (row) => (
                <span className="table__strong">{formatLKR(row.revenue)}</span>
              ),
            },
            {
              key: 'stock',
              header: 'Stock left',
              align: 'right',
              render: (row) => (
                <span className="table__sub-inline">{formatNumber(row.stock)}</span>
              ),
            },
          ]}
        />
      </Card>

      <Card padded={false}>
        <div className="card__padding-x">
          <CardHeader
            title="Inventory report"
            subtitle="Stock value and sell-through per category"
            icon={<Boxes size={18} />}
          />
        </div>
        <DataTable
          caption="Inventory report"
          rows={inventoryRows}
          rowKey={(row) => row.id}
          emptyTitle="No inventory data"
          emptyDescription="Add products to see the inventory report."
          columns={[
            {
              key: 'category',
              header: 'Category',
              render: (row) => (
                <div className="cell-product">
                  <span
                    className="category-list__dot"
                    style={{ backgroundColor: row.color }}
                    aria-hidden="true"
                  />
                  <span className="cell-product__name">{row.name}</span>
                </div>
              ),
            },
            {
              key: 'products',
              header: 'SKUs',
              align: 'right',
              render: (row) => (
                <span className="table__strong">{formatNumber(row.products)}</span>
              ),
            },
            {
              key: 'units',
              header: 'Units',
              align: 'right',
              render: (row) => (
                <span className="table__sub-inline">{formatNumber(row.units)}</span>
              ),
            },
            {
              key: 'sold',
              header: 'Units sold',
              align: 'right',
              render: (row) => (
                <span className="table__sub-inline">{formatNumber(row.sold)}</span>
              ),
            },
            {
              key: 'value',
              header: 'Stock value',
              align: 'right',
              render: (row) => (
                <span className="table__strong">{formatLKR(row.value)}</span>
              ),
            },
            {
              key: 'share',
              header: 'Share',
              width: '150px',
              render: (row) => (
                <ProgressBar
                  value={row.value}
                  max={maxInventoryValue}
                  tone="accent"
                />
              ),
            },
            {
              key: 'risk',
              header: 'At risk',
              align: 'right',
              render: (row) =>
                row.atRisk > 0 ? (
                  <Badge tone="warning" dot>
                    {row.atRisk}
                  </Badge>
                ) : (
                  <Badge tone="success" dot>
                    0
                  </Badge>
                ),
            },
          ]}
        />
      </Card>

      <Card>
        <CardHeader
          title="Replenishment shortlist"
          subtitle="Products at or below their reorder level"
          icon={<TriangleAlert size={18} />}
        />
        {lowStockProducts.length === 0 ? (
          <p className="low-stock__empty">
            No products need replenishment right now.
          </p>
        ) : (
          <DataTable<Product>
            caption="Replenishment shortlist"
            rows={lowStockProducts}
            rowKey={(row) => row.id}
            emptyTitle="Nothing to restock"
            emptyDescription="All products are above their reorder level."
            columns={[
              {
                key: 'product',
                header: 'Product',
                render: (product) => (
                  <div>
                    <span className="table__strong">{product.name}</span>
                    <span className="table__sub">{product.supplier}</span>
                  </div>
                ),
              },
              {
                key: 'stock',
                header: 'On hand',
                align: 'right',
                render: (product) => (
                  <span className="table__strong">
                    {formatNumber(product.stock)} {product.unit}
                  </span>
                ),
              },
              {
                key: 'reorder',
                header: 'Reorder at',
                align: 'right',
                render: (product) => (
                  <span className="table__sub-inline">
                    {formatNumber(product.reorderLevel)}
                  </span>
                ),
              },
              {
                key: 'suggest',
                header: 'Suggested order',
                align: 'right',
                render: (product) => (
                  <span className="table__strong">
                    {formatNumber(
                      Math.max(
                        0,
                        product.reorderLevel * 2 - product.stock,
                      ),
                    )}{' '}
                    {product.unit}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (product) => (
                  <Badge
                    tone={
                      getStockStatus(product) === 'out-of-stock'
                        ? 'danger'
                        : 'warning'
                    }
                    dot
                  >
                    {getStockStatus(product) === 'out-of-stock'
                      ? 'Out of stock'
                      : 'Low stock'}
                  </Badge>
                ),
              },
            ]}
          />
        )}
      </Card>

      <p className="page__footnote">
        Reports are calculated from the local demo dataset ({orders.length} orders,
        {products.length} products) — no live database is connected.
      </p>
    </div>
  )
}
