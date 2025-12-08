interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-white/70 px-8 py-12 text-center text-muted">
      <p className="text-sm font-medium text-neutral">{title}</p>
      {description ? <p className="max-w-sm text-xs text-muted">{description}</p> : null}
      {action}
    </div>
  )
}

