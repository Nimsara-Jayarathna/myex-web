interface ControlCardProps {
  title: string
  children: React.ReactNode
}

export const ControlCard = ({ title, children }: ControlCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-3 shadow-soft w-full">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{title}</span>
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
        : 'border-border bg-white text-neutral hover:border-accent/50 hover:text-accent'
    }`}
  >
    {icon && <span className="text-xs">{icon}</span>}
    {label}
  </button>
)

