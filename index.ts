export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type PaymentMethod = 'Cash' | 'Card' | 'Mobile Wallet' | 'Bank Transfer'

export type CustomerTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze'

export type CustomerStatus = 'active' | 'inactive'

export type MovementType = 'in' | 'out' | 'adjustment'

export type SupplierStatus = 'active' | 'inactive'

export interface Category {
  id: string
  name: string
  description: string
  color: string
  productCount: number
  revenue: number
  growth: number
}

export interface Product {
  id: string
  sku: string
  name: string
  categoryId: string
  category: string
  price: number
  cost: number
  stock: number
  reorderLevel: number
  unit: string
  supplierId: string
  supplier: string
  sales: number
  createdAt: string
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  customer: string
  date: string
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  channel: 'In-store' | 'Online' | 'Phone'
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  tier: CustomerTier
  totalSpent: number
  orders: number
  joinedAt: string
  status: CustomerStatus
}

export interface Supplier {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  city: string
  products: number
  rating: number
  status: SupplierStatus
  lastDelivery: string
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: MovementType
  quantity: number
  reason: string
  reference: string
  date: string
}

export interface Transaction {
  id: string
  orderId: string
  customer: string
  amount: number
  method: PaymentMethod
  status: OrderStatus
  date: string
}

export interface SalesPoint {
  label: string
  revenue: number
  orders: number
}

export interface CategoryShare {
  name: string
  value: number
  color: string
}

export interface TopProduct {
  id: string
  name: string
  category: string
  units: number
  revenue: number
  stock: number
}

export interface StoreSettings {
  storeName: string
  branch: string
  address: string
  phone: string
  email: string
  taxRate: number
  currency: string
  currencySymbol: string
  lowStockThreshold: number
  density: 'comfortable' | 'compact'
  animations: boolean
}

export interface Toast {
  id: string
  title: string
  message: string
  variant: 'success' | 'error' | 'info'
}
