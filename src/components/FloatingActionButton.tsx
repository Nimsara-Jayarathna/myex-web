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
      className="group fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-soft transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={label}
    >
      <FontAwesomeIcon icon={faPlus} className="h-5 w-5 transition group-hover:rotate-90" />
    </button>
  )
}
