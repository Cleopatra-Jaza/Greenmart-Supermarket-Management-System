import { Outlet } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="auth">
      <div className="auth__panel auth__panel--brand">
        <div className="auth__brand">
          <span className="auth__logo" aria-hidden="true">
            <Leaf size={26} strokeWidth={2.2} />
          </span>
          <span>
            <span className="auth__brand-name">Greenmart</span>
            <span className="auth__brand-sub">Supermarket Management System</span>
          </span>
        </div>
        <div className="auth__hero">
          <h2 className="auth__hero-title">
            Run your store with clarity.
          </h2>
          <p className="auth__hero-text">
            Greenmart unifies stock, sales, customers and suppliers into one
            emerald workspace so your team can move fast without losing track of
            the shelves.
          </p>
          <ul className="auth__points">
            <li>Live stock levels with low-stock alerts</li>
            <li>Point of sale with instant invoice totals</li>
            <li>Customer, supplier and sales reporting</li>
          </ul>
        </div>
        <p className="auth__footnote">
          Demo environment — data is stored locally in your browser.
        </p>
      </div>
      <div className="auth__panel auth__panel--form">
        <Outlet />
      </div>
    </div>
  )
}
