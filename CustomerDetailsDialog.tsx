import { Mail, MapPin, Phone, ReceiptText } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { formatDate, formatLKR, initials } from '../../lib/format'
import type { Customer } from '../../types'
import { useStore } from '../../store/storeContext'

interface CustomerDetailsDialogProps {
  open: boolean
  customer: Customer | null
  onClose: () => void
}

export function CustomerDetailsDialog({
  open,
  customer,
  onClose,
}: CustomerDetailsDialogProps) {
  const { orders } = useStore()

  if (!customer) return null

  const history = orders.filter((order) => order.customerId === customer.id)
  const lifetime = history.reduce((sum, order) => sum + order.total, 0)

  return (
    <Modal
      open={open}
      title={customer.name}
      subtitle={`${customer.tier} member since ${formatDate(customer.joinedAt)}`}
      onClose={onClose}
      size="md"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="customer-detail">
        <div className="customer-detail__profile">
          <span className="customer-detail__avatar">
            {initials(customer.name)}
          </span>
          <div className="customer-detail__contact">
            <span className="customer-detail__contact-row">
              <Mail size={14} />
              {customer.email}
            </span>
            <span className="customer-detail__contact-row">
              <Phone size={14} />
              {customer.phone}
            </span>
            <span className="customer-detail__contact-row">
              <MapPin size={14} />
              {customer.city}
            </span>
          </div>
          <div className="customer-detail__stats">
            <span className="customer-detail__stat">
              <strong>{history.length}</strong>
              orders
            </span>
            <span className="customer-detail__stat">
              <strong>{formatLKR(lifetime)}</strong>
              lifetime
            </span>
            <span className="customer-detail__stat">
              <Badge tone={customer.status === 'active' ? 'success' : 'neutral'} dot>
                {customer.status}
              </Badge>
            </span>
          </div>
        </div>

        <h4 className="order-detail__section-title">
          <ReceiptText size={15} />
          Purchase history
        </h4>

        {history.length === 0 ? (
          <p className="customer-detail__empty">
            This customer has no orders in the current dataset.
          </p>
        ) : (
          <ul className="order-detail__items">
            {history.map((order) => (
              <li key={order.id}>
                <span className="order-detail__item-name">{order.id}</span>
                <span className="order-detail__item-qty">
                  {formatDate(order.date)} · {order.channel}
                </span>
                <span className="order-detail__item-total">
                  {formatLKR(order.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}
