import { TAX_RATE } from '../lib/constants'
import { products } from './products'
import type { Order, OrderItem, OrderStatus, PaymentMethod } from '../types'

function daysAgo(days: number, hour = 10, minute = 30): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

interface RawOrder {
  id: string
  customerId: string
  customer: string
  days: number
  hour: number
  minute?: number
  items: Array<[string, number]>
  discount: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  channel: Order['channel']
}

const rawOrders: RawOrder[] = [
  {
    id: 'ORD-1042',
    customerId: 'cus-01',
    customer: 'Amara Jayawardena',
    days: 0,
    hour: 9,
    minute: 15,
    items: [
      ['prd-01', 4],
      ['prd-05', 2],
      ['prd-13', 1],
    ],
    discount: 150,
    status: 'completed',
    paymentMethod: 'Card',
    channel: 'In-store',
  },
  {
    id: 'ORD-1041',
    customerId: 'cus-02',
    customer: 'Nimal Rodrigo',
    days: 0,
    hour: 8,
    minute: 40,
    items: [
      ['prd-16', 3],
      ['prd-02', 5],
    ],
    discount: 0,
    status: 'processing',
    paymentMethod: 'Mobile Wallet',
    channel: 'Online',
  },
  {
    id: 'ORD-1040',
    customerId: 'cus-03',
    customer: 'Sajini Wickramasinghe',
    days: 0,
    hour: 8,
    minute: 5,
    items: [
      ['prd-09', 2],
      ['prd-06', 1],
      ['prd-12', 6],
    ],
    discount: 220,
    status: 'completed',
    paymentMethod: 'Cash',
    channel: 'In-store',
  },
  {
    id: 'ORD-1039',
    customerId: 'cus-04',
    customer: 'Roshan Alwis',
    days: 1,
    hour: 17,
    minute: 50,
    items: [
      ['prd-24', 3],
      ['prd-23', 4],
    ],
    discount: 100,
    status: 'completed',
    paymentMethod: 'Card',
    channel: 'Online',
  },
  {
    id: 'ORD-1038',
    customerId: 'cus-05',
    customer: 'Fathima Rizvi',
    days: 1,
    hour: 13,
    minute: 20,
    items: [
      ['prd-20', 1],
      ['prd-21', 4],
      ['prd-07', 2],
    ],
    discount: 0,
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    channel: 'Phone',
  },
  {
    id: 'ORD-1037',
    customerId: 'cus-09',
    customer: 'Chamodi Herath',
    days: 2,
    hour: 11,
    minute: 10,
    items: [
      ['prd-18', 2],
      ['prd-17', 1],
      ['prd-26', 1],
    ],
    discount: 380,
    status: 'completed',
    paymentMethod: 'Card',
    channel: 'In-store',
  },
  {
    id: 'ORD-1036',
    customerId: 'cus-06',
    customer: 'Kasun Bandara',
    days: 2,
    hour: 19,
    minute: 5,
    items: [
      ['prd-22', 1],
      ['prd-10', 4],
    ],
    discount: 0,
    status: 'cancelled',
    paymentMethod: 'Cash',
    channel: 'Online',
  },
  {
    id: 'ORD-1035',
    customerId: 'cus-07',
    customer: 'Ishara Senanayake',
    days: 3,
    hour: 10,
    minute: 45,
    items: [
      ['prd-14', 3],
      ['prd-11', 1],
    ],
    discount: 120,
    status: 'completed',
    paymentMethod: 'Mobile Wallet',
    channel: 'In-store',
  },
  {
    id: 'ORD-1034',
    customerId: 'cus-01',
    customer: 'Amara Jayawardena',
    days: 3,
    hour: 16,
    minute: 30,
    items: [
      ['prd-19', 2],
      ['prd-21', 6],
      ['prd-12', 4],
    ],
    discount: 450,
    status: 'completed',
    paymentMethod: 'Card',
    channel: 'Online',
  },
  {
    id: 'ORD-1033',
    customerId: 'cus-08',
    customer: 'Dilan Perera',
    days: 4,
    hour: 14,
    minute: 25,
    items: [
      ['prd-27', 1],
      ['prd-28', 1],
    ],
    discount: 0,
    status: 'refunded',
    paymentMethod: 'Card',
    channel: 'Online',
  },
  {
    id: 'ORD-1032',
    customerId: 'cus-03',
    customer: 'Sajini Wickramasinghe',
    days: 5,
    hour: 12,
    minute: 0,
    items: [
      ['prd-16', 2],
      ['prd-02', 3],
      ['prd-03', 2],
    ],
    discount: 0,
    status: 'completed',
    paymentMethod: 'Cash',
    channel: 'In-store',
  },
  {
    id: 'ORD-1031',
    customerId: 'cus-10',
    customer: 'Tharindu Silva',
    days: 6,
    hour: 15,
    minute: 35,
    items: [
      ['prd-15', 1],
      ['prd-23', 2],
    ],
    discount: 0,
    status: 'completed',
    paymentMethod: 'Mobile Wallet',
    channel: 'In-store',
  },
  {
    id: 'ORD-1030',
    customerId: 'cus-09',
    customer: 'Chamodi Herath',
    days: 7,
    hour: 18,
    minute: 10,
    items: [
      ['prd-25', 2],
      ['prd-24', 4],
      ['prd-13', 2],
    ],
    discount: 260,
    status: 'completed',
    paymentMethod: 'Card',
    channel: 'Online',
  },
  {
    id: 'ORD-1029',
    customerId: 'cus-02',
    customer: 'Nimal Rodrigo',
    days: 8,
    hour: 9,
    minute: 50,
    items: [
      ['prd-19', 1],
      ['prd-22', 2],
    ],
    discount: 0,
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    channel: 'Phone',
  },
  {
    id: 'ORD-1028',
    customerId: 'cus-04',
    customer: 'Roshan Alwis',
    days: 9,
    hour: 20,
    minute: 15,
    items: [
      ['prd-05', 3],
      ['prd-06', 2],
    ],
    discount: 180,
    status: 'completed',
    paymentMethod: 'Cash',
    channel: 'In-store',
  },
  {
    id: 'ORD-1027',
    customerId: 'cus-05',
    customer: 'Fathima Rizvi',
    days: 11,
    hour: 13,
    minute: 55,
    items: [
      ['prd-17', 2],
      ['prd-18', 1],
    ],
    discount: 0,
    status: 'completed',
    paymentMethod: 'Card',
    channel: 'In-store',
  },
  {
    id: 'ORD-1026',
    customerId: 'cus-01',
    customer: 'Amara Jayawardena',
    days: 13,
    hour: 17,
    minute: 25,
    items: [
      ['prd-20', 2],
      ['prd-11', 3],
    ],
    discount: 300,
    status: 'completed',
    paymentMethod: 'Card',
    channel: 'Online',
  },
  {
    id: 'ORD-1025',
    customerId: 'cus-03',
    customer: 'Sajini Wickramasinghe',
    days: 15,
    hour: 11,
    minute: 40,
    items: [
      ['prd-04', 2],
      ['prd-03', 2],
      ['prd-12', 3],
    ],
    discount: 0,
    status: 'completed',
    paymentMethod: 'Cash',
    channel: 'In-store',
  },
]

function buildItems(raw: RawOrder): OrderItem[] {
  return raw.items.map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId)
    return {
      productId,
      name: product?.name ?? 'Unknown product',
      quantity,
      price: product?.price ?? 0,
    }
  })
}

export const orders: Order[] = rawOrders.map((raw) => {
  const items = buildItems(raw)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round((subtotal - raw.discount) * TAX_RATE * 100) / 100
  return {
    id: raw.id,
    customerId: raw.customerId,
    customer: raw.customer,
    date: daysAgo(raw.days, raw.hour, raw.minute ?? 30),
    items,
    subtotal,
    discount: raw.discount,
    tax,
    total: Math.round((subtotal - raw.discount + tax) * 100) / 100,
    status: raw.status,
    paymentMethod: raw.paymentMethod,
    channel: raw.channel,
  }
})
