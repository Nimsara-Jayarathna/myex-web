import dayjs from 'dayjs'
import type { Transaction } from '../../../../../types'
import { formatCurrency, formatDate } from '../../../../../utils/format'

const resolveCategory = (transaction: Transaction) => {
  if (typeof transaction.category === 'string') {
    return transaction.category || transaction.categoryName || transaction.title || 'Transaction'
  }
  return transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
}

interface TransactionRowProps {
  transaction: Transaction
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
}

export const TransactionRow = ({ transaction, onDeleteTransaction, isDeleting }: TransactionRowProps) => {
  const isIncome = transaction.type === 'income'
  const canDelete =
    !!transaction.createdAt && dayjs(transaction.createdAt).isSame(dayjs(), 'day') && !!onDeleteTransaction

  return (
    <tr className="border-b border-border/70 last:border-b-0 hover:bg-surfaceMuted/80">
      <td className="px-4 py-3 text-sm text-neutral">{formatDate(transaction.date)}</td>
      <td className="px-4 py-3 text-sm font-semibold">
        <span
          className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
            isIncome
              ? 'bg-income/15 text-income border border-income/30'
              : 'bg-expense/15 text-expense border border-expense/30'
          }`}
        >
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-neutral">{resolveCategory(transaction)}</td>
      <td className={`px-4 py-3 text-sm font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>
        {isIncome ? '+' : '-'}
        {formatCurrency(Math.abs(transaction.amount))}
      </td>
      <td className="px-4 py-3 text-sm text-muted">{transaction.note ?? 'No note'}</td>
      <td className="px-4 py-3 text-right text-sm">
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
      </td>
    </tr>
  )
}
