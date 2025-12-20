import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Spinner } from '../../components/Spinner'
import type { Category } from '../../types'

interface CategoriesGridProps {
  isLoading: boolean
  categories: Category[]
  deleteMutation: {
    isPending: boolean
    variables: unknown
  }
  resolveCategoryId: (category: Category) => string
  onDelete: (category: Category) => void
  onSetDefault: (category: Category) => void
  isSettingDefault: boolean
  onAddCategory: () => void
}

export const CategoriesGrid = ({
  isLoading,
  categories,
  deleteMutation,
  resolveCategoryId,
  onDelete,
  onSetDefault,
  isSettingDefault,
  onAddCategory,
}: CategoriesGridProps) => {
  if (isLoading) {
    return <LoadingSpinner />
  }

  const grouped = [
    {
      title: 'Income categories',
      description: 'Organize how you track money coming in.',
      items: categories.filter(item => item.type === 'income'),
      isIncome: true,
      emptyState: "No income categories yet. Add one above to track salary, sales, or other inflows.",
    },
    {
      title: 'Expense categories',
      description: 'Break down your spending to see patterns clearly.',
      items: categories.filter(item => item.type === 'expense'),
      isIncome: false,
      emptyState: "No expense categories yet. Add one above to track bills, groceries, or other outflows.",
    },
  ]

  return (
    <div className="rounded-3xl border border-border bg-white/95 p-5 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.35)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral">All categories</h3>
          <p className="text-xs text-muted">
            View and manage all your income and expense categories. Removing one will affect linked transactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddCategory}
            className="inline-flex items-center gap-1 rounded-2xl bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-[#2F89C9]"
          >
            <span className="text-base leading-none">+</span>
            <span>Add category</span>
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {grouped.map(column => {
          const badgeClasses = column.isIncome
            ? 'border-income/40 bg-income/10 text-income'
            : 'border-expense/40 bg-expense/10 text-expense'
          const emptyState = column.emptyState

          return (
            <div
              key={column.title}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-white/90 p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.25)] backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-neutral">{column.title}</h3>
                  <p className="text-xs text-muted">{column.description}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium ${
                    column.isIncome
                      ? 'border-income/40 bg-income/10 text-income'
                      : 'border-expense/40 bg-expense/10 text-expense'
                  }`}
                >
                  {column.items.length}
                </span>
              </div>
              <ul className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                {column.items.length ? (
                  column.items.map(category => {
                    const categoryId = resolveCategoryId(category)
                    const isDeleting = deleteMutation.isPending && deleteMutation.variables === categoryId
                    const initials = category.name?.[0]?.toUpperCase() ?? '?'
                    const isDefault = Boolean(category.isDefault)
                    const canDelete = !isDefault

                    return (
                      <li
                        key={categoryId}
                        className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-white/90 px-4 py-3 text-sm text-neutral shadow-[0_18px_45px_-35px_rgba(15,23,42,0.3)] transition hover:border-accent/40 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold ${badgeClasses}`}
                          >
                            {initials}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-medium text-neutral">{category.name}</span>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                              <span className="uppercase tracking-[0.25em]">{category.type}</span>
                              {category.isDefault ? (
                                <span className="rounded-full bg-surfaceMuted px-2 py-0.5 text-[11px] font-medium text-muted">
                                  Default
                                </span>
                              ) : null}
                              {category.isActive === false ? (
                                <span className="rounded-full bg-border px-2 py-0.5 text-[11px] font-medium text-muted">
                                  Inactive
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => onSetDefault(category)}
                            disabled={isDefault || isSettingDefault}
                            className={`inline-flex items-center justify-center text-[34px] transition ${
                              isDefault
                                ? 'text-yellow-500 cursor-default'
                                : 'text-yellow-400 hover:text-yellow-500'
                            } disabled:cursor-not-allowed disabled:opacity-70`}
                            aria-label={isDefault ? 'Default category' : 'Set as default'}
                          >
                            <span>{isDefault ? '★' : '☆'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (canDelete) {
                                onDelete(category)
                              }
                            }}
                            className={`inline-flex items-center justify-center text-[34px] transition ${
                              canDelete ? 'text-expense hover:text-expense/80' : 'text-muted cursor-not-allowed'
                            } disabled:cursor-not-allowed disabled:opacity-70`}
                            disabled={isDeleting || !canDelete}
                            aria-label={canDelete ? 'Remove category' : 'Cannot remove default category'}
                          >
                            {isDeleting && canDelete ? <Spinner size="sm" /> : <span className="leading-none">×</span>}
                          </button>
                        </div>
                      </li>
                    )
                  })
                ) : (
                  <li className="rounded-2xl border border-dashed border-border bg-white/70 px-4 py-6 text-center text-xs text-muted">
                    {emptyState}
                  </li>
                )}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
