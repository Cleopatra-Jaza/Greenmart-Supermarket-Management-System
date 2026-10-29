import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/Feedback'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { useStore } from '../../store/storeContext'

interface AdjustStockDialogProps {
  open: boolean
  productId: string | null
  onClose: () => void
}

export function AdjustStockDialog({
  open,
  productId,
  onClose,
}: AdjustStockDialogProps) {
  if (!open) return null
  return <AdjustStockForm productId={productId} onClose={onClose} />
}

function AdjustStockForm({
  productId,
  onClose,
}: {
  productId: string | null
  onClose: () => void
}) {
  const { products, adjustStock } = useStore()
  const [selectedId, setSelectedId] = useState(
    productId ?? products[0]?.id ?? '',
  )
  const [direction, setDirection] = useState<'in' | 'out'>('in')
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const product = products.find((item) => item.id === selectedId)

  const options = useMemo(
    () =>
      products.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.stock} ${item.unit})`,
      })),
    [products],
  )

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!product) {
      setError('Select a product to adjust.')
      return
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError('Quantity must be greater than zero.')
      return
    }
    if (direction === 'out' && quantity > product.stock) {
      setError(`Only ${product.stock} ${product.unit} available on hand.`)
      return
    }
    if (!reason.trim()) {
      setError('Add a reason so the movement can be audited.')
      return
    }

    adjustStock(product.id, direction === 'in' ? quantity : -quantity, reason)
    onClose()
  }

  return (
    <Modal
      open
      title="Adjust stock"
      subtitle="Record deliveries, write-offs or manual corrections."
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="adjust-stock-form">
            Apply adjustment
          </Button>
        </>
      }
    >
      <form
        id="adjust-stock-form"
        className="form-grid form-grid--single"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormField label="Product" htmlFor="adjust-product" required>
          <select
            id="adjust-product"
            className="input"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="form-grid form-grid--two">
          <FormField label="Direction" htmlFor="adjust-direction" required>
            <Select
              value={direction}
              onChange={(value) => setDirection(value as 'in' | 'out')}
              options={[
                { value: 'in', label: 'Stock in (delivery)' },
                { value: 'out', label: 'Stock out (loss / sale)' },
              ]}
            />
          </FormField>

          <FormField label="Quantity" htmlFor="adjust-quantity" required>
            <input
              id="adjust-quantity"
              className="input"
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </FormField>
        </div>

        <FormField
          label="Reason"
          htmlFor="adjust-reason"
          error={error}
          hint="Shown in the stock movement history."
          required
        >
          <input
            id="adjust-reason"
            className="input"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Supplier delivery DN-8842"
          />
        </FormField>

        {product ? (
          <p className="form-note">
            Current stock: <strong>{product.stock} {product.unit}</strong> ·
            After adjustment:{' '}
            <strong>
              {Math.max(
                0,
                product.stock + (direction === 'in' ? quantity : -quantity),
              )}{' '}
              {product.unit}
            </strong>
          </p>
        ) : null}
      </form>
    </Modal>
  )
}
