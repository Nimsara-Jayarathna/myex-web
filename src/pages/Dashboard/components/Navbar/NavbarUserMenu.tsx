interface NavbarUserMenuProps {
  userName?: string
  itemClass: string
}

export const NavbarUserMenu = ({ userName, itemClass }: NavbarUserMenuProps) => {
  if (!userName) return null

  return (
    <div
      className={`${itemClass} cursor-default hover:border-[var(--border-soft)] hover:text-[var(--page-fg)]`}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Hello</span>
      <span className="font-semibold text-[var(--page-fg)]">{userName}</span>
    </div>
  )
}

