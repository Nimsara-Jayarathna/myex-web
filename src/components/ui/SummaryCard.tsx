import type { ReactNode } from 'react'
import { formatCurrency } from '../../utils/format'

interface SummaryCardProps {
  title: string
  amount: number
  icon: ReactNode
  accent?: 'income' | 'expense' | 'balance'
  highlight?: string
}

const accentContainer: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  income: 'border-income/25 bg-white shadow-soft',
  expense: 'border-expense/25 bg-white shadow-soft',
  balance: 'border-accent/25 bg-white shadow-soft',
}

const iconAccent: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  income: 'border-income/40 bg-income/15 text-income',
  expense: 'border-expense/40 bg-expense/15 text-expense',
  balance: 'border-accent/40 bg-accent/15 text-accent',
}

const highlightAccent: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  income: 'text-income',
  expense: 'text-expense',
  balance: 'text-accent',
}

export const SummaryCard = ({ title, amount, icon, accent = 'balance', highlight }: SummaryCardProps) => (
  <article
    className={`group relative overflow-hidden rounded-3xl border p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-card ${accentContainer[accent]}`}
  >
    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-70" />
    <div className="relative flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-muted">{title}</span>
        <span className="text-3xl font-semibold text-neutral">{formatCurrency(amount)}</span>
        {highlight ? (
          <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${highlightAccent[accent]}`}>
            {highlight}
          </span>
        ) : null}
      </div>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full border text-base font-semibold ${iconAccent[accent]}`}
      >
        {icon}
      </span>
    </div>
  </article>
)

