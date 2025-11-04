import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface FloatingActionButtonProps {
  onClick: () => void
  label?: string
}

export const FloatingActionButton = ({ onClick, label = 'Add transaction' }: FloatingActionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-500 text-white shadow-[0_22px_35px_-12px_rgba(56,189,248,0.55)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-sky-200/70"
      aria-label={label}
    >
      <FontAwesomeIcon icon={faPlus} className="h-5 w-5 transition group-hover:rotate-90" />
    </button>
  )
}
