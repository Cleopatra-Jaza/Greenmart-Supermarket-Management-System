import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LayoutGrid,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  description: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
    description: 'Store performance at a glance',
  },
  {
    to: '/products',
    label: 'Products',
    icon: Package,
    description: 'Catalogue and pricing',
  },
  {
    to: '/inventory',
    label: 'Inventory',
    icon: Boxes,
    description: 'Stock levels and movements',
  },
  {
    to: '/categories',
    label: 'Categories',
    icon: LayoutGrid,
    description: 'Product grouping',
  },
  {
    to: '/sales',
    label: 'Sales / POS',
    icon: ShoppingCart,
    description: 'Ring up a new sale',
  },
  {
    to: '/orders',
    label: 'Orders',
    icon: ReceiptText,
    description: 'Order history and status',
  },
  {
    to: '/customers',
    label: 'Customers',
    icon: Users,
    description: 'Loyalty and contacts',
  },
  {
    to: '/suppliers',
    label: 'Suppliers',
    icon: Truck,
    description: 'Vendor management',
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: BarChart3,
    description: 'Sales and stock analytics',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
    description: 'Store configuration',
  },
]

export function getNavItem(pathname: string): NavItem {
  return (
    NAV_ITEMS.find((item) =>
      item.end ? pathname === item.to : pathname.startsWith(item.to),
    ) ?? NAV_ITEMS[0]
  )
}
