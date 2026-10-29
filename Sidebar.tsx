import { NavLink } from 'react-router-dom'
import { Leaf, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { NAV_ITEMS } from '../../lib/navigation'
import { useStore } from '../../store/storeContext'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { settings, products } = useStore()

  const lowStockCount = products.filter(
    (product) =>
      product.stock > 0 && product.stock <= product.reorderLevel,
  ).length

  return (
    <>
      <div
        className={cn('sidebar__scrim', mobileOpen && 'is-open')}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'sidebar',
          collapsed && 'sidebar--collapsed',
          mobileOpen && 'sidebar--mobile-open',
        )}
      >
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            <Leaf size={20} strokeWidth={2.4} />
          </span>
          <span className="sidebar__brand-text">
            <span className="sidebar__brand-name">Greenmart</span>
            <span className="sidebar__brand-sub">Supermarket OS</span>
          </span>
          <button
            type="button"
            className="sidebar__mobile-close"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          <span className="sidebar__section-label">Manage</span>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const badge =
              item.to === '/inventory' && lowStockCount > 0
                ? lowStockCount
                : undefined

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn('sidebar__link', isActive && 'is-active')
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar__link-icon">
                  <Icon size={19} strokeWidth={2} />
                </span>
                <span className="sidebar__link-label">{item.label}</span>
                {badge ? (
                  <span className="sidebar__link-badge">{badge}</span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__store">
            <span className="sidebar__store-icon" aria-hidden="true">
              <Leaf size={16} />
            </span>
            <span className="sidebar__store-text">
              <span className="sidebar__store-name">{settings.storeName}</span>
              <span className="sidebar__store-branch">{settings.branch}</span>
            </span>
          </div>
          <button
            type="button"
            className="sidebar__collapse"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
