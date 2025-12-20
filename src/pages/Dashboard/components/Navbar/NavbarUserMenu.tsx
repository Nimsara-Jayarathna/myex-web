interface NavbarUserMenuProps {
  userName?: string
  itemClass: string
}

export const NavbarUserMenu = ({ userName, itemClass }: NavbarUserMenuProps) => {
  if (!userName) return null

  return (
    <div className={`${itemClass} cursor-default hover:border-border hover:text-neutral`}>
      <span className="text-xs uppercase tracking-[0.2em] text-muted">Hello</span>
      <span className="font-semibold text-neutral">{userName}</span>
    </div>
  )
}

