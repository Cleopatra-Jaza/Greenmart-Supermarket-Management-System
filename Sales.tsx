import { useMemo, useState } from 'react'
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Minus,
  Package,
  Plus,
  Printer,
  ReceiptText,
  Search,
  ShoppingCart,
  Smartphone,
  Trash2,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/States'
import { FormField } from '../components/ui/Feedback'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchInput } from '../components/ui/SearchInput'
import { Select } from '../components/ui/Select'
import { formatLKR, formatNumber } from '../lib/format'
import { getStockStatus } from '../lib/inventory'
import { useStore } from '../store/storeContext'
import type { CartLine } from '../store/storeContext'
import type { Order, PaymentMethod } from '../types'

const PAYMENT_METHODS: Array<{
  value: PaymentMethod
  label: string
  icon: typeof Banknote
}> = [
  { value: 'Cash', label: 'Cash', icon: Banknote },
  { value: 'Card', label: 'Card', icon: CreditCard },
  { value: 'Mobile Wallet', label: 'Mobile Wallet', icon: Smartphone },
]

export function Sales() {
  const { products, customers, settings, createOrder, pushToast } = useStore()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [lines, setLines] = useState<CartLine[]>([])
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash')
  const [receipt, setReceipt] = useState<Order | null>(null)

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products
      .filter((product) => {
        const matchesTerm =
          !term ||
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term)
        const matchesCategory =
          categoryFilter === 'all' || product.categoryId === categoryFilter
        return matchesTerm && matchesCategory
      })
      .slice(0, 24)
  }, [products, search, categoryFilter])

  const cartDetailed = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((item) => item.id === line.productId)
          if (!product) return null
          return {
            ...line,
            name: product.name,
            unit: product.unit,
            price: product.price,
            stock: product.stock,
            lineTotal: product.price * line.quantity,
          }
        })
        .filter((line): line is NonNullable<typeof line> => line !== null),
    [lines, products],
  )

  const subtotal = cartDetailed.reduce((sum, line) => sum + line.lineTotal, 0)
  const discount = Math.round(subtotal * (discountPercent / 100) * 100) / 100
  const tax = Math.round((subtotal - discount) * settings.taxRate * 100) / 100
  const total = Math.round((subtotal - discount + tax) * 100) / 100
  const itemCount = cartDetailed.reduce((sum, line) => sum + line.quantity, 0)

  const addToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId)
    if (!product) return
    if (product.stock <= 0) {
      pushToast({
        title: 'Out of stock',
        message: `${product.name} is not available on the shelf.`,
        variant: 'error',
      })
      return
    }

    setLines((current) => {
      const existing = current.find((line) => line.productId === productId)
      if (existing) {
        if (existing.quantity >= product.stock) {
          pushToast({
            title: 'Stock limit reached',
            message: `Only ${product.stock} ${product.unit} of ${product.name} available.`,
            variant: 'error',
          })
          return current
        }
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        )
      }
      return [...current, { productId, quantity: 1 }]
    })
  }

  const changeQuantity = (productId: string, delta: number) => {
    setLines((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  const removeLine = (productId: string) => {
    setLines((current) =>
      current.filter((line) => line.productId !== productId),
    )
  }

  const clearCart = () => {
    setLines([])
    setDiscountPercent(0)
  }

  const handleCheckout = () => {
    const order = createOrder(lines, customerId, paymentMethod, discount)
    if (!order) return
    setReceipt(order)
    clearCart()
  }

  const handlePrintReceipt = () => {
    if (!receipt) return
    const body = [
      `${settings.storeName} — ${settings.branch}`,
      `Order ${receipt.id}`,
      `Customer: ${receipt.customer}`,
      `Payment: ${receipt.paymentMethod}`,
      '',
      ...receipt.items.map(
        (item) =>
          `${item.quantity} x ${item.name} @ ${formatLKR(item.price)} = ${formatLKR(item.price * item.quantity)}`,
      ),
      '',
      `Subtotal: ${formatLKR(receipt.subtotal)}`,
      `Discount: ${formatLKR(receipt.discount)}`,
      `Tax: ${formatLKR(receipt.tax)}`,
      `TOTAL: ${formatLKR(receipt.total)}`,
    ].join('\n')

    const blob = new Blob([body], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${receipt.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.name} (${customer.tier})`,
  }))

  return (
    <div className="page page--pos">
      <PageHeader
        eyebrow="Point of sale"
        title="Sales / POS"
        description="Search the catalogue, build the basket and complete a checkout."
        actions={
          <Button
            variant="secondary"
            icon={<Trash2 size={16} />}
            onClick={clearCart}
            disabled={lines.length === 0}
          >
            Clear basket
          </Button>
        }
      />

      <div className="pos">
        <section className="pos__catalog">
          <Card>
            <div className="toolbar">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search products to add…"
                label="Search products"
              />
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                label="Category"
                options={[
                  { value: 'all', label: 'All categories' },
                  ...Array.from(
                    new Set(products.map((product) => product.category)),
                  ).map((category) => ({ value: category, label: category })),
                ]}
              />
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try a different keyword or clear the category filter."
                icon={<Search size={26} />}
              />
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product)
                  const inCart =
                    lines.find((line) => line.productId === product.id)?.quantity ??
                    0
                  return (
                    <button
                      key={product.id}
                      type="button"
                      className="product-tile"
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock <= 0}
                    >
                      <span className="product-tile__top">
                        <span className="product-tile__icon">
                          <Package size={18} />
                        </span>
                        {inCart > 0 ? (
                          <span className="product-tile__count">{inCart}</span>
                        ) : null}
                      </span>
                      <span className="product-tile__name">{product.name}</span>
                      <span className="product-tile__meta">
                        {product.category}
                      </span>
                      <span className="product-tile__footer">
                        <span className="product-tile__price">
                          {formatLKR(product.price)}
                        </span>
                        <Badge
                          tone={
                            status === 'in-stock'
                              ? 'success'
                              : status === 'low-stock'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {product.stock} {product.unit}
                        </Badge>
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </Card>
        </section>

        <aside className="pos__cart">
          <Card className="cart-card">
            <header className="cart-card__header">
              <span className="cart-card__title">
                <ShoppingCart size={18} />
                Current basket
              </span>
              <span className="cart-card__count">
                {formatNumber(itemCount)} item(s)
              </span>
            </header>

            {cartDetailed.length === 0 ? (
              <EmptyState
                title="Basket is empty"
                description="Tap a product tile to start a new sale."
                icon={<ShoppingCart size={26} />}
              />
            ) : (
              <ul className="cart-lines">
                {cartDetailed.map((line) => (
                  <li key={line.productId} className="cart-line">
                    <div className="cart-line__info">
                      <span className="cart-line__name">{line.name}</span>
                      <span className="cart-line__price">
                        {formatLKR(line.price)} / {line.unit}
                      </span>
                    </div>
                    <div className="cart-line__controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => changeQuantity(line.productId, -1)}
                        aria-label={`Decrease ${line.name} quantity`}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="qty-value">{line.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => changeQuantity(line.productId, 1)}
                        disabled={line.quantity >= line.stock}
                        aria-label={`Increase ${line.name} quantity`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="cart-line__total">
                      {formatLKR(line.lineTotal)}
                    </span>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger cart-line__remove"
                      onClick={() => removeLine(line.productId)}
                      aria-label={`Remove ${line.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-totals">
              <FormField label="Customer" htmlFor="pos-customer">
                <select
                  id="pos-customer"
                  className="input"
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                >
                  {customerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="cart-totals__row">
                <span>Subtotal</span>
                <span>{formatLKR(subtotal)}</span>
              </div>

              <FormField label="Discount (%)" htmlFor="pos-discount">
                <input
                  id="pos-discount"
                  className="input"
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(event) =>
                    setDiscountPercent(
                      Math.min(100, Math.max(0, Number(event.target.value))),
                    )
                  }
                />
              </FormField>

              <div className="cart-totals__row">
                <span>Discount</span>
                <span className="cell-negative">− {formatLKR(discount)}</span>
              </div>
              <div className="cart-totals__row">
                <span>Tax ({(settings.taxRate * 100).toFixed(0)}%)</span>
                <span>{formatLKR(tax)}</span>
              </div>
              <div className="cart-totals__row cart-totals__row--grand">
                <span>Total</span>
                <span>{formatLKR(total)}</span>
              </div>

              <FormField label="Payment method" htmlFor="pos-payment">
                <div className="payment-methods">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.value}
                        type="button"
                        className={`payment-method${
                          paymentMethod === method.value ? ' is-active' : ''
                        }`}
                        onClick={() => setPaymentMethod(method.value)}
                      >
                        <Icon size={16} />
                        {method.label}
                      </button>
                    )
                  })}
                </div>
              </FormField>

              <Button
                fullWidth
                size="lg"
                icon={<CheckCircle2 size={18} />}
                onClick={handleCheckout}
                disabled={cartDetailed.length === 0}
              >
                Complete sale · {formatLKR(total)}
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      <Modal
        open={receipt !== null}
        title="Sale completed"
        subtitle={receipt ? `Order ${receipt.id}` : undefined}
        onClose={() => setReceipt(null)}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              icon={<Printer size={16} />}
              onClick={handlePrintReceipt}
            >
              Print receipt
            </Button>
            <Button onClick={() => setReceipt(null)}>Done</Button>
          </>
        }
      >
        {receipt ? (
          <div className="receipt">
            <div className="receipt__head">
              <ReceiptText size={22} />
              <span>
                <strong>{settings.storeName}</strong>
                <span className="receipt__branch">{settings.branch}</span>
              </span>
            </div>
            <ul className="receipt__items">
              {receipt.items.map((item) => (
                <li key={item.productId}>
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>{formatLKR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="receipt__totals">
              <div>
                <span>Subtotal</span>
                <span>{formatLKR(receipt.subtotal)}</span>
              </div>
              <div>
                <span>Discount</span>
                <span>− {formatLKR(receipt.discount)}</span>
              </div>
              <div>
                <span>Tax</span>
                <span>{formatLKR(receipt.tax)}</span>
              </div>
              <div className="receipt__grand">
                <span>Total paid</span>
                <span>{formatLKR(receipt.total)}</span>
              </div>
            </div>
            <p className="receipt__method">
              Paid by {receipt.paymentMethod} · {receipt.customer}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
