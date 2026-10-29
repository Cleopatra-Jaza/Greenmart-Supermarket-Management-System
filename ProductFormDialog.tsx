import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/Feedback'
import { Modal } from '../ui/Modal'
import { hasErrors, validateProduct } from '../../lib/validators'
import type { FieldErrors, ProductFormValues } from '../../lib/validators'
import type { Category, Product, Supplier } from '../../types'
import { useStore } from '../../store/storeContext'

interface ProductFormDialogProps {
  open: boolean
  product: Product | null
  onClose: () => void
}

const EMPTY_FORM: ProductFormValues = {
  name: '',
  sku: '',
  categoryId: '',
  supplierId: '',
  price: 0,
  cost: 0,
  stock: 0,
  reorderLevel: 20,
  unit: 'each',
}

function buildInitialForm(
  product: Product | null,
  categories: Category[],
  suppliers: Supplier[],
): ProductFormValues {
  if (product) {
    return {
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      unit: product.unit,
    }
  }

  return {
    ...EMPTY_FORM,
    categoryId: categories[0]?.id ?? '',
    supplierId: suppliers[0]?.id ?? '',
  }
}

export function ProductFormDialog({
  open,
  product,
  onClose,
}: ProductFormDialogProps) {
  if (!open) return null
  return <ProductForm product={product} onClose={onClose} />
}

function ProductForm({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const { categories, suppliers, addProduct, updateProduct } = useStore()
  const [form, setForm] = useState<ProductFormValues>(() =>
    buildInitialForm(product, categories, suppliers),
  )
  const [errors, setErrors] = useState<FieldErrors>({})

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories],
  )

  const supplierOptions = useMemo(
    () =>
      suppliers.map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      })),
    [suppliers],
  )

  const update = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key as string]) return current
      const next = { ...current }
      delete next[key as string]
      return next
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validation = validateProduct(form)
    if (hasErrors(validation)) {
      setErrors(validation)
      return
    }

    if (product) {
      updateProduct(product.id, form)
    } else {
      addProduct(form)
    }
    onClose()
  }

  return (
    <Modal
      open
      title={product ? 'Edit product' : 'Add new product'}
      subtitle={
        product
          ? `Update catalogue details for ${product.name}.`
          : 'Add an item to the Greenmart catalogue.'
      }
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="product-form">
            {product ? 'Save changes' : 'Add product'}
          </Button>
        </>
      }
    >
      <form id="product-form" className="form-grid" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Product name"
          htmlFor="product-name"
          error={errors.name}
          required
        >
          <input
            id="product-name"
            className="input"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="e.g. Organic Honey 500g"
          />
        </FormField>

        <FormField label="SKU" htmlFor="product-sku" error={errors.sku} required>
          <input
            id="product-sku"
            className="input"
            value={form.sku}
            onChange={(event) => update('sku', event.target.value)}
            placeholder="e.g. FP-0101"
          />
        </FormField>

        <FormField
          label="Category"
          htmlFor="product-category"
          error={errors.categoryId}
          required
        >
          <select
            id="product-category"
            className="input"
            value={form.categoryId}
            onChange={(event) => update('categoryId', event.target.value)}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Supplier"
          htmlFor="product-supplier"
          error={errors.supplierId}
          required
        >
          <select
            id="product-supplier"
            className="input"
            value={form.supplierId}
            onChange={(event) => update('supplierId', event.target.value)}
          >
            <option value="">Select a supplier</option>
            {supplierOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Selling price (LKR)"
          htmlFor="product-price"
          error={errors.price}
          required
        >
          <input
            id="product-price"
            className="input"
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(event) => update('price', Number(event.target.value))}
          />
        </FormField>

        <FormField
          label="Unit cost (LKR)"
          htmlFor="product-cost"
          error={errors.cost}
          required
        >
          <input
            id="product-cost"
            className="input"
            type="number"
            min={0}
            step="0.01"
            value={form.cost}
            onChange={(event) => update('cost', Number(event.target.value))}
          />
        </FormField>

        <FormField
          label="Stock on hand"
          htmlFor="product-stock"
          error={errors.stock}
          required
        >
          <input
            id="product-stock"
            className="input"
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => update('stock', Number(event.target.value))}
          />
        </FormField>

        <FormField
          label="Reorder level"
          htmlFor="product-reorder"
          error={errors.reorderLevel}
          required
        >
          <input
            id="product-reorder"
            className="input"
            type="number"
            min={0}
            value={form.reorderLevel}
            onChange={(event) =>
              update('reorderLevel', Number(event.target.value))
            }
          />
        </FormField>

        <FormField label="Unit" htmlFor="product-unit" error={errors.unit} required>
          <input
            id="product-unit"
            className="input"
            value={form.unit}
            onChange={(event) => update('unit', event.target.value)}
            placeholder="kg, each, packet…"
          />
        </FormField>
      </form>
    </Modal>
  )
}
