import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import type { ThemeMode } from '../hooks/useTheme'

type NavbarVariant = 'landing' | 'dashboard'

interface AppNavbarProps {
  variant: NavbarVariant
  theme: ThemeMode
  onToggleTheme: () => void
  onLogin?: () => void
  onRegister?: () => void
  onOpenSettings?: () => void
  onOpenReports?: () => void
  onLogout?: () => void
  userName?: string
}

export const AppNavbar = ({
  variant,
  theme,
  onToggleTheme,
  onLogin,
  onRegister,
  onOpenSettings,
  onOpenReports,
  onLogout,
  userName,
}: AppNavbarProps) => {
  const isLanding = variant === 'landing'
  const headerClass = isLanding
    ? 'relative z-50'
    : 'sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[var(--surface-2)] backdrop-blur-md'
  const containerClass = `mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 ${
    isLanding ? 'px-8 py-8' : 'px-6 py-4'
  }`
  const itemClass =
    'inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-[var(--page-fg)] transition hover:border-accent/40 hover:text-accent'
  const themeButtonClass =
    'rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--page-fg)] shadow-sm transition hover:border-accent/40 hover:text-accent'
  const landingPrimaryClass =
    'rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-6 py-2 text-sm font-bold text-[var(--page-fg)] backdrop-blur-md transition hover:border-[#3498db] hover:text-[#3498db]'
  const iconClass = 'h-4 w-4 text-accent'

  return (
    <header className={headerClass}>
      <div className={containerClass}>
        <div className="text-2xl font-black tracking-tighter text-[var(--page-fg)]">
          MyEx<span className="text-[#3498db]">.</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isLanding ? (
            <>
              <button type="button" onClick={onToggleTheme} className={themeButtonClass}>
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </button>
              <button type="button" onClick={onLogin} className={landingPrimaryClass}>
                Log in
              </button>
              <button
                type="button"
                onClick={onRegister}
                className="hidden rounded-full bg-[#3498db] px-6 py-2 text-sm font-bold text-white shadow-[0_10px_20px_-5px_rgba(52,152,219,0.4)] transition hover:bg-[#2F89C9] sm:block"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              {userName ? (
                <div
                  className={`${itemClass} cursor-default hover:border-[var(--border-soft)] hover:text-[var(--page-fg)]`}
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Hello</span>
                  <span className="font-semibold text-[var(--page-fg)]">{userName}</span>
                </div>
              ) : null}
              <button type="button" onClick={onToggleTheme} className={themeButtonClass}>
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </button>
              {onOpenReports ? (
                <button type="button" className={itemClass} onClick={onOpenReports}>
                  <FontAwesomeIcon icon={faChartLine} className={iconClass} />
                  Reports
                </button>
              ) : null}
              {onOpenSettings ? (
                <button type="button" className={itemClass} onClick={onOpenSettings}>
                  <FontAwesomeIcon icon={faGear} className={iconClass} />
                  Settings
                </button>
              ) : null}
              {onLogout ? (
                <button type="button" className={itemClass} onClick={onLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} className={iconClass} />
                  Logout
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
