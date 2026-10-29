import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Package,
  ReceiptText,
  Search,
  Sun,
  TriangleAlert,
  User,
  Users,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/cn'
import { getNavItem } from '../../lib/navigation'
import { useStore } from '../../store/storeContext'

const CURRENT_USER = {
  name: 'Nuwan Alwis',
  role: 'Store Manager',
  email: 'manager@greenmart.lk',
  initials: 'NA',
}

export function Header({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { products, customers, orders, settings } = useStore()
  const { theme, toggleTheme } = useTheme()

  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const navItem = getNavItem(location.pathname)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false)
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const lowStock = useMemo(
    () =>
      products.filter(
        (product) => product.stock <= product.reorderLevel,
      ),
    [products],
  )

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'pending'),
    [orders],
  )

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []

    const productHits = products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term),
      )
      .slice(0, 4)
      .map((product) => ({
        id: product.id,
        label: product.name,
        meta: product.sku,
        icon: Package,
        to: '/products',
      }))

    const customerHits = customers
      .filter((customer) =>
        customer.name.toLowerCase().includes(term),
      )
      .slice(0, 3)
      .map((customer) => ({
        id: customer.id,
        label: customer.name,
        meta: customer.email,
        icon: Users,
        to: '/customers',
      }))

    const orderHits = orders
      .filter((order) => order.id.toLowerCase().includes(term))
      .slice(0, 3)
      .map((order) => ({
        id: order.id,
        label: order.id,
        meta: order.customer,
        icon: ReceiptText,
        to: '/orders',
      }))

    return [...productHits, ...customerHits, ...orderHits]
  }, [query, products, customers, orders])

  const handleResult = (to: string) => {
    setSearchOpen(false)
    setQuery('')
    navigate(to)
  }

  const handleLogout = () => {
    setProfileOpen(false)
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="topbar__icon-btn topbar__menu"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="topbar__heading">
          <span className="topbar__breadcrumb">Greenmart / {navItem.label}</span>
          <h1 className="topbar__title">{navItem.label}</h1>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__search" ref={searchRef}>
          <Search className="topbar__search-icon" size={16} />
          <input
            type="search"
            value={query}
            placeholder="Search products, customers, orders…"
            aria-label="Global search"
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value)
              setSearchOpen(true)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results.length > 0) {
                handleResult(results[0].to)
              }
              if (event.key === 'Escape') {
                setSearchOpen(false)
              }
            }}
          />
          {searchOpen && query.trim() ? (
            <div className="topbar__search-results">
              {results.length === 0 ? (
                <p className="topbar__search-empty">
                  No matches for “{query.trim()}”
                </p>
              ) : (
                results.map((result) => {
                  const Icon = result.icon
                  return (
                    <button
                      key={`${result.to}-${result.id}`}
                      type="button"
                      className="topbar__search-result"
                      onClick={() => handleResult(result.to)}
                    >
                      <span className="topbar__search-result-icon">
                        <Icon size={15} />
                      </span>
                      <span>
                        <span className="topbar__search-result-label">
                          {result.label}
                        </span>
                        <span className="topbar__search-result-meta">
                          {result.meta}
                        </span>
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="topbar__icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        <div className="topbar__dropdown" ref={notificationsRef}>
          <button
            type="button"
            className="topbar__icon-btn"
            onClick={() => {
              setNotificationsOpen((open) => !open)
              setProfileOpen(false)
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {lowStock.length + pendingOrders.length > 0 ? (
              <span className="topbar__badge">
                {lowStock.length + pendingOrders.length}
              </span>
            ) : null}
          </button>
          {notificationsOpen ? (
            <div className="dropdown dropdown--notifications">
              <div className="dropdown__header">
                <span>Notifications</span>
                <span className="dropdown__count">
                  {lowStock.length + pendingOrders.length}
                </span>
              </div>
              <div className="dropdown__body">
                {lowStock.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="dropdown__item"
                    onClick={() => {
                      setNotificationsOpen(false)
                      navigate('/inventory')
                    }}
                  >
                    <span className="dropdown__item-icon dropdown__item-icon--warning">
                      <TriangleAlert size={15} />
                    </span>
                    <span>
                      <span className="dropdown__item-title">
                        {product.name} is low on stock
                      </span>
                      <span className="dropdown__item-meta">
                        {product.stock} {product.unit} remaining
                      </span>
                    </span>
                  </button>
                ))}
                {pendingOrders.slice(0, 3).map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    className="dropdown__item"
                    onClick={() => {
                      setNotificationsOpen(false)
                      navigate('/orders')
                    }}
                  >
                    <span className="dropdown__item-icon">
                      <ReceiptText size={15} />
                    </span>
                    <span>
                      <span className="dropdown__item-title">
                        Order {order.id} awaits processing
                      </span>
                      <span className="dropdown__item-meta">
                        {order.customer}
                      </span>
                    </span>
                  </button>
                ))}
                {lowStock.length + pendingOrders.length === 0 ? (
                  <p className="dropdown__empty">You're all caught up.</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="topbar__dropdown" ref={profileRef}>
          <button
            type="button"
            className="topbar__profile"
            onClick={() => {
              setProfileOpen((open) => !open)
              setNotificationsOpen(false)
            }}
          >
            <span className="topbar__avatar">{CURRENT_USER.initials}</span>
            <span className="topbar__profile-text">
              <span className="topbar__profile-name">{CURRENT_USER.name}</span>
              <span className="topbar__profile-role">{CURRENT_USER.role}</span>
            </span>
            <ChevronDown size={15} className={cn('topbar__caret', profileOpen && 'is-open')} />
          </button>
          {profileOpen ? (
            <div className="dropdown dropdown--profile">
              <div className="dropdown__header dropdown__header--profile">
                <span className="topbar__avatar topbar__avatar--lg">
                  {CURRENT_USER.initials}
                </span>
                <span>
                  <span className="dropdown__item-title">{CURRENT_USER.name}</span>
                  <span className="dropdown__item-meta">{CURRENT_USER.email}</span>
                </span>
              </div>
              <div className="dropdown__body">
                <button
                  type="button"
                  className="dropdown__item"
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/settings')
                  }}
                >
                  <span className="dropdown__item-icon">
                    <User size={15} />
                  </span>
                  <span>
                    <span className="dropdown__item-title">Account settings</span>
                    <span className="dropdown__item-meta">{settings.branch}</span>
                  </span>
                </button>
                <button
                  type="button"
                  className="dropdown__item dropdown__item--danger"
                  onClick={handleLogout}
                >
                  <span className="dropdown__item-icon dropdown__item-icon--danger">
                    <LogOut size={15} />
                  </span>
                  <span>
                    <span className="dropdown__item-title">Sign out</span>
                    <span className="dropdown__item-meta">
                      End the current session
                    </span>
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
