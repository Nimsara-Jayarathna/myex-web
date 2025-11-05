import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

interface NavbarProps {
  onOpenSettings?: () => void
  onOpenReports?: () => void
  onLogout?: () => void
  userName?: string
}

export const Navbar = ({ onOpenSettings, onOpenReports, onLogout, userName }: NavbarProps) => (
  <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2 shadow-sm">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-base font-semibold text-accent">
            M
          </span>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-neutral tracking-tight">MyEx</span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted">Finance OS</span>
          </div>
        </div>
        {userName ? (
          <span className="hidden rounded-full border border-border bg-white px-3 py-1 text-xs text-muted sm:inline-flex">
            Hello {userName}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted transition hover:border-accent/40 hover:text-accent"
          onClick={onOpenReports}
        >
          <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-accent" />
          Reports
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted transition hover:border-accent/40 hover:text-accent"
          onClick={onOpenSettings}
        >
          <FontAwesomeIcon icon={faGear} className="h-4 w-4 text-accent" />
          Settings
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-expense/40 bg-expense/10 px-4 py-2 text-sm font-medium text-expense transition hover:border-expense/60 hover:bg-expense/15"
          onClick={onLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  </header>
)
