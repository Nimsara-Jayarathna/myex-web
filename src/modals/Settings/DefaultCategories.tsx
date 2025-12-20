import type { Category } from '../../types'

interface DefaultCategoriesProps {
  incomeCategories: Category[]
  expenseCategories: Category[]
  defaultIncomeId: string
  defaultExpenseId: string
  isUpdating: boolean
  onChangeDefault: (categoryId: string, type: 'income' | 'expense') => void
  resolveCategoryId: (category: Category) => string
}

export const DefaultCategories = ({
  incomeCategories,
  expenseCategories,
  defaultIncomeId,
  defaultExpenseId,
  isUpdating,
  onChangeDefault,
  resolveCategoryId,
}: DefaultCategoriesProps) => (
  <div className="rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-5 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.28)] backdrop-blur-xl">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-[var(--page-fg)]">Default categories</h3>
        <p className="text-xs text-[var(--text-muted)]">Choose the go-to income and expense categories.</p>
      </div>
      {isUpdating ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-1 text-[11px] font-medium text-[var(--text-muted)] backdrop-blur-md">
          Updating...
        </span>
      ) : null}
    </div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm text-[var(--page-fg)]">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-income">
          Income default
          <span className="h-2 w-2 rounded-full bg-income" aria-hidden="true" />
        </span>
        <select
          value={defaultIncomeId}
          onChange={event => onChangeDefault(event.target.value, 'income')}
          disabled={!incomeCategories.length || isUpdating}
          className="rounded-2xl border border-income/30 bg-[var(--surface-glass-thick)] px-3 py-2.5 text-sm font-semibold text-[var(--page-fg)] shadow-[0_10px_28px_-22px_rgba(15,23,42,0.35)] backdrop-blur-md transition focus:border-income focus:outline-none focus:ring-2 focus:ring-income/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="" disabled>
            {incomeCategories.length ? 'Select income default' : 'No income categories'}
          </option>
          {incomeCategories.map(item => {
            const id = resolveCategoryId(item)
            return (
              <option key={id} value={id}>
                {item.name}
              </option>
            )
          })}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-[var(--page-fg)]">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-expense">
          Expense default
          <span className="h-2 w-2 rounded-full bg-expense" aria-hidden="true" />
        </span>
        <select
          value={defaultExpenseId}
          onChange={event => onChangeDefault(event.target.value, 'expense')}
          disabled={!expenseCategories.length || isUpdating}
          className="rounded-2xl border border-expense/30 bg-[var(--surface-glass-thick)] px-3 py-2.5 text-sm font-semibold text-[var(--page-fg)] shadow-[0_10px_28px_-22px_rgba(15,23,42,0.35)] backdrop-blur-md transition focus:border-expense focus:outline-none focus:ring-2 focus:ring-expense/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="" disabled>
            {expenseCategories.length ? 'Select expense default' : 'No expense categories'}
          </option>
          {expenseCategories.map(item => {
            const id = resolveCategoryId(item)
            return (
              <option key={id} value={id}>
                {item.name}
              </option>
            )
          })}
        </select>
      </label>
    </div>
  </div>
)

