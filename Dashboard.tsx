import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CircleDollarSign,
  Layers,
  Package,
  PackagePlus,
  ReceiptText,
  ShoppingCart,
  TriangleAlert,
  TrendingUp,
  Users,
} from 'lucide-react'
import { CategoryDonut } from '../components/charts/CategoryDonut'
import { RevenueChart } from '../components/charts/RevenueChart'
import { SalesChart } from '../components/charts/SalesChart'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/Feedback'
import { StatCard } from '../components/ui/StatCard'
import { buildRevenueSeries, categoryShare } from '../data/analytics'
import { formatLKR, formatNumber, relativeTime } from '../lib/format'
import { getStockStatus } from '../lib/inventory'
import { useStore } from '../store/storeContext'

export function Dashboard() {
  const navigate = useNavigate()
  const { products, orders, customers, categories, settings } = useStore()

  const revenueSeries = useMemo(() => buildRevenueSeries(14), [])

  /**
   * "Now" is anchored to the most recent order so the dashboard stays
   * deterministic and free of impure render-time calls.
   */
  const anchorTime = useMemo(() => {
    let latest = 0
    for (const order of orders) {
      const time = new Date(order.date).getTime()
      if (time > latest) latest = time
    }
    return latest
  }, [orders])

  const stats = useMemo(() => {
    const dayMs = 86_400_000

    const completed = orders.filter((order) => order.status === 'completed')
    const totalRevenue = completed.reduce((sum, order) => sum + order.total, 0)

    const withinDays = (days: number) =>
      completed.filter(
        (order) =>
          anchorTime - new Date(order.date).getTime() <= days * dayMs,
      )

    const last7 = withinDays(7)
    const prev7 = completed.filter((order) => {
      const age = anchorTime - new Date(order.date).getTime()
      return age > 7 * dayMs && age <= 14 * dayMs
    })

    const sum = (list: typeof completed) =>
      list.reduce((total, order) => total + order.total, 0)

    const revenueTrend =
      sum(prev7) > 0
        ? ((sum(last7) - sum(prev7)) / sum(prev7)) * 100
        : 0

    const orderTrend =
      prev7.length > 0
        ? ((last7.length - prev7.length) / prev7.length) * 100
        : 0

    const lowStock = products.filter(
      (product) => product.stock <= product.reorderLevel,
    )
    const outOfStock = products.filter((product) => product.stock === 0)
    const inventoryValue = products.reduce(
      (sum, product) => sum + product.cost * product.stock,
      0,
    )

    return {
      totalRevenue,
      revenueTrend,
      orderTrend,
      orderCount: completed.length,
      productCount: products.length,
      lowStock,
      outOfStock,
      inventoryValue,
      customerCount: customers.length,
      categoryCount: categories.length,
    }
  }, [orders, products, customers, categories, anchorTime])

  const recentTransactions = useMemo(() => orders.slice(0, 6), [orders])

  const topCategories = useMemo(
    () =>
      [...categories]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    [categories],
  )

  const maxCategoryRevenue = Math.max(
    ...topCategories.map((category) => category.revenue),
    1,
  )

  const stockValueShare = useMemo(() => {
    const total = products.reduce(
      (sum, product) => sum + product.cost * product.stock,
      0,
    )
    return categories.map((category) => {
      const value = products
        .filter((product) => product.categoryId === category.id)
        .reduce((sum, product) => sum + product.cost * product.stock, 0)
      return {
        ...category,
        value,
        share: total > 0 ? (value / total) * 100 : 0,
      }
    })
  }, [categories, products])

  return (
    <div className="page page--dashboard">
      <PageHeader
        eyebrow={settings.storeName}
        title="Dashboard"
        description="A live view of revenue, stock and customer activity across your store."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<PackagePlus size={17} />}
              onClick={() => navigate('/products')}
            >
              Add product
            </Button>
            <Button
              icon={<ShoppingCart size={17} />}
              onClick={() => navigate('/sales')}
            >
              New sale
            </Button>
          </>
        }
      />

      <div className="stat-grid">
        <StatCard
          label="Total revenue"
          value={formatLKR(stats.totalRevenue)}
          icon={<CircleDollarSign size={21} />}
          accent="primary"
          trend={stats.revenueTrend}
          trendLabel="vs previous 7 days"
        />
        <StatCard
          label="Completed orders"
          value={formatNumber(stats.orderCount)}
          icon={<ReceiptText size={21} />}
          accent="secondary"
          trend={stats.orderTrend}
          trendLabel="vs previous 7 days"
        />
        <StatCard
          label="Active products"
          value={formatNumber(stats.productCount)}
          icon={<Package size={21} />}
          accent="accent"
          hint={`Across ${stats.categoryCount} categories`}
        />
        <StatCard
          label="Inventory value"
          value={formatLKR(stats.inventoryValue)}
          icon={<Boxes size={21} />}
          accent="sky"
          hint={`${formatNumber(stats.productCount)} SKUs on shelves`}
        />
        <StatCard
          label="Low stock alerts"
          value={formatNumber(stats.lowStock.length)}
          icon={<TriangleAlert size={21} />}
          accent="rose"
          hint={`${stats.outOfStock.length} item(s) fully out of stock`}
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          label="Registered customers"
          value={formatNumber(stats.customerCount)}
          icon={<Users size={21} />}
          accent="amber"
          hint="Loyalty programme members"
          onClick={() => navigate('/customers')}
        />
      </div>

      <div className="grid grid--2-1">
        <Card>
          <CardHeader
            title="Revenue trend"
            subtitle="Last 14 days of gross revenue"
            icon={<TrendingUp size={18} />}
            action={
              <Button
                variant="ghost"
                size="sm"
                trailingIcon={<ArrowRight size={15} />}
                onClick={() => navigate('/reports')}
              >
                Reports
              </Button>
            }
          />
          <RevenueChart data={revenueSeries} height={300} />
        </Card>

        <Card>
          <CardHeader
            title="Category overview"
            subtitle="Revenue split by department"
            icon={<Layers size={18} />}
          />
          <CategoryDonut data={categoryShare} height={230} />
        </Card>
      </div>

      <div className="grid grid--2-1">
        <Card>
          <CardHeader
            title="Sales volume"
            subtitle="Orders placed per day"
            icon={<ShoppingCart size={18} />}
          />
          <SalesChart data={revenueSeries} height={250} />
        </Card>

        <Card className="card--low-stock">
          <CardHeader
            title="Low stock alerts"
            subtitle={`${stats.lowStock.length} product(s) need restocking`}
            icon={<TriangleAlert size={18} />}
            action={
              <Button
                variant="ghost"
                size="sm"
                trailingIcon={<ArrowRight size={15} />}
                onClick={() => navigate('/inventory')}
              >
                Inventory
              </Button>
            }
          />
          {stats.lowStock.length === 0 ? (
            <p className="low-stock__empty">
              All shelves are healthy — nothing to restock right now.
            </p>
          ) : (
            <ul className="low-stock">
              {stats.lowStock.slice(0, 6).map((product) => (
                <li key={product.id} className="low-stock__item">
                  <span className="low-stock__icon">
                    <Package size={16} />
                  </span>
                  <span className="low-stock__text">
                    <span className="low-stock__name">{product.name}</span>
                    <span className="low-stock__meta">
                      {product.stock} {product.unit} · reorder at{' '}
                      {product.reorderLevel}
                    </span>
                  </span>
                  <Badge
                    tone={
                      getStockStatus(product) === 'out-of-stock'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {product.stock === 0 ? 'Out' : 'Low'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid--3-1">
        <Card padded={false}>
          <div className="card__padding-x">
            <CardHeader
              title="Recent transactions"
              subtitle="Latest orders processed at the counter"
              icon={<ReceiptText size={18} />}
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  trailingIcon={<ArrowRight size={15} />}
                  onClick={() => navigate('/orders')}
                >
                  View all
                </Button>
              }
            />
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th className="is-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="table__strong">{order.id}</span>
                      <span className="table__sub">
                        {relativeTime(order.date)}
                      </span>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.channel}</td>
                    <td>
                      <Badge
                        tone={
                          order.status === 'completed'
                            ? 'success'
                            : order.status === 'pending'
                              ? 'warning'
                              : order.status === 'cancelled'
                                ? 'danger'
                                : 'info'
                        }
                        dot
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="is-right table__strong">
                      {formatLKR(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Quick actions"
            subtitle="Common store tasks"
            icon={<BadgeCheck size={18} />}
          />
          <div className="quick-actions">
            <Link to="/sales" className="quick-action">
              <span className="quick-action__icon">
                <ShoppingCart size={18} />
              </span>
              <span className="quick-action__text">
                <span className="quick-action__title">Ring up a sale</span>
                <span className="quick-action__sub">Open the POS terminal</span>
              </span>
            </Link>
            <Link to="/products" className="quick-action">
              <span className="quick-action__icon">
                <PackagePlus size={18} />
              </span>
              <span className="quick-action__text">
                <span className="quick-action__title">Add a product</span>
                <span className="quick-action__sub">Extend the catalogue</span>
              </span>
            </Link>
            <Link to="/inventory" className="quick-action">
              <span className="quick-action__icon">
                <Boxes size={18} />
              </span>
              <span className="quick-action__text">
                <span className="quick-action__title">Adjust stock</span>
                <span className="quick-action__sub">
                  {stats.lowStock.length} item(s) need attention
                </span>
              </span>
            </Link>
            <Link to="/reports" className="quick-action">
              <span className="quick-action__icon">
                <TrendingUp size={18} />
              </span>
              <span className="quick-action__text">
                <span className="quick-action__title">View reports</span>
                <span className="quick-action__sub">Sales and stock analytics</span>
              </span>
            </Link>
          </div>

          <div className="quick-actions__progress">
            <ProgressBar
              label="Stock health"
              value={products.length - stats.lowStock.length}
              max={products.length || 1}
              showValue
              tone="accent"
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Top performing categories"
          subtitle="Revenue contribution this period"
          icon={<Layers size={18} />}
        />
        <div className="category-list">
          {stockValueShare.map((category) => (
            <div key={category.id} className="category-list__row">
              <span
                className="category-list__dot"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              />
              <span className="category-list__name">{category.name}</span>
              <span className="category-list__bar">
                <ProgressBar
                  value={category.value}
                  max={maxCategoryRevenue}
                  tone="accent"
                />
              </span>
              <span className="category-list__value">
                {formatLKR(category.value)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
