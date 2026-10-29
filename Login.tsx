import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Leaf, Lock, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/Feedback'

const DEMO_EMAIL = 'manager@greenmart.lk'
const DEMO_PASSWORD = 'greenmart'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Enter both your email address and password.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      sessionStorage.setItem(
        'greenmart.session',
        JSON.stringify({ email: email.trim(), signedInAt: Date.now() }),
      )
    } catch {
      /* ignore storage failures */
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="login">
      <div className="login__card">
        <span className="login__logo" aria-hidden="true">
          <Leaf size={24} strokeWidth={2.2} />
        </span>
        <h1 className="login__title">Sign in to Greenmart</h1>
        <p className="login__subtitle">
          Manage stock, sales and customers from one workspace.
        </p>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <FormField label="Email address" htmlFor="login-email" error={error}>
            <div className="input-with-icon">
              <Mail size={16} className="input-with-icon__icon" />
              <input
                id="login-email"
                className="input input--with-icon"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                placeholder="manager@greenmart.lk"
                autoComplete="username"
              />
            </div>
          </FormField>

          <FormField label="Password" htmlFor="login-password">
            <div className="input-with-icon">
              <Lock size={16} className="input-with-icon__icon" />
              <input
                id="login-password"
                className="input input--with-icon"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-with-icon__toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <Button type="submit" size="lg" fullWidth trailingIcon={<ArrowRight size={17} />}>
            Sign in
          </Button>
        </form>

        <div className="login__demo">
          <ShieldCheck size={16} />
          <span>
            Demo account — <strong>{DEMO_EMAIL}</strong> /{' '}
            <strong>{DEMO_PASSWORD}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
