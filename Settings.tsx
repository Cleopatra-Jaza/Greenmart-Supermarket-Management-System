import { useEffect, useState } from 'react'
import {
  Banknote,
  Check,
  Monitor,
  Moon,
  Palette,
  RefreshCw,
  RotateCcw,
  Save,
  Store,
  Sun,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { FormField } from '../components/ui/Feedback'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { useTheme } from '../hooks/useTheme'
import { formatLKR } from '../lib/format'
import { getDataSourceLabel } from '../lib/supabase'
import { useStore } from '../store/storeContext'
import type { StoreSettings } from '../types'

const CURRENCIES = [
  { value: 'LKR', label: 'LKR — Sri Lankan Rupee' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — Pound Sterling' },
  { value: 'INR', label: 'INR — Indian Rupee' },
]

export function Settings() {
  const { settings, updateSettings, pushToast } = useStore()
  const { theme, setTheme } = useTheme()

  const [form, setForm] = useState<StoreSettings>(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.density = form.density
    document.documentElement.dataset.animations = String(form.animations)
  }, [form.density, form.animations])

  const update = <K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    updateSettings(form)
    setSaved(true)
    pushToast({
      title: 'Settings saved',
      message: 'Your store configuration has been updated.',
      variant: 'success',
    })
  }

  const handleReset = () => {
    setForm(settings)
    setSaved(true)
    pushToast({
      title: 'Changes reverted',
      message: 'Settings were restored to the last saved values.',
      variant: 'info',
    })
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Store information, currency handling and interface preferences."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<RotateCcw size={16} />}
              onClick={handleReset}
            >
              Revert
            </Button>
            <Button icon={<Save size={16} />} onClick={handleSave}>
              {saved ? 'Saved' : 'Save changes'}
            </Button>
          </>
        }
      />

      <div className="grid grid--2-1">
        <div className="stack">
          <Card>
            <CardHeader
              title="Store information"
              subtitle="Shown on receipts, reports and the POS terminal"
              icon={<Store size={18} />}
            />
            <div className="form-grid">
              <FormField
                label="Store name"
                htmlFor="store-name"
                required
              >
                <input
                  id="store-name"
                  className="input"
                  value={form.storeName}
                  onChange={(event) => update('storeName', event.target.value)}
                />
              </FormField>

              <FormField label="Branch" htmlFor="store-branch" required>
                <input
                  id="store-branch"
                  className="input"
                  value={form.branch}
                  onChange={(event) => update('branch', event.target.value)}
                />
              </FormField>

              <FormField label="Address" htmlFor="store-address" required>
                <input
                  id="store-address"
                  className="input"
                  value={form.address}
                  onChange={(event) => update('address', event.target.value)}
                />
              </FormField>

              <FormField label="Phone" htmlFor="store-phone" required>
                <input
                  id="store-phone"
                  className="input"
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                />
              </FormField>

              <FormField label="Email" htmlFor="store-email" required>
                <input
                  id="store-email"
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                />
              </FormField>

              <FormField
                label="Low stock threshold"
                htmlFor="store-threshold"
                hint="Used for dashboard alerts when a product has no reorder level."
              >
                <input
                  id="store-threshold"
                  className="input"
                  type="number"
                  min={0}
                  value={form.lowStockThreshold}
                  onChange={(event) =>
                    update('lowStockThreshold', Number(event.target.value))
                  }
                />
              </FormField>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Interface preferences"
              subtitle="Tune the look and feel of the dashboard"
              icon={<Palette size={18} />}
            />
            <div className="settings-grid">
              <div className="settings-group">
                <span className="settings-group__label">Appearance</span>
                <div className="segmented">
                  <button
                    type="button"
                    className={`segmented__item${theme === 'light' ? ' is-active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun size={15} />
                    Light
                  </button>
                  <button
                    type="button"
                    className={`segmented__item${theme === 'dark' ? ' is-active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon size={15} />
                    Dark
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <span className="settings-group__label">Density</span>
                <div className="segmented">
                  <button
                    type="button"
                    className={`segmented__item${form.density === 'comfortable' ? ' is-active' : ''}`}
                    onClick={() => update('density', 'comfortable')}
                  >
                    <Monitor size={15} />
                    Comfortable
                  </button>
                  <button
                    type="button"
                    className={`segmented__item${form.density === 'compact' ? ' is-active' : ''}`}
                    onClick={() => update('density', 'compact')}
                  >
                    <RefreshCw size={15} />
                    Compact
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <span className="settings-group__label">Animations</span>
                <button
                  type="button"
                  className={`toggle${form.animations ? ' is-on' : ''}`}
                  onClick={() => update('animations', !form.animations)}
                  role="switch"
                  aria-checked={form.animations}
                >
                  <span className="toggle__track">
                    <span className="toggle__thumb" />
                  </span>
                  <span className="toggle__label">
                    {form.animations
                      ? 'Motion effects enabled'
                      : 'Motion effects disabled'}
                  </span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="stack">
          <Card>
            <CardHeader
              title="Currency & tax"
              subtitle="How monetary values are presented"
              icon={<Banknote size={18} />}
            />
            <div className="stack stack--sm">
              <FormField label="Display currency" htmlFor="settings-currency">
                <select
                  id="settings-currency"
                  className="input"
                  value={form.currency}
                  onChange={(event) => update('currency', event.target.value)}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Currency symbol"
                htmlFor="settings-symbol"
                hint="Shown next to amounts in labels and receipts."
              >
                <input
                  id="settings-symbol"
                  className="input"
                  value={form.currencySymbol}
                  onChange={(event) =>
                    update('currencySymbol', event.target.value)
                  }
                />
              </FormField>

              <FormField
                label="Tax rate (%)"
                htmlFor="settings-tax"
                hint="Applied at checkout on the POS screen."
              >
                <input
                  id="settings-tax"
                  className="input"
                  type="number"
                  min={0}
                  max={100}
                  step="0.5"
                  value={Math.round(form.taxRate * 1000) / 10}
                  onChange={(event) =>
                    update(
                      'taxRate',
                      Math.min(1, Math.max(0, Number(event.target.value) / 100)),
                    )
                  }
                />
              </FormField>

              <div className="currency-preview">
                <span className="currency-preview__label">Preview</span>
                <span className="currency-preview__value">
                  {formatLKR(1250.5)}
                </span>
                <span className="currency-preview__value currency-preview__value--muted">
                  {form.currency} {form.currencySymbol} — e.g. {form.currency}{' '}
                  1,250.50
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Data source"
              subtitle="Where the dashboard reads its numbers from"
              icon={<Check size={18} />}
            />
            <div className="stack stack--sm">
              <Badge tone="warning" dot>
                {getDataSourceLabel()}
              </Badge>
              <p className="settings-note">
                All figures come from the bundled demo dataset in{' '}
                <code>src/data</code>. No API keys or credentials are embedded in
                this frontend.
              </p>
              <Select
                value={settings.lowStockThreshold.toString()}
                onChange={(value) =>
                  update('lowStockThreshold', Number(value))
                }
                label="Default reorder level"
                options={[
                  { value: '10', label: '10 units' },
                  { value: '20', label: '20 units' },
                  { value: '25', label: '25 units' },
                  { value: '50', label: '50 units' },
                ]}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
