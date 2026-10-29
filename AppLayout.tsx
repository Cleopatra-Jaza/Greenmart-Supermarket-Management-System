import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { ToastViewport } from '../components/ui/ToastViewport'
import { cn } from '../lib/cn'

const COLLAPSE_KEY = 'greenmart.sidebar.collapsed'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'true'
  } catch {
    return false
  }
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed))
    } catch {
      /* ignore persistence failures */
    }
  }, [collapsed])

  return (
    <div className={cn('app-shell', collapsed && 'app-shell--collapsed')}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="app-shell__main">
        <Header onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
      <ToastViewport />
    </div>
  )
}
