import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/Feedback'
import { Modal } from '../ui/Modal'
import { hasErrors, validateSupplier } from '../../lib/validators'
import type { FieldErrors } from '../../lib/validators'
import type { Supplier } from '../../types'
import { useStore } from '../../store/storeContext'

interface SupplierFormDialogProps {
  open: boolean
  supplier: Supplier | null
  onClose: () => void
}

export function SupplierFormDialog({
  open,
  supplier,
  onClose,
}: SupplierFormDialogProps) {
  if (!open) return null
  return <SupplierForm supplier={supplier} onClose={onClose} />
}

function SupplierForm({
  supplier,
  onClose,
}: {
  supplier: Supplier | null
  onClose: () => void
}) {
  const { addSupplier, updateSupplier } = useStore()
  const [name, setName] = useState(supplier?.name ?? '')
  const [contactName, setContactName] = useState(supplier?.contactName ?? '')
  const [email, setEmail] = useState(supplier?.email ?? '')
  const [phone, setPhone] = useState(supplier?.phone ?? '')
  const [city, setCity] = useState(supplier?.city ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validation = validateSupplier({
      name,
      contactName,
      email,
      phone,
      city,
    })
    if (hasErrors(validation)) {
      setErrors(validation)
      return
    }

    if (supplier) {
      updateSupplier(supplier.id, { name, contactName, email, phone, city })
    } else {
      addSupplier({ name, contactName, email, phone, city })
    }
    onClose()
  }

  return (
    <Modal
      open
      title={supplier ? 'Edit supplier' : 'Add supplier'}
      subtitle={
        supplier
          ? `Update details for ${supplier.name}.`
          : 'Register a new vendor that supplies your store.'
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="supplier-form">
            {supplier ? 'Save changes' : 'Add supplier'}
          </Button>
        </>
      }
    >
      <form
        id="supplier-form"
        className="form-grid"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormField
          label="Company name"
          htmlFor="supplier-name"
          error={errors.name}
          required
        >
          <input
            id="supplier-name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Ceylon Fresh Farms"
          />
        </FormField>

        <FormField
          label="Contact person"
          htmlFor="supplier-contact"
          error={errors.contactName}
          required
        >
          <input
            id="supplier-contact"
            className="input"
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            placeholder="e.g. Nimal Perera"
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="supplier-email"
          error={errors.email}
          required
        >
          <input
            id="supplier-email"
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="orders@supplier.lk"
          />
        </FormField>

        <FormField
          label="Phone"
          htmlFor="supplier-phone"
          error={errors.phone}
          required
        >
          <input
            id="supplier-phone"
            className="input"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+94 11 000 0000"
          />
        </FormField>

        <FormField
          label="City"
          htmlFor="supplier-city"
          error={errors.city}
          required
        >
          <input
            id="supplier-city"
            className="input"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Colombo"
          />
        </FormField>
      </form>
    </Modal>
  )
}
