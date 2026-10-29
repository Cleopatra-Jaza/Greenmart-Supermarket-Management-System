import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { categories as seedCategories } from '../data/categories'
import { customers as seedCustomers } from '../data/customers'
import { orders as seedOrders } from '../data/orders'
import { products as seedProducts } from '../data/products'
import { stockMovements as seedMovements } from '../data/stockMovements'
import { suppliers as seedSuppliers } from '../data/suppliers'
import { TAX_RATE } from '../lib/constants'
import type {
  Category,
  Customer,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  StoreSettings,
  StockMovement,
  Supplier,
  Toast,
} from '../types'
import type { CartLine, ProductInput, StoreValue } from './storeContext'
import { StoreContext } from './storeContext'

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Greenmart Supercentre',
  branch: 'Colombo Central',
  address: '128 Galle Road, Colombo 03',
  phone: '+94 11 234 5678',
  email: 'hello@greenmart.lk',
  taxRate: TAX_RATE,
  currency: 'LKR',
  currencySymbol: 'Rs',
  lowStockThreshold: 25,
  density: 'comfortable',
  animations: true,
}

let idCounter = 0
function nextId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [categories, setCategories] = useState<Category[]>(seedCategories)
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers)
  const [suppliers, setSuppliers] = useState<Supplier[]>(seedSuppliers)
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const [stockMovements, setStockMovements] =
    useState<StockMovement[]>(seedMovements)
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = nextId('toast')
    setToasts((current) => [...current, { ...toast, id }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4200)
  }, [])

  const addProduct = useCallback(
    (input: ProductInput): Product => {
      const category = categories.find((item) => item.id === input.categoryId)
      const supplier = suppliers.find((item) => item.id === input.supplierId)

      const product: Product = {
        id: nextId('prd'),
        sku: input.sku.trim().toUpperCase(),
        name: input.name.trim(),
        categoryId: input.categoryId,
        category: category?.name ?? 'Uncategorised',
        price: input.price,
        cost: input.cost,
        stock: input.stock,
        reorderLevel: input.reorderLevel,
        unit: input.unit.trim(),
        supplierId: input.supplierId,
        supplier: supplier?.name ?? 'Unassigned',
        sales: 0,
        createdAt: new Date().toISOString(),
      }

      setProducts((current) => [product, ...current])
      setCategories((current) =>
        current.map((item) =>
          item.id === input.categoryId
            ? { ...item, productCount: item.productCount + 1 }
            : item,
        ),
      )
      if (supplier) {
        setSuppliers((current) =>
          current.map((item) =>
            item.id === supplier.id
              ? { ...item, products: item.products + 1 }
              : item,
          ),
        )
      }

      pushToast({
        title: 'Product added',
        message: `${product.name} is now in the catalogue.`,
        variant: 'success',
      })

      return product
    },
    [categories, suppliers, pushToast],
  )

  const updateProduct = useCallback(
    (id: string, input: ProductInput) => {
      setProducts((current) =>
        current.map((product) => {
          if (product.id !== id) return product
          const category = categories.find((item) => item.id === input.categoryId)
          const supplier = suppliers.find((item) => item.id === input.supplierId)
          return {
            ...product,
            name: input.name.trim(),
            sku: input.sku.trim().toUpperCase(),
            categoryId: input.categoryId,
            category: category?.name ?? product.category,
            price: input.price,
            cost: input.cost,
            stock: input.stock,
            reorderLevel: input.reorderLevel,
            unit: input.unit.trim(),
            supplierId: input.supplierId,
            supplier: supplier?.name ?? product.supplier,
          }
        }),
      )
      pushToast({
        title: 'Product updated',
        message: `${input.name} was saved successfully.`,
        variant: 'success',
      })
    },
    [categories, suppliers, pushToast],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      const target = products.find((product) => product.id === id)
      setProducts((current) => current.filter((product) => product.id !== id))
      if (target) {
        setCategories((current) =>
          current.map((category) =>
            category.id === target.categoryId
              ? {
                  ...category,
                  productCount: Math.max(0, category.productCount - 1),
                }
              : category,
          ),
        )
        setSuppliers((current) =>
          current.map((supplier) =>
            supplier.id === target.supplierId
              ? {
                  ...supplier,
                  products: Math.max(0, supplier.products - 1),
                }
              : supplier,
          ),
        )
      }
      pushToast({
        title: 'Product deleted',
        message: `${target?.name ?? 'Product'} was removed from the catalogue.`,
        variant: 'info',
      })
    },
    [products, pushToast],
  )

  const addCategory: StoreValue['addCategory'] = useCallback(
    (input) => {
      const category: Category = {
        id: nextId('cat'),
        name: input.name.trim(),
        description: input.description.trim(),
        color: input.color,
        productCount: 0,
        revenue: 0,
        growth: 0,
      }
      setCategories((current) => [...current, category])
      pushToast({
        title: 'Category created',
        message: `${category.name} is ready for products.`,
        variant: 'success',
      })
      return category
    },
    [pushToast],
  )

  const updateCategory: StoreValue['updateCategory'] = useCallback(
    (id, input) => {
      setCategories((current) =>
        current.map((category) =>
          category.id === id
            ? {
                ...category,
                name: input.name.trim(),
                description: input.description.trim(),
                color: input.color,
              }
            : category,
        ),
      )
      pushToast({
        title: 'Category updated',
        message: `${input.name} was saved successfully.`,
        variant: 'success',
      })
    },
    [pushToast],
  )

  const deleteCategory: StoreValue['deleteCategory'] = useCallback(
    (id) => {
      const inUse = products.filter((product) => product.categoryId === id).length
      if (inUse > 0) {
        pushToast({
          title: 'Cannot delete category',
          message: `${inUse} product(s) still belong to this category.`,
          variant: 'error',
        })
        return
      }
      setCategories((current) => current.filter((category) => category.id !== id))
      pushToast({
        title: 'Category deleted',
        message: 'The category was removed.',
        variant: 'info',
      })
    },
    [products, pushToast],
  )

  const addCustomer: StoreValue['addCustomer'] = useCallback(
    (input) => {
      const customer: Customer = {
        id: nextId('cus'),
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        city: input.city.trim(),
        tier: input.tier,
        totalSpent: 0,
        orders: 0,
        joinedAt: new Date().toISOString(),
        status: 'active',
      }
      setCustomers((current) => [customer, ...current])
      pushToast({
        title: 'Customer added',
        message: `${customer.name} was added to the customer list.`,
        variant: 'success',
      })
      return customer
    },
    [pushToast],
  )

  const updateCustomer: StoreValue['updateCustomer'] = useCallback(
    (id, input) => {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === id ? { ...customer, ...input } : customer,
        ),
      )
      pushToast({
        title: 'Customer updated',
        message: 'Customer details were saved.',
        variant: 'success',
      })
    },
    [pushToast],
  )

  const deleteCustomer: StoreValue['deleteCustomer'] = useCallback(
    (id) => {
      setCustomers((current) => current.filter((customer) => customer.id !== id))
      pushToast({
        title: 'Customer removed',
        message: 'The customer record was deleted.',
        variant: 'info',
      })
    },
    [pushToast],
  )

  const addSupplier: StoreValue['addSupplier'] = useCallback(
    (input) => {
      const supplier: Supplier = {
        id: nextId('sup'),
        name: input.name.trim(),
        contactName: input.contactName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        city: input.city.trim(),
        products: 0,
        rating: 4,
        status: 'active',
        lastDelivery: new Date().toISOString(),
      }
      setSuppliers((current) => [supplier, ...current])
      pushToast({
        title: 'Supplier added',
        message: `${supplier.name} was added to the supplier list.`,
        variant: 'success',
      })
      return supplier
    },
    [pushToast],
  )

  const updateSupplier: StoreValue['updateSupplier'] = useCallback(
    (id, input) => {
      setSuppliers((current) =>
        current.map((supplier) =>
          supplier.id === id ? { ...supplier, ...input } : supplier,
        ),
      )
      pushToast({
        title: 'Supplier updated',
        message: 'Supplier details were saved.',
        variant: 'success',
      })
    },
    [pushToast],
  )

  const deleteSupplier: StoreValue['deleteSupplier'] = useCallback(
    (id) => {
      setSuppliers((current) => current.filter((supplier) => supplier.id !== id))
      pushToast({
        title: 'Supplier removed',
        message: 'The supplier record was deleted.',
        variant: 'info',
      })
    },
    [pushToast],
  )

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setOrders((current) =>
        current.map((order) => (order.id === id ? { ...order, status } : order)),
      )
      pushToast({
        title: 'Order updated',
        message: `${id} is now marked as ${status}.`,
        variant: 'success',
      })
    },
    [pushToast],
  )

  const createOrder = useCallback(
    (
      lines: CartLine[],
      customerId: string,
      paymentMethod: PaymentMethod,
      discount: number,
    ): Order | null => {
      if (lines.length === 0) {
        pushToast({
          title: 'Cart is empty',
          message: 'Add at least one product before checkout.',
          variant: 'error',
        })
        return null
      }

      const customer = customers.find((item) => item.id === customerId)
      const items = lines
        .map((line) => {
          const product = products.find((item) => item.id === line.productId)
          if (!product) return null
          return {
            productId: product.id,
            name: product.name,
            quantity: line.quantity,
            price: product.price,
          }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

      if (items.length === 0) {
        pushToast({
          title: 'Unable to complete sale',
          message: 'The products in the cart are no longer available.',
          variant: 'error',
        })
        return null
      }

      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
      const tax = Math.round((subtotal - discount) * settings.taxRate * 100) / 100
      const total = Math.round((subtotal - discount + tax) * 100) / 100

      const order: Order = {
        id: `ORD-${1043 + orders.length}`,
        customerId: customer?.id ?? 'cus-01',
        customer: customer?.name ?? 'Walk-in Customer',
        date: new Date().toISOString(),
        items,
        subtotal,
        discount,
        tax,
        total,
        status: 'completed',
        paymentMethod,
        channel: 'In-store',
      }

      setOrders((current) => [order, ...current])

      setProducts((current) =>
        current.map((product) => {
          const line = items.find((item) => item.productId === product.id)
          if (!line) return product
          return {
            ...product,
            stock: Math.max(0, product.stock - line.quantity),
            sales: product.sales + line.quantity,
          }
        }),
      )

      const movements: StockMovement[] = items.map((item) => ({
        id: nextId('MOV'),
        productId: item.productId,
        productName: item.name,
        type: 'out',
        quantity: -item.quantity,
        reason: 'Store sales',
        reference: order.id,
        date: order.date,
      }))

      setStockMovements((current) => [...movements, ...current])

      if (customer) {
        setCustomers((current) =>
          current.map((item) =>
            item.id === customer.id
              ? {
                  ...item,
                  orders: item.orders + 1,
                  totalSpent: Math.round((item.totalSpent + total) * 100) / 100,
                }
              : item,
          ),
        )
      }

      pushToast({
        title: 'Sale completed',
        message: `${order.id} · ${order.customer}`,
        variant: 'success',
      })

      return order
    },
    [customers, orders.length, products, pushToast, settings.taxRate],
  )

  const adjustStock = useCallback(
    (productId: string, delta: number, reason: string) => {
      const product = products.find((item) => item.id === productId)
      if (!product) return

      const nextStock = Math.max(0, product.stock + delta)
      setProducts((current) =>
        current.map((item) =>
          item.id === productId ? { ...item, stock: nextStock } : item,
        ),
      )

      const movement: StockMovement = {
        id: nextId('MOV'),
        productId,
        productName: product.name,
        type: delta > 0 ? 'in' : delta < 0 ? 'out' : 'adjustment',
        quantity: delta,
        reason: reason.trim() || 'Manual adjustment',
        reference: `ADJ-${Math.floor(Math.random() * 900 + 100)}`,
        date: new Date().toISOString(),
      }

      setStockMovements((current) => [movement, ...current])

      pushToast({
        title: 'Stock adjusted',
        message: `${product.name} now has ${nextStock} ${product.unit} on hand.`,
        variant: 'success',
      })
    },
    [products, pushToast],
  )

  const updateSettings = useCallback((patch: Partial<StoreSettings>) => {
    setSettings((current) => ({ ...current, ...patch }))
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      products,
      categories,
      customers,
      suppliers,
      orders,
      stockMovements,
      settings,
      toasts,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      updateOrderStatus,
      createOrder,
      adjustStock,
      updateSettings,
      pushToast,
      dismissToast,
    }),
    [
      products,
      categories,
      customers,
      suppliers,
      orders,
      stockMovements,
      settings,
      toasts,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      updateOrderStatus,
      createOrder,
      adjustStock,
      updateSettings,
      pushToast,
      dismissToast,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
