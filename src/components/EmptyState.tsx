interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/5 px-8 py-12 text-center text-slate-400">
      <p className="text-sm font-medium text-white">{title}</p>
      {description ? <p className="max-w-sm text-xs text-slate-400">{description}</p> : null}
      {action}
    </div>
  )
}
