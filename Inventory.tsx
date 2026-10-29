import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  History,
  PackageX,
  SlidersHorizontal,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { AdjustStockDialog } from '../components/inventory/AdjustStockDialog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { Select } from '../components/ui/Select'
import { StatCard } from '../components/ui/StatCard'
import { formatDateTime, formatLKR, formatNumber } from '../lib/format'
import { getStockStatus, STOCK_STATUS_LABEL } from '../lib/inventory'
import { useStore } from '../store/storeContext'
import type { StockMovement } from '../types'

export function Inventory() {
  const { products, stockMovements, categories } = useStore()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustProductId, setAdjustProductId] = useState<string | null>(null)

  const stats = useMemo(() => {
    const totalUnits = products.reduce((sum, product) => sum + product.stock, 0)
    const totalValue = products.reduce(
      (sum, product) => sum + product.cost * product.stock,
      0,
    )
    const lowStock = products.filter(
      (product) =>
        product.stock > 0 && product.stock <= product.reorderLevel,
    )
    const outOfStock = products.filter((product) => product.stock === 0)
    return { totalUnits, totalValue, lowStock, outOfStock }
  }, [products])

  const stockRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products
      .filter((product) => {
        const matchesTerm =
          !term ||
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term)
        const matchesCategory =
          categoryFilter === 'all' || product.categoryId === categoryFilter
        return matchesTerm && matchesCategory
      })
      .sort((a, b) => {
        const statusA = getStockStatus(a)
        const statusB = getStockStatus(b)
        const rank = { 'out-of-stock': 0, 'low-stock': 1, 'in-stock': 2 }
        if (rank[statusA] !== rank[statusB]) return rank[statusA] - rank[statusB]
        return a.stock - b.stock
      })
  }, [products, search, categoryFilter])

  const movementRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return stockMovements.filter((movement) => {
      const matchesTerm =
        !term ||
        movement.productName.toLowerCase().includes(term) ||
        movement.reference.toLowerCase().includes(term) ||
        movement.reason.toLowerCase().includes(term)
      const matchesType = typeFilter === 'all' || movement.type === typeFilter
      return matchesTerm && matchesType
    })
  }, [stockMovements, search, typeFilter])

  const openAdjust = (productId: string | null) => {
    setAdjustProductId(productId)
    setAdjustOpen(true)
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Stock control"
        title="Inventory"
        description="Monitor stock on hand, record adjustments and review every movement."
        actions={
          <Button
            icon={<SlidersHorizontal size={17} />}
            onClick={() => openAdjust(null)}
          >
            Adjust stock
          </Button>
        }
      />

      <div className="stat-grid stat-grid--compact">
        <StatCard
          label="Units on hand"
          value={formatNumber(stats.totalUnits)}
          icon={<Boxes size={20} />}
          accent="primary"
          hint={`${formatNumber(products.length)} tracked SKUs`}
        />
        <StatCard
          label="Stock value (cost)"
          value={formatLKR(stats.totalValue)}
          icon={<Wallet size={20} />}
          accent="secondary"
          hint="Valued at purchase cost"
        />
        <StatCard
          label="Low stock"
          value={formatNumber(stats.lowStock.length)}
          icon={<TriangleAlert size={20} />}
          accent="amber"
          hint="At or below reorder level"
        />
        <StatCard
          label="Out of stock"
          value={formatNumber(stats.outOfStock.length)}
          icon={<PackageX size={20} />}
          accent="rose"
          hint="Needs immediate replenishment"
        />
      </div>

      <div className="grid grid--2-1">
        <Card padded={false}>
          <div className="card__padding-x">
            <CardHeader
              title="Stock levels"
              subtitle="Sorted by urgency — out of stock first"
              icon={<Boxes size={18} />}
            />
          </div>
          <div className="toolbar toolbar--inside">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search stock…"
              label="Search stock"
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              label="Category"
              options={[
                { value: 'all', label: 'All categories' },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />
          </div>
          <DataTable
            caption="Stock levels"
            rows={stockRows}
            rowKey={(row) => row.id}
            emptyTitle="No stock records found"
            emptyDescription="Try a different search term or category."
            columns={[
              {
                key: 'product',
                header: 'Product',
                render: (product) => (
                  <div>
                    <span className="cell-product__name">{product.name}</span>
                    <span className="cell-product__sku">
                      {product.sku} · {product.category}
                    </span>
                  </div>
                ),
              },
              {
                key: 'stock',
                header: 'On hand',
                align: 'right',
                render: (product) => (
                  <span className="table__strong">
                    {formatNumber(product.stock)}{' '}
                    <span className="table__sub-inline">{product.unit}</span>
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
                key: 'value',
                header: 'Stock value',
                align: 'right',
                render: (product) => (
                  <span className="table__strong">
                    {formatLKR(product.cost * product.stock)}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (product) => {
                  const status = getStockStatus(product)
                  return (
                    <Badge
                      dot
                      tone={
                        status === 'in-stock'
                          ? 'success'
                          : status === 'low-stock'
                            ? 'warning'
                            : 'danger'
                      }
                    >
                      {STOCK_STATUS_LABEL[status]}
                    </Badge>
                  )
                },
              },
              {
                key: 'action',
                header: '',
                align: 'right',
                width: '110px',
                render: (product) => (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAdjust(product.id)}
                  >
                    Adjust
                  </Button>
                ),
              },
            ]}
          />
        </Card>

        <Card>
          <CardHeader
            title="Low stock alerts"
            subtitle={`${stats.lowStock.length + stats.outOfStock.length} product(s) require attention`}
            icon={<TriangleAlert size={18} />}
          />
          {stats.lowStock.length + stats.outOfStock.length === 0 ? (
            <p className="low-stock__empty">
              Everything is above its reorder level. Great work.
            </p>
          ) : (
            <ul className="low-stock">
              {[...stats.outOfStock, ...stats.lowStock].map((product) => (
                <li key={product.id} className="low-stock__item">
                  <span className="low-stock__icon low-stock__icon--danger">
                    <PackageX size={16} />
                  </span>
                  <span className="low-stock__text">
                    <span className="low-stock__name">{product.name}</span>
                    <span className="low-stock__meta">
                      {product.stock > 0
                        ? `${product.stock} ${product.unit} left`
                        : 'Out of stock'}{' '}
                      · {product.supplier}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAdjust(product.id)}
                  >
                    Restock
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card padded={false}>
        <div className="card__padding-x">
          <CardHeader
            title="Stock movement history"
            subtitle="Every delivery, sale and adjustment is recorded here"
            icon={<History size={18} />}
            action={
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                label="Movement type"
                options={[
                  { value: 'all', label: 'All movements' },
                  { value: 'in', label: 'Stock in' },
                  { value: 'out', label: 'Stock out' },
                  { value: 'adjustment', label: 'Adjustments' },
                ]}
              />
            }
          />
        </div>
        <DataTable<StockMovement>
          caption="Stock movement history"
          rows={movementRows}
          rowKey={(row) => row.id}
          emptyTitle="No movements recorded"
          emptyDescription="Adjustments and deliveries will appear in this table."
          columns={[
            {
              key: 'date',
              header: 'Date',
              render: (movement) => formatDateTime(movement.date),
            },
            {
              key: 'product',
              header: 'Product',
              render: (movement) => (
                <span className="table__strong">{movement.productName}</span>
              ),
            },
            {
              key: 'type',
              header: 'Type',
              render: (movement) => (
                <Badge
                  tone={
                    movement.type === 'in'
                      ? 'success'
                      : movement.type === 'out'
                        ? 'info'
                        : 'warning'
                  }
                >
                  {movement.type === 'in' ? (
                    <ArrowUpRight size={12} />
                  ) : movement.type === 'out' ? (
                    <ArrowDownRight size={12} />
                  ) : null}
                  {movement.type}
                </Badge>
              ),
            },
            {
              key: 'quantity',
              header: 'Quantity',
              align: 'right',
              render: (movement) => (
                <span
                  className={
                    movement.quantity >= 0
                      ? 'cell-positive'
                      : 'cell-negative'
                  }
                >
                  {movement.quantity > 0 ? '+' : ''}
                  {movement.quantity}
                </span>
              ),
            },
            { key: 'reason', header: 'Reason', render: (m) => m.reason },
            {
              key: 'reference',
              header: 'Reference',
              render: (movement) => (
                <span className="table__sub-inline">{movement.reference}</span>
              ),
            },
          ]}
        />
      </Card>

      <AdjustStockDialog
        open={adjustOpen}
        productId={adjustProductId}
        onClose={() => {
          setAdjustOpen(false)
          setAdjustProductId(null)
        }}
      />
    </div>
  )
}
