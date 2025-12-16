import dayjs from 'dayjs'
import type { Transaction } from '../types'
import { formatCurrency, formatDate } from '../utils/format'

interface TransactionListProps {
  transactions: Transaction[]
  title?: string
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
}

export const TransactionList = ({
  transactions,
  title = 'Recent Transactions',
  onDeleteTransaction,
  isDeleting,
}: TransactionListProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-sm font-medium uppercase tracking-[0.28em] text-muted">{title}</span>
      </header>
      <ul className="max-h-[420px] space-y-1 overflow-y-auto px-2 py-2">
        {transactions.map(transaction => {
          const categoryLabel =
            typeof transaction.category === 'string'
              ? transaction.category || transaction.categoryName || transaction.title || 'Transaction'
              : transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
          const isIncome = transaction.type === 'income'
          const amountLabel = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}`
          const key = transaction._id ?? transaction.id ?? `${transaction.date}-${transaction.amount}`
          const canDelete =
            !!transaction.createdAt && dayjs(transaction.createdAt).isSame(dayjs(), 'day') && !!onDeleteTransaction

          return (
            <li
              key={key}
              className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition hover:bg-surfaceMuted"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                    isIncome
                      ? 'border-income/40 bg-income/15 text-income'
                      : 'border-expense/40 bg-expense/15 text-expense'
                  }`}
                >
                  {isIncome ? 'In' : 'Out'}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-neutral">{categoryLabel}</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted">{formatDate(transaction.date)}</span>
                  {transaction.note ? (
                    <span className="text-xs text-muted">{transaction.note}</span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-right text-base font-semibold tracking-tight ${isIncome ? 'text-income' : 'text-expense'}`}
                >
                  {amountLabel}
                </span>
                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => onDeleteTransaction?.(transaction)}
                    disabled={isDeleting}
                    className="text-[11px] font-semibold text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </li>
          )
        })}
        {transactions.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
            No transactions yet. Add your first one!
          </li>
        ) : null}
      </ul>
    </div>
  )
}
