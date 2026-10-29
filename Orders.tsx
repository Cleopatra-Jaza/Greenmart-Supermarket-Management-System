import { useMemo, useState } from 'react'
import { Eye, ReceiptText, Search } from 'lucide-react'
import { OrderDetailsDialog } from '../components/orders/OrderDetailsDialog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { Select } from '../components/ui/Select'
import { StatCard } from '../components/ui/StatCard'
import { formatDateTime, formatLKR, formatNumber } from '../lib/format'
import { useStore } from '../store/storeContext'
import type { Order, OrderStatus } from '../types'

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

function statusTone(status: OrderStatus) {
  if (status === 'completed') return 'success'
  if (status === 'pending') return 'warning'
  if (status === 'cancelled') return 'danger'
  if (status === 'refunded') return 'info'
  return 'purple'
}

export function Orders() {
  const { orders, updateOrderStatus } = useStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')
  const [selected, setSelected] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesTerm =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term)
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter
      const matchesChannel =
        channelFilter === 'all' || order.channel === channelFilter
      return matchesTerm && matchesStatus && matchesChannel
    })
  }, [orders, search, statusFilter, channelFilter])

  const stats = useMemo(() => {
    const completed = orders.filter((order) => order.status === 'completed')
    const revenue = completed.reduce((sum, order) => sum + order.total, 0)
    const average =
      completed.length > 0 ? revenue / completed.length : 0
    return {
      total: orders.length,
      completed: completed.length,
      pending: orders.filter((order) => order.status === 'pending').length,
      revenue,
      average,
    }
  }, [orders])

  return (
    <div className="page">
      <PageHeader
        eyebrow="Order management"
        title="Orders"
        description="Track every order from checkout to fulfilment, and update statuses as they move."
      />

      <div className="stat-grid stat-grid--compact">
        <StatCard
          label="Total orders"
          value={formatNumber(stats.total)}
          icon={<ReceiptText size={20} />}
          accent="primary"
          hint={`${formatNumber(stats.completed)} completed`}
        />
        <StatCard
          label="Order revenue"
          value={formatLKR(stats.revenue)}
          icon={<ReceiptText size={20} />}
          accent="secondary"
          hint="Completed orders only"
        />
        <StatCard
          label="Average order value"
          value={formatLKR(stats.average)}
          icon={<ReceiptText size={20} />}
          accent="accent"
          hint="Across completed orders"
        />
        <StatCard
          label="Awaiting processing"
          value={formatNumber(stats.pending)}
          icon={<Search size={20} />}
          accent="amber"
          hint="Orders still in the queue"
        />
      </div>

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by order ID or customer…"
            label="Search orders"
          />
          <div className="toolbar__filters">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              label="Status"
              options={STATUS_FILTERS}
            />
            <Select
              value={channelFilter}
              onChange={setChannelFilter}
              label="Channel"
              options={[
                { value: 'all', label: 'All channels' },
                { value: 'In-store', label: 'In-store' },
                { value: 'Online', label: 'Online' },
                { value: 'Phone', label: 'Phone' },
              ]}
            />
          </div>
        </div>

        <DataTable<Order>
          caption="Order history"
          rows={filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelected(row)}
          emptyTitle="No orders match your filters"
          emptyDescription="Try a different search term or reset the filters."
          emptyAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setChannelFilter('all')
              }}
            >
              Reset filters
            </Button>
          }
          columns={[
            {
              key: 'id',
              header: 'Order',
              render: (order) => (
                <div>
                  <span className="table__strong">{order.id}</span>
                  <span className="table__sub">{formatDateTime(order.date)}</span>
                </div>
              ),
            },
            { key: 'customer', header: 'Customer', render: (order) => order.customer },
            {
              key: 'items',
              header: 'Items',
              align: 'right',
              render: (order) => (
                <span className="table__sub-inline">
                  {formatNumber(
                    order.items.reduce((sum, item) => sum + item.quantity, 0),
                  )}
                </span>
              ),
            },
            { key: 'channel', header: 'Channel', render: (order) => order.channel },
            {
              key: 'payment',
              header: 'Payment',
              render: (order) => (
                <span className="table__sub-inline">{order.paymentMethod}</span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (order) => (
                <Badge tone={statusTone(order.status)} dot>
                  {order.status}
                </Badge>
              ),
            },
            {
              key: 'total',
              header: 'Total',
              align: 'right',
              render: (order) => (
                <span className="table__strong">{formatLKR(order.total)}</span>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              width: '150px',
              render: (order) => (
                <div className="row-actions row-actions--end">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => setSelected(order)}
                  >
                    View
                  </Button>
                  {order.status === 'pending' ? (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                    >
                      Process
                    </Button>
                  ) : null}
                </div>
              ),
            },
          ]}
        />
      </Card>

      <OrderDetailsDialog
        open={selected !== null}
        order={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
