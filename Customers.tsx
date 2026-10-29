import { useMemo, useState } from 'react'
import { Eye, Mail, MapPin, Pencil, Phone, Trash2, UserPlus, Users } from 'lucide-react'
import { CustomerDetailsDialog } from '../components/customers/CustomerDetailsDialog'
import { CustomerFormDialog } from '../components/customers/CustomerFormDialog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { DataTable } from '../components/ui/DataTable'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { Select } from '../components/ui/Select'
import { StatCard } from '../components/ui/StatCard'
import { formatDate, formatLKR, formatNumber, initials } from '../lib/format'
import { useStore } from '../store/storeContext'
import type { Customer, CustomerTier } from '../types'

function tierTone(tier: CustomerTier) {
  if (tier === 'Platinum') return 'purple'
  if (tier === 'Gold') return 'warning'
  if (tier === 'Silver') return 'info'
  return 'neutral'
}

export function Customers() {
  const { customers, deleteCustomer } = useStore()

  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [viewing, setViewing] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return customers.filter((customer) => {
      const matchesTerm =
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.city.toLowerCase().includes(term)
      const matchesTier = tierFilter === 'all' || customer.tier === tierFilter
      return matchesTerm && matchesTier
    })
  }, [customers, search, tierFilter])

  const stats = useMemo(() => {
    const totalSpent = customers.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0,
    )
    const active = customers.filter((customer) => customer.status === 'active')
    const average =
      customers.length > 0 ? totalSpent / customers.length : 0
    return { totalSpent, active: active.length, average }
  }, [customers])

  return (
    <div className="page">
      <PageHeader
        eyebrow="Customer relationships"
        title="Customers"
        description="Contact details, loyalty tiers and purchase history for every shopper."
        actions={
          <Button
            icon={<UserPlus size={17} />}
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            Add customer
          </Button>
        }
      />

      <div className="stat-grid stat-grid--compact">
        <StatCard
          label="Registered customers"
          value={formatNumber(customers.length)}
          icon={<Users size={20} />}
          accent="primary"
          hint={`${stats.active} active member(s)`}
        />
        <StatCard
          label="Lifetime value"
          value={formatLKR(stats.totalSpent)}
          icon={<Users size={20} />}
          accent="secondary"
          hint="Across all registered shoppers"
        />
        <StatCard
          label="Average customer value"
          value={formatLKR(stats.average)}
          icon={<Users size={20} />}
          accent="accent"
          hint="Lifetime spend per customer"
        />
        <StatCard
          label="Platinum members"
          value={formatNumber(
            customers.filter((customer) => customer.tier === 'Platinum').length,
          )}
          icon={<Users size={20} />}
          accent="amber"
          hint="Top loyalty tier"
        />
      </div>

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, phone or city…"
            label="Search customers"
          />
          <Select
            value={tierFilter}
            onChange={setTierFilter}
            label="Loyalty tier"
            options={[
              { value: 'all', label: 'All tiers' },
              { value: 'Platinum', label: 'Platinum' },
              { value: 'Gold', label: 'Gold' },
              { value: 'Silver', label: 'Silver' },
              { value: 'Bronze', label: 'Bronze' },
            ]}
          />
        </div>

        <DataTable<Customer>
          caption="Customer directory"
          rows={filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => setViewing(row)}
          emptyTitle="No customers found"
          emptyDescription="Try a different search term or loyalty tier."
          emptyAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('')
                setTierFilter('all')
              }}
            >
              Clear filters
            </Button>
          }
          columns={[
            {
              key: 'customer',
              header: 'Customer',
              render: (customer) => (
                <div className="cell-product">
                  <span className="cell-product__avatar">
                    {initials(customer.name)}
                  </span>
                  <span>
                    <span className="cell-product__name">{customer.name}</span>
                    <span className="cell-product__sku">{customer.email}</span>
                  </span>
                </div>
              ),
            },
            {
              key: 'contact',
              header: 'Contact',
              render: (customer) => (
                <div className="cell-stack">
                  <span>
                    <Phone size={12} /> {customer.phone}
                  </span>
                  <span>
                    <MapPin size={12} /> {customer.city}
                  </span>
                </div>
              ),
            },
            {
              key: 'tier',
              header: 'Tier',
              render: (customer) => (
                <Badge tone={tierTone(customer.tier)}>{customer.tier}</Badge>
              ),
            },
            {
              key: 'orders',
              header: 'Orders',
              align: 'right',
              render: (customer) => (
                <span className="table__strong">{formatNumber(customer.orders)}</span>
              ),
            },
            {
              key: 'spent',
              header: 'Total spent',
              align: 'right',
              render: (customer) => (
                <span className="table__strong">
                  {formatLKR(customer.totalSpent)}
                </span>
              ),
            },
            {
              key: 'joined',
              header: 'Joined',
              render: (customer) => (
                <span className="table__sub-inline">
                  {formatDate(customer.joinedAt)}
                </span>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              width: '120px',
              render: (customer) => (
                <div className="row-actions row-actions--end">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setViewing(customer)}
                    aria-label={`View ${customer.name}`}
                    title="View purchase history"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => {
                      setEditing(customer)
                      setFormOpen(true)
                    }}
                    aria-label={`Edit ${customer.name}`}
                    title="Edit customer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => setDeleting(customer)}
                    aria-label={`Delete ${customer.name}`}
                    title="Delete customer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <CustomerFormDialog
        open={formOpen}
        customer={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      />

      <CustomerDetailsDialog
        open={viewing !== null}
        customer={viewing}
        onClose={() => setViewing(null)}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete customer"
        message={`“${deleting?.name ?? ''}” and their profile will be permanently removed.`}
        confirmLabel="Delete customer"
        onConfirm={() => {
          if (deleting) deleteCustomer(deleting.id)
          setDeleting(null)
        }}
        onCancel={() => setDeleting(null)}
      />

      <p className="page__footnote">
        <Mail size={13} />
        Customer records are part of the local demo dataset — no data leaves your
        browser.
      </p>
    </div>
  )
}
