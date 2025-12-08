import { NavbarUserMenu } from './NavbarUserMenu'
import { NavbarActions } from './NavbarActions'

export interface NavbarProps {
  onOpenSettings?: () => void
  onOpenReports?: () => void
  onLogout?: () => void
  userName?: string
}

export const Navbar = ({ onOpenSettings, onOpenReports, onLogout, userName }: NavbarProps) => {
  const itemClass =
    'inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-4 py-2 text-sm font-medium text-neutral transition hover:border-accent/40 hover:text-accent'
  const iconClass = 'h-4 w-4 text-accent'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <NavbarUserMenu userName={userName} itemClass={itemClass} />
        </div>
        <NavbarActions
          itemClass={itemClass}
          iconClass={iconClass}
          onOpenReports={onOpenReports}
          onOpenSettings={onOpenSettings}
          onLogout={onLogout}
        />
      </div>
    </header>
  )
}

