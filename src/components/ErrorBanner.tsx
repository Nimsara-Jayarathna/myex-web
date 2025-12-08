import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

interface ErrorBannerProps {
  message: string
  detail?: string
  onRetry?: () => void
  className?: string
}

export const ErrorBanner = ({ message, detail, onRetry, className }: ErrorBannerProps) => (
  <div
    className={`flex items-start gap-3 rounded-2xl border border-expense/30 bg-expense/10 px-4 py-3 text-sm text-expense ${className ?? ''}`}
    role="alert"
  >
    <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4" />
    <div className="flex-1">
      <p className="font-semibold">{message}</p>
      {detail ? <p className="text-xs text-expense/80">{detail}</p> : null}
    </div>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-expense/40 bg-white px-3 py-1 text-xs font-semibold text-expense transition hover:border-expense/60"
      >
        Retry
      </button>
    ) : null}
  </div>
)
