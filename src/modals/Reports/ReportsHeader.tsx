import type { TotalsSummary } from '../../types'
import { formatCurrency } from '../../utils/format'

interface ReportsHeaderProps {
  view: 'daily' | 'monthly'
  onChangeView: (view: 'daily' | 'monthly') => void
  totals?: TotalsSummary
}

export const ReportsHeader = ({ view, onChangeView, totals }: ReportsHeaderProps) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1 shadow-sm backdrop-blur-md">
        {(['daily', 'monthly'] as const).map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onChangeView(option)}
            className={`rounded-full px-4 py-1 text-sm capitalize transition ${
              view === option ? 'bg-accent text-white shadow-soft' : 'text-[var(--text-muted)] hover:text-[var(--page-fg)]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {totals ? (
        <div className="grid gap-3 text-xs uppercase tracking-wide text-[var(--text-muted)] sm:grid-cols-3">
          <div className="rounded-2xl border border-income/30 bg-income/10 px-4 py-3 text-income">
            <span className="block text-[11px] text-income/80">Income</span>
            <strong className="text-base text-[var(--page-fg)]">{formatCurrency(totals.totalIncome)}</strong>
          </div>
          <div className="rounded-2xl border border-expense/30 bg-expense/10 px-4 py-3 text-expense">
            <span className="block text-[11px] text-expense/80">Expenses</span>
            <strong className="text-base text-[var(--page-fg)]">{formatCurrency(totals.totalExpense)}</strong>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-accent">
            <span className="block text-[11px] text-accent/80">Balance</span>
            <strong className="text-base text-[var(--page-fg)]">{formatCurrency(totals.balance)}</strong>
          </div>
        </div>
      ) : null}
    </div>
  </div>
)

