export interface FieldErrors {
  [field: string]: string
}

export interface ProductFormValues {
  name: string
  sku: string
  categoryId: string
  supplierId: string
  price: number
  cost: number
  stock: number
  reorderLevel: number
  unit: string
}

/** Validates the product form. Returns a map of field -> message. */
export function validateProduct(values: ProductFormValues): FieldErrors {
  const errors: FieldErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Product name is required'
  } else if (values.name.trim().length < 3) {
    errors.name = 'Use at least 3 characters'
  }

  if (!values.sku.trim()) {
    errors.sku = 'SKU is required'
  } else if (!/^[A-Za-z0-9-]{3,20}$/.test(values.sku.trim())) {
    errors.sku = 'SKU may only contain letters, numbers and dashes'
  }

  if (!values.categoryId) errors.categoryId = 'Select a category'
  if (!values.supplierId) errors.supplierId = 'Select a supplier'

  if (!Number.isFinite(values.price) || values.price <= 0) {
    errors.price = 'Selling price must be greater than 0'
  }

  if (!Number.isFinite(values.cost) || values.cost < 0) {
    errors.cost = 'Cost cannot be negative'
  } else if (values.cost > values.price) {
    errors.cost = 'Cost should not exceed the selling price'
  }

  if (!Number.isFinite(values.stock) || values.stock < 0) {
    errors.stock = 'Stock cannot be negative'
  }

  if (!Number.isFinite(values.reorderLevel) || values.reorderLevel < 0) {
    errors.reorderLevel = 'Reorder level cannot be negative'
  }

  if (!values.unit.trim()) errors.unit = 'Unit is required'

  return errors
}

export interface CategoryFormValues {
  name: string
  description: string
  color: string
}

export function validateCategory(values: CategoryFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) {
    errors.name = 'Category name is required'
  } else if (values.name.trim().length < 3) {
    errors.name = 'Use at least 3 characters'
  }
  if (!values.description.trim()) {
    errors.description = 'Description is required'
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(values.color)) {
    errors.color = 'Use a hex colour such as #10B981'
  }
  return errors
}

export interface CustomerFormValues {
  name: string
  email: string
  phone: string
  city: string
  tier: string
}

export function validateCustomer(values: CustomerFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = 'Customer name is required'
  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^[+()\-\s\d]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number'
  }
  if (!values.city.trim()) errors.city = 'City is required'
  return errors
}

export interface SupplierFormValues {
  name: string
  contactName: string
  email: string
  phone: string
  city: string
}

export function validateSupplier(values: SupplierFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = 'Company name is required'
  if (!values.contactName.trim()) errors.contactName = 'Contact person is required'
  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!values.phone.trim()) errors.phone = 'Phone number is required'
  if (!values.city.trim()) errors.city = 'City is required'
  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
