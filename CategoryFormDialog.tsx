import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/Feedback'
import { Modal } from '../ui/Modal'
import { hasErrors, validateCategory } from '../../lib/validators'
import type { FieldErrors } from '../../lib/validators'
import type { Category } from '../../types'
import { useStore } from '../../store/storeContext'

interface CategoryFormDialogProps {
  open: boolean
  category: Category | null
  onClose: () => void
}

const PALETTE = [
  '#10B981',
  '#047857',
  '#065F46',
  '#34D399',
  '#0EA5E9',
  '#8B5CF6',
  '#F59E0B',
  '#EC4899',
  '#DC2626',
  '#64748B',
]

export function CategoryFormDialog({
  open,
  category,
  onClose,
}: CategoryFormDialogProps) {
  if (!open) return null
  return <CategoryForm category={category} onClose={onClose} />
}

function CategoryForm({
  category,
  onClose,
}: {
  category: Category | null
  onClose: () => void
}) {
  const { addCategory, updateCategory } = useStore()
  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [color, setColor] = useState(category?.color ?? PALETTE[0])
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validation = validateCategory({ name, description, color })
    if (hasErrors(validation)) {
      setErrors(validation)
      return
    }

    if (category) {
      updateCategory(category.id, { name, description, color })
    } else {
      addCategory({ name, description, color })
    }
    onClose()
  }

  return (
    <Modal
      open
      title={category ? 'Edit category' : 'New category'}
      subtitle={
        category
          ? `Update details for ${category.name}.`
          : 'Group products into a department.'
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="category-form">
            {category ? 'Save changes' : 'Create category'}
          </Button>
        </>
      }
    >
      <form
        id="category-form"
        className="form-grid form-grid--single"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormField
          label="Category name"
          htmlFor="category-name"
          error={errors.name}
          required
        >
          <input
            id="category-name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Frozen Foods"
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="category-description"
          error={errors.description}
          required
        >
          <textarea
            id="category-description"
            className="input input--textarea"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short summary of the department"
          />
        </FormField>

        <FormField
          label="Accent colour"
          htmlFor="category-color"
          error={errors.color}
          required
        >
          <div className="color-picker">
            {PALETTE.map((swatch) => (
              <button
                key={swatch}
                type="button"
                className={`color-picker__swatch${
                  color === swatch ? ' is-active' : ''
                }`}
                style={{ backgroundColor: swatch }}
                onClick={() => setColor(swatch)}
                aria-label={`Use colour ${swatch}`}
                aria-pressed={color === swatch}
              />
            ))}
            <input
              id="category-color"
              className="input input--color"
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              aria-label="Custom colour"
            />
          </div>
        </FormField>
      </form>
    </Modal>
  )
}
