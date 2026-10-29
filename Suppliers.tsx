import { useMemo, useState } from 'react'
import { Building2, Mail, MapPin, Pencil, Phone, Star, Trash2, Truck } from 'lucide-react'
import { SupplierFormDialog } from '../components/suppliers/SupplierFormDialog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { DataTable } from '../components/ui/DataTable'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { Select } from '../components/ui/Select'
import { StatCard } from '../components/ui/StatCard'
import { formatDate, formatNumber } from '../lib/format'
import { useStore } from '../store/storeContext'
import type { Supplier } from '../types'

export function Suppliers() {
  const { suppliers, products, deleteSupplier } = useStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [deleting, setDeleting] = useState<Supplier | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return suppliers.filter((supplier) => {
      const matchesTerm =
        !term ||
        supplier.name.toLowerCase().includes(term) ||
        supplier.contactName.toLowerCase().includes(term) ||
        supplier.city.toLowerCase().includes(term) ||
        supplier.email.toLowerCase().includes(term)
      const matchesStatus =
        statusFilter === 'all' || supplier.status === statusFilter
      return matchesTerm && matchesStatus
    })
  }, [suppliers, search, statusFilter])

  const stats = useMemo(() => {
    const active = suppliers.filter((supplier) => supplier.status === 'active')
    const averageRating =
      suppliers.length > 0
        ? suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) /
          suppliers.length
        : 0
    return { active: active.length, averageRating }
  }, [suppliers])

  const supplierProductCount = (supplierId: string) =>
    products.filter((product) => product.supplierId === supplierId).length

  return (
    <div className="page">
      <PageHeader
        eyebrow="Supply chain"
        title="Suppliers"
        description="Vendor contacts, delivery performance and the products they supply."
        actions={
          <Button
            icon={<Truck size={17} />}
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            Add supplier
          </Button>
        }
      />

      <div className="stat-grid stat-grid--compact">
        <StatCard
          label="Total suppliers"
          value={formatNumber(suppliers.length)}
          icon={<Building2 size={20} />}
          accent="primary"
          hint={`${stats.active} active partner(s)`}
        />
        <StatCard
          label="Average rating"
          value={`${stats.averageRating.toFixed(1)} / 5`}
          icon={<Star size={20} />}
          accent="amber"
          hint="Across all suppliers"
        />
        <StatCard
          label="Products supplied"
          value={formatNumber(
            products.filter((product) => product.supplierId).length,
          )}
          icon={<Building2 size={20} />}
          accent="secondary"
          hint="Items linked to a vendor"
        />
        <StatCard
          label="Cities covered"
          value={formatNumber(
            new Set(suppliers.map((supplier) => supplier.city)).size,
          )}
          icon={<MapPin size={20} />}
          accent="accent"
          hint="Distinct delivery locations"
        />
      </div>

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search suppliers, contacts or cities…"
            label="Search suppliers"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            label="Status"
            options={[
              { value: 'all', label: 'All suppliers' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>

        <DataTable<Supplier>
          caption="Supplier directory"
          rows={filtered}
          rowKey={(row) => row.id}
          emptyTitle="No suppliers found"
          emptyDescription="Try a different search term or status filter."
          emptyAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
              }}
            >
              Clear filters
            </Button>
          }
          columns={[
            {
              key: 'supplier',
              header: 'Supplier',
              render: (supplier) => (
                <div className="cell-product">
                  <span className="cell-product__icon">
                    <Building2 size={16} />
                  </span>
                  <span>
                    <span className="cell-product__name">{supplier.name}</span>
                    <span className="cell-product__sku">
                      {supplier.contactName}
                    </span>
                  </span>
                </div>
              ),
            },
            {
              key: 'contact',
              header: 'Contact',
              render: (supplier) => (
                <div className="cell-stack">
                  <span>
                    <Mail size={12} /> {supplier.email}
                  </span>
                  <span>
                    <Phone size={12} /> {supplier.phone}
                  </span>
                </div>
              ),
            },
            {
              key: 'city',
              header: 'City',
              render: (supplier) => (
                <span className="table__sub-inline">{supplier.city}</span>
              ),
            },
            {
              key: 'products',
              header: 'Products',
              align: 'right',
              render: (supplier) => (
                <span className="table__strong">
                  {formatNumber(supplierProductCount(supplier.id))}
                </span>
              ),
            },
            {
              key: 'rating',
              header: 'Rating',
              render: (supplier) => (
                <span className="cell-rating">
                  <Star size={13} />
                  {supplier.rating.toFixed(1)}
                </span>
              ),
            },
            {
              key: 'delivery',
              header: 'Last delivery',
              render: (supplier) => (
                <span className="table__sub-inline">
                  {formatDate(supplier.lastDelivery)}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (supplier) => (
                <Badge
                  dot
                  tone={supplier.status === 'active' ? 'success' : 'neutral'}
                >
                  {supplier.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              width: '90px',
              render: (supplier) => (
                <div className="row-actions row-actions--end">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => {
                      setEditing(supplier)
                      setFormOpen(true)
                    }}
                    aria-label={`Edit ${supplier.name}`}
                    title="Edit supplier"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => setDeleting(supplier)}
                    aria-label={`Delete ${supplier.name}`}
                    title="Delete supplier"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <SupplierFormDialog
        open={formOpen}
        supplier={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete supplier"
        message={`“${deleting?.name ?? ''}” will be removed from the supplier list. Linked products keep their details.`}
        confirmLabel="Delete supplier"
        onConfirm={() => {
          if (deleting) deleteSupplier(deleting.id)
          setDeleting(null)
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
