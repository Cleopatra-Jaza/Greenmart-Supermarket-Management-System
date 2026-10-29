import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/Feedback'
import { Modal } from '../ui/Modal'
import { hasErrors, validateCustomer } from '../../lib/validators'
import type { FieldErrors } from '../../lib/validators'
import type { Customer, CustomerTier } from '../../types'
import { useStore } from '../../store/storeContext'

interface CustomerFormDialogProps {
  open: boolean
  customer: Customer | null
  onClose: () => void
}

const TIERS: CustomerTier[] = ['Platinum', 'Gold', 'Silver', 'Bronze']

export function CustomerFormDialog({
  open,
  customer,
  onClose,
}: CustomerFormDialogProps) {
  if (!open) return null
  return <CustomerForm customer={customer} onClose={onClose} />
}

function CustomerForm({
  customer,
  onClose,
}: {
  customer: Customer | null
  onClose: () => void
}) {
  const { addCustomer, updateCustomer } = useStore()
  const [name, setName] = useState(customer?.name ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [city, setCity] = useState(customer?.city ?? '')
  const [tier, setTier] = useState<CustomerTier>(customer?.tier ?? 'Silver')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validation = validateCustomer({ name, email, phone, city, tier })
    if (hasErrors(validation)) {
      setErrors(validation)
      return
    }

    if (customer) {
      updateCustomer(customer.id, { name, email, phone, city, tier })
    } else {
      addCustomer({ name, email, phone, city, tier })
    }
    onClose()
  }

  return (
    <Modal
      open
      title={customer ? 'Edit customer' : 'Add customer'}
      subtitle={
        customer
          ? `Update contact details for ${customer.name}.`
          : 'Register a new loyalty member.'
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="customer-form">
            {customer ? 'Save changes' : 'Add customer'}
          </Button>
        </>
      }
    >
      <form
        id="customer-form"
        className="form-grid"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormField
          label="Full name"
          htmlFor="customer-name"
          error={errors.name}
          required
        >
          <input
            id="customer-name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Amara Jayawardena"
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="customer-email"
          error={errors.email}
          required
        >
          <input
            id="customer-email"
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
          />
        </FormField>

        <FormField
          label="Phone"
          htmlFor="customer-phone"
          error={errors.phone}
          required
        >
          <input
            id="customer-phone"
            className="input"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+94 77 000 0000"
          />
        </FormField>

        <FormField
          label="City"
          htmlFor="customer-city"
          error={errors.city}
          required
        >
          <input
            id="customer-city"
            className="input"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Colombo"
          />
        </FormField>

        <FormField label="Loyalty tier" htmlFor="customer-tier" required>
          <select
            id="customer-tier"
            className="input"
            value={tier}
            onChange={(event) => setTier(event.target.value as CustomerTier)}
          >
            {TIERS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </form>
    </Modal>
  )
}
