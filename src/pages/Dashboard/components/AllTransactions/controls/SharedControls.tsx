interface ControlCardProps {
  title: string
  children: React.ReactNode
}

export const ControlCard = ({ title, children }: ControlCardProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-3 shadow-soft">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{title}</span>
      <div className="flex flex-wrap justify-center gap-2 w-full">{children}</div>
    </div>
  )
}

interface ControlButtonProps {
  label: string
  icon?: string
  isActive?: boolean
  onClick: () => void
}

export const ControlButton = ({ label, icon, isActive = false, onClick }: ControlButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'border-accent bg-accent text-white shadow-md'
        : 'border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--page-fg)] hover:border-accent/50 hover:text-accent'
    }`}
  >
    {icon && <span className="text-xs">{icon}</span>}
    {label}
  </button>
)

