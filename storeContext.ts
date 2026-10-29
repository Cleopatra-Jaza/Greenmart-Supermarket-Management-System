import { createContext, useContext } from 'react'
import type {
  Category,
  Customer,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  StoreSettings,
  StockMovement,
  StockStatus,
  Supplier,
  Toast,
} from '../types'

export interface ProductInput {
  name: string
  sku: string
  categoryId: string
  price: number
  cost: number
  stock: number
  reorderLevel: number
  unit: string
  supplierId: string
}

export interface CartLine {
  productId: string
  quantity: number
}

export interface StoreValue {
  products: Product[]
  categories: Category[]
  customers: Customer[]
  suppliers: Supplier[]
  orders: Order[]
  stockMovements: StockMovement[]
  settings: StoreSettings
  toasts: Toast[]

  addProduct: (input: ProductInput) => Product
  updateProduct: (id: string, input: ProductInput) => void
  deleteProduct: (id: string) => void

  addCategory: (input: Omit<Category, 'id' | 'productCount' | 'revenue' | 'growth'>) => Category
  updateCategory: (id: string, input: Pick<Category, 'name' | 'description' | 'color'>) => void
  deleteCategory: (id: string) => void

  addCustomer: (input: Omit<Customer, 'id' | 'totalSpent' | 'orders' | 'joinedAt' | 'status'>) => Customer
  updateCustomer: (id: string, input: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  addSupplier: (input: Omit<Supplier, 'id' | 'products' | 'rating' | 'status' | 'lastDelivery'>) => Supplier
  updateSupplier: (id: string, input: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void

  updateOrderStatus: (id: string, status: OrderStatus) => void
  createOrder: (
    lines: CartLine[],
    customerId: string,
    paymentMethod: PaymentMethod,
    discount: number,
  ) => Order | null

  adjustStock: (productId: string, delta: number, reason: string) => void
  updateSettings: (patch: Partial<StoreSettings>) => void

  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

export const StoreContext = createContext<StoreValue | null>(null)

/** Access the Greenmart store. Throws when used outside of the provider. */
export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) {
    throw new Error('useStore must be used inside <StoreProvider>')
  }
  return value
}

export const PRODUCT_STATUSES: StockStatus[] = [
  'in-stock',
  'low-stock',
  'out-of-stock',
]
