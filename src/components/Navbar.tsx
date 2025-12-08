import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

interface NavbarProps {
  onOpenSettings?: () => void
  onOpenReports?: () => void
  onLogout?: () => void
  userName?: string
}

export const Navbar = ({ onOpenSettings, onOpenReports, onLogout, userName }: NavbarProps) => {
  const itemClass =
    'inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-4 py-2 text-sm font-medium text-neutral transition hover:border-accent/40 hover:text-accent';
  const iconClass = 'h-4 w-4 text-accent';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {userName ? (
            <div className={`${itemClass} cursor-default hover:border-border hover:text-neutral`}>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Hello</span>
              <span className="font-semibold text-neutral">{userName}</span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button type="button" className={itemClass} onClick={onOpenReports}>
            <FontAwesomeIcon icon={faChartLine} className={iconClass} />
            Reports
          </button>
          <button type="button" className={itemClass} onClick={onOpenSettings}>
            <FontAwesomeIcon icon={faGear} className={iconClass} />
            Settings
          </button>
          <button type="button" className={itemClass} onClick={onLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} className={iconClass} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
