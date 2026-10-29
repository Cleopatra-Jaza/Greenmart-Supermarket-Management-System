import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useStore } from '../../store/storeContext'

export function ToastViewport() {
  const { toasts, dismissToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="toast-viewport" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon =
          toast.variant === 'success'
            ? CheckCircle2
            : toast.variant === 'error'
              ? XCircle
              : Info

        return (
          <div key={toast.id} className={`toast toast--${toast.variant}`}>
            <Icon size={18} className="toast__icon" />
            <div className="toast__content">
              <p className="toast__title">{toast.title}</p>
              <p className="toast__message">{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast__close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
