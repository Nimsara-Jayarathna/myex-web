import type { ReactNode } from 'react'

interface FilterCardProps {
  title: string
  children: ReactNode
}

export const FilterCard = ({ title, children }: FilterCardProps) => (
  <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 text-center shadow-soft backdrop-blur-md">
    <span className="w-full text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
      {title}
    </span>
    {children}
  </div>
)

