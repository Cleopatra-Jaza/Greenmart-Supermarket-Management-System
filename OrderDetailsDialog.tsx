import { ReceiptText } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { formatDateTime, formatLKR } from '../../lib/format'
import type { Order, OrderStatus } from '../../types'
import { useStore } from '../../store/storeContext'

interface OrderDetailsDialogProps {
  open: boolean
  order: Order | null
  onClose: () => void
}

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'processing',
  'completed',
  'cancelled',
  'refunded',
]

function statusTone(status: OrderStatus) {
  if (status === 'completed') return 'success'
  if (status === 'pending') return 'warning'
  if (status === 'cancelled') return 'danger'
  if (status === 'refunded') return 'info'
  return 'purple'
}

export function OrderDetailsDialog({
  open,
  order,
  onClose,
}: OrderDetailsDialogProps) {
  const { updateOrderStatus, settings } = useStore()

  if (!order) return null

  return (
    <Modal
      open={open}
      title={`Order ${order.id}`}
      subtitle={`${order.customer} · ${formatDateTime(order.date)}`}
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {STATUS_OPTIONS.filter((status) => status !== order.status).map(
            (status) => (
              <Button
                key={status}
                variant={
                  status === 'cancelled' || status === 'refunded'
                    ? 'danger'
                    : 'primary'
                }
                onClick={() => updateOrderStatus(order.id, status)}
              >
                Mark {status}
              </Button>
            ),
          )}
        </>
      }
    >
      <div className="order-detail">
        <div className="order-detail__meta">
          <span className="order-detail__meta-item">
            <span className="order-detail__meta-label">Status</span>
            <Badge tone={statusTone(order.status)} dot>
              {order.status}
            </Badge>
          </span>
          <span className="order-detail__meta-item">
            <span className="order-detail__meta-label">Channel</span>
            <span className="order-detail__meta-value">{order.channel}</span>
          </span>
          <span className="order-detail__meta-item">
            <span className="order-detail__meta-label">Payment</span>
            <span className="order-detail__meta-value">
              {order.paymentMethod}
            </span>
          </span>
          <span className="order-detail__meta-item">
            <span className="order-detail__meta-label">Store</span>
            <span className="order-detail__meta-value">{settings.branch}</span>
          </span>
        </div>

        <h4 className="order-detail__section-title">
          <ReceiptText size={15} />
          Items
        </h4>
        <ul className="order-detail__items">
          {order.items.map((item) => (
            <li key={item.productId}>
              <span className="order-detail__item-name">{item.name}</span>
              <span className="order-detail__item-qty">
                {item.quantity} × {formatLKR(item.price)}
              </span>
              <span className="order-detail__item-total">
                {formatLKR(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="order-detail__totals">
          <div>
            <span>Subtotal</span>
            <span>{formatLKR(order.subtotal)}</span>
          </div>
          <div>
            <span>Discount</span>
            <span>− {formatLKR(order.discount)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>{formatLKR(order.tax)}</span>
          </div>
          <div className="order-detail__grand">
            <span>Total</span>
            <span>{formatLKR(order.total)}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
