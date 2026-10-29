import { useMemo, useState } from 'react'
import {
  Download,
  Package,
  PackagePlus,
  Pencil,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { ProductFormDialog } from '../components/products/ProductFormDialog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { DataTable } from '../components/ui/DataTable'
import { PageHeader } from '../components/ui/PageHeader'
import { Pagination } from '../components/ui/Pagination'
import { SearchInput } from '../components/ui/SearchInput'
import { Select } from '../components/ui/Select'
import { PAGE_SIZE } from '../lib/constants'
import { formatLKR, formatNumber } from '../lib/format'
import { getStockStatus, STOCK_STATUS_LABEL } from '../lib/inventory'
import { useStore } from '../store/storeContext'
import type { Product } from '../types'

export function Products() {
  const { products, categories, deleteProduct, pushToast } = useStore()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term)
      const matchesCategory =
        categoryFilter === 'all' || product.categoryId === categoryFilter
      const matchesStatus =
        statusFilter === 'all' || getStockStatus(product) === statusFilter
      return matchesTerm && matchesCategory && matchesStatus
    })
  }, [products, search, categoryFilter, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleExport = () => {
    const header = 'SKU,Name,Category,Price (LKR),Stock,Unit,Status'
    const lines = filtered.map((product) =>
      [
        product.sku,
        `"${product.name}"`,
        product.category,
        product.price,
        product.stock,
        product.unit,
        STOCK_STATUS_LABEL[getStockStatus(product)],
      ].join(','),
    )
    const blob = new Blob([[header, ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'greenmart-products.csv'
    link.click()
    URL.revokeObjectURL(url)
    pushToast({
      title: 'Export ready',
      message: `${filtered.length} product(s) exported as CSV.`,
      variant: 'success',
    })
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteProduct(deleting.id)
    setDeleting(null)
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Manage every item sold in-store: pricing, stock levels and supplier links."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Download size={17} />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              icon={<PackagePlus size={17} />}
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              Add product
            </Button>
          </>
        }
      />

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search by name, SKU or supplier…"
            label="Search products"
          />
          <div className="toolbar__filters">
            <Select
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value)
                setPage(1)
              }}
              label="Category"
              options={[
                { value: 'all', label: 'All categories' },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value)
                setPage(1)
              }}
              label="Stock status"
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'in-stock', label: 'In stock' },
                { value: 'low-stock', label: 'Low stock' },
                { value: 'out-of-stock', label: 'Out of stock' },
              ]}
            />
          </div>
        </div>

        <DataTable<Product>
          caption="Greenmart product catalogue"
          rows={rows}
          rowKey={(row) => row.id}
          emptyTitle="No products match your filters"
          emptyDescription="Adjust the search term, category or stock status filter."
          emptyAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('')
                setCategoryFilter('all')
                setStatusFilter('all')
              }}
            >
              Clear filters
            </Button>
          }
          columns={[
            {
              key: 'product',
              header: 'Product',
              render: (product) => (
                <div className="cell-product">
                  <span className="cell-product__icon">
                    <Package size={16} />
                  </span>
                  <span>
                    <span className="cell-product__name">{product.name}</span>
                    <span className="cell-product__sku">{product.sku}</span>
                  </span>
                </div>
              ),
            },
            { key: 'category', header: 'Category', render: (p) => p.category },
            {
              key: 'price',
              header: 'Price',
              align: 'right',
              render: (product) => (
                <span className="table__strong">{formatLKR(product.price)}</span>
              ),
            },
            {
              key: 'cost',
              header: 'Margin',
              align: 'right',
              render: (product) => {
                const margin =
                  product.price > 0
                    ? ((product.price - product.cost) / product.price) * 100
                    : 0
                return (
                  <span className="cell-margin">
                    <TrendingUp size={13} />
                    {margin.toFixed(0)}%
                  </span>
                )
              },
            },
            {
              key: 'stock',
              header: 'Stock',
              align: 'right',
              render: (product) => (
                <span className="table__strong">
                  {formatNumber(product.stock)}{' '}
                  <span className="table__sub-inline">{product.unit}</span>
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
              key: 'actions',
              header: 'Actions',
              align: 'right',
              width: '120px',
              render: (product) => (
                <div className="row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => {
                      setEditing(product)
                      setFormOpen(true)
                    }}
                    aria-label={`Edit ${product.name}`}
                    title="Edit product"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => setDeleting(product)}
                    aria-label={`Delete ${product.name}`}
                    title="Delete product"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ),
            },
          ]}
        />

        <Pagination
          page={safePage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          label="products"
        />
      </Card>

      <ProductFormDialog
        open={formOpen}
        product={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete product"
        message={`“${deleting?.name ?? ''}” will be permanently removed from the catalogue and stock counts. This cannot be undone.`}
        confirmLabel="Delete product"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
