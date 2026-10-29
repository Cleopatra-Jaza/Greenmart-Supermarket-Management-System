import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Layers, Pencil, Plus, Trash2, TrendingUp } from 'lucide-react'
import { CategoryFormDialog } from '../components/categories/CategoryFormDialog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/States'
import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/Feedback'
import { SearchInput } from '../components/ui/SearchInput'
import { formatLKR, formatNumber } from '../lib/format'
import { useStore } from '../store/storeContext'
import type { Category } from '../types'

export function Categories() {
  const { categories, products, deleteCategory } = useStore()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return categories
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term),
    )
  }, [categories, search])

  const maxRevenue = Math.max(
    ...categories.map((category) => category.revenue),
    1,
  )

  const totalRevenue = categories.reduce(
    (sum, category) => sum + category.revenue,
    0,
  )

  const liveCount = (categoryId: string) =>
    products.filter((product) => product.categoryId === categoryId).length

  return (
    <div className="page">
      <PageHeader
        eyebrow="Merchandising"
        title="Categories"
        description="Departments group your catalogue, drive dashboards and simplify reporting."
        actions={
          <Button
            icon={<Plus size={17} />}
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            New category
          </Button>
        }
      />

      <div className="grid grid--2-1">
        <Card>
          <CardHeader
            title="Department performance"
            subtitle="Revenue contribution per category"
            icon={<TrendingUp size={18} />}
            action={
              <span className="card__metric">
                {formatLKR(totalRevenue)} total
              </span>
            }
          />
          <div className="category-list">
            {categories.map((category) => (
              <div key={category.id} className="category-list__row">
                <span
                  className="category-list__dot"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <span className="category-list__name">{category.name}</span>
                <span className="category-list__bar">
                  <ProgressBar
                    value={category.revenue}
                    max={maxRevenue}
                    tone="accent"
                  />
                </span>
                <span className="category-list__value">
                  {formatLKR(category.revenue)}
                </span>
                <Badge
                  tone={category.growth >= 0 ? 'success' : 'danger'}
                  className="category-list__growth"
                >
                  {category.growth >= 0 ? '+' : ''}
                  {category.growth}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Category health"
            subtitle="Distribution of the catalogue"
            icon={<Layers size={18} />}
          />
          <ul className="health-list">
            <li className="health-list__item">
              <span className="health-list__label">Categories</span>
              <span className="health-list__value">
                {formatNumber(categories.length)}
              </span>
            </li>
            <li className="health-list__item">
              <span className="health-list__label">Products</span>
              <span className="health-list__value">
                {formatNumber(products.length)}
              </span>
            </li>
            <li className="health-list__item">
              <span className="health-list__label">
                Average products / category
              </span>
              <span className="health-list__value">
                {categories.length > 0
                  ? (products.length / categories.length).toFixed(1)
                  : '0'}
              </span>
            </li>
            <li className="health-list__item">
              <span className="health-list__label">Top department</span>
              <span className="health-list__value">
                {categories.length > 0
                  ? [...categories].sort((a, b) => b.revenue - a.revenue)[0].name
                  : '—'}
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories…"
            label="Search categories"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No categories found"
            description="Try a different search term or create a new department."
            icon={<Layers size={26} />}
            action={
              <Button
                variant="secondary"
                size="sm"
                icon={<Plus size={15} />}
                onClick={() => {
                  setEditing(null)
                  setFormOpen(true)
                }}
              >
                New category
              </Button>
            }
          />
        ) : (
          <div className="category-grid">
            {filtered.map((category) => (
              <article
                key={category.id}
                className="category-card"
                style={{ '--cat-accent': category.color } as CSSProperties}
              >
                <span className="category-card__accent" aria-hidden="true" />
                <header className="category-card__header">
                  <span className="category-card__icon">
                    <Layers size={18} />
                  </span>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => {
                        setEditing(category)
                        setFormOpen(true)
                      }}
                      aria-label={`Edit ${category.name}`}
                      title="Edit category"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      onClick={() => setDeleting(category)}
                      aria-label={`Delete ${category.name}`}
                      title="Delete category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </header>
                <h3 className="category-card__name">{category.name}</h3>
                <p className="category-card__description">{category.description}</p>
                <div className="category-card__stats">
                  <span>
                    <strong>{formatNumber(liveCount(category.id))}</strong>
                    products
                  </span>
                  <span>
                    <strong>{formatLKR(category.revenue)}</strong>
                    revenue
                  </span>
                </div>
                <ProgressBar
                  value={category.revenue}
                  max={maxRevenue}
                  tone="accent"
                />
              </article>
            ))}
          </div>
        )}
      </Card>

      <CategoryFormDialog
        open={formOpen}
        category={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete category"
        message={`“${deleting?.name ?? ''}” will be removed. Categories that still contain products cannot be deleted.`}
        confirmLabel="Delete category"
        onConfirm={() => {
          if (deleting) deleteCategory(deleting.id)
          setDeleting(null)
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
