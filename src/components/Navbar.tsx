import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

interface NavbarProps {
  onOpenSettings?: () => void
  onOpenReports?: () => void
  onLogout?: () => void
  userName?: string
}

export const Navbar = ({ onOpenSettings, onOpenReports, onLogout, userName }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-500/40 text-base font-semibold text-white shadow-[0_12px_24px_-18px_rgba(56,189,248,0.8)]">
              M
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-white tracking-tight">MyEx</span>
              <span className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Finance OS</span>
            </div>
          </div>
          {userName ? (
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 sm:inline-flex">
              Hey {userName} 👋
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/60 hover:bg-sky-500/10"
            onClick={onOpenReports}
          >
            <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-sky-300" />
            Reports
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/60 hover:bg-sky-500/10"
            onClick={onOpenSettings}
          >
            <FontAwesomeIcon icon={faGear} className="h-4 w-4 text-sky-300" />
            Settings
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:border-rose-300 hover:bg-rose-500/20"
            onClick={onLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
