import { type ReactNode } from 'react'
import { formatCurrency } from '../utils/format'

interface SummaryCardProps {
  title: string
  amount: number
  icon: ReactNode
  accent?: 'income' | 'expense' | 'balance'
  highlight?: string
}

const accentContainer: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  income: 'from-emerald-400/15 via-emerald-500/10 to-emerald-500/5 border-emerald-400/30',
  expense: 'from-rose-400/15 via-rose-500/10 to-rose-500/5 border-rose-400/30',
  balance: 'from-sky-400/15 via-sky-500/10 to-indigo-500/5 border-sky-400/30',
}

const iconAccent: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  income: 'bg-emerald-500/15 text-emerald-200',
  expense: 'bg-rose-500/15 text-rose-200',
  balance: 'bg-sky-500/15 text-sky-200',
}

const highlightAccent: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  income: 'text-emerald-200/80',
  expense: 'text-rose-200/80',
  balance: 'text-sky-200/80',
}

export const SummaryCard = ({ title, amount, icon, accent = 'balance', highlight }: SummaryCardProps) => (
  <article
    className={`group relative overflow-hidden rounded-[26px] border bg-gradient-to-br p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_64px_-32px_rgba(56,189,248,0.65)] ${accentContainer[accent]}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 transition group-hover:opacity-100" />
    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
    <div className="relative flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-white/60">{title}</span>
        <span className="text-3xl font-semibold text-white">{formatCurrency(amount)}</span>
        {highlight ? <span className={`text-xs uppercase tracking-[0.3em] ${highlightAccent[accent]}`}>{highlight}</span> : null}
      </div>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 shadow-inner shadow-black/30 ${iconAccent[accent]}`}
      >
        {icon}
      </span>
    </div>
  </article>
)
