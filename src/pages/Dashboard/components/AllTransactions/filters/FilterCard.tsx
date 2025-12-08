import type { ReactNode } from 'react'

interface FilterCardProps {
  title: string
  children: ReactNode
}

export const FilterCard = ({ title, children }: FilterCardProps) => (
  <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-border bg-white p-4 text-center shadow-soft">
    <span className="w-full text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
      {title}
    </span>
    {children}
  </div>
)

