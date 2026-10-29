import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingState } from './components/ui/States'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { StoreProvider } from './store/StoreProvider'

const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })),
)
const Products = lazy(() =>
  import('./pages/Products').then((module) => ({ default: module.Products })),
)
const Inventory = lazy(() =>
  import('./pages/Inventory').then((module) => ({ default: module.Inventory })),
)
const Categories = lazy(() =>
  import('./pages/Categories').then((module) => ({ default: module.Categories })),
)
const Sales = lazy(() =>
  import('./pages/Sales').then((module) => ({ default: module.Sales })),
)
const Orders = lazy(() =>
  import('./pages/Orders').then((module) => ({ default: module.Orders })),
)
const Customers = lazy(() =>
  import('./pages/Customers').then((module) => ({ default: module.Customers })),
)
const Suppliers = lazy(() =>
  import('./pages/Suppliers').then((module) => ({ default: module.Suppliers })),
)
const Reports = lazy(() =>
  import('./pages/Reports').then((module) => ({ default: module.Reports })),
)
const Settings = lazy(() =>
  import('./pages/Settings').then((module) => ({ default: module.Settings })),
)
const Login = lazy(() =>
  import('./pages/Login').then((module) => ({ default: module.Login })),
)
const NotFound = lazy(() =>
  import('./pages/NotFound').then((module) => ({ default: module.NotFound })),
)

function App() {
  return (
    <StoreProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="route-loading">
                <LoadingState label="Loading Greenmart…" />
              </div>
            }
          >
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>

              <Route element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="categories" element={<Categories />} />
                <Route path="sales" element={<Sales />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </StoreProvider>
  )
}

export default App
