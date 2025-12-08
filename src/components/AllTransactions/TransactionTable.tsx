import type { Transaction } from '../../types'
import type { GroupedTransactions } from './types'
import { formatCurrency, formatDate } from '../../utils/format'

interface TransactionTableProps {
  transactions: Transaction[]
  grouped?: GroupedTransactions[]
}

const resolveCategory = (transaction: Transaction) => {
  if (typeof transaction.category === 'string') {
    return transaction.category || transaction.categoryName || transaction.title || 'Transaction'
  }
  return transaction.category?.name ?? transaction.categoryName ?? transaction.title ?? 'Transaction'
}

export const TransactionTable = ({ transactions, grouped }: TransactionTableProps) => {
  const headerRowClasses =
    'text-[11px] uppercase tracking-[0.22em] text-neutral/80 border-b border-accent/30 bg-gradient-to-r from-accent/10 via-white to-accent/10'
  const headerCellClasses = 'px-4 py-3 text-left text-xs font-semibold text-neutral'

  const rows = (list: Transaction[]) =>
    list.map(transaction => {
      const key = transaction._id ?? transaction.id ?? `${transaction.date}-${transaction.amount}-${transaction.category}`
      const isIncome = transaction.type === 'income'
      return (
        <tr
          key={key}
          className="border-b border-border/70 last:border-b-0 hover:bg-surfaceMuted/80"
        >
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
          <td className="px-4 py-3 text-sm text-muted">{transaction.note ?? '—'}</td>
        </tr>
      )
    })

  if (grouped && grouped.length > 0) {
    return (
      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        {grouped.map(group => (
          <div key={group.label} className="border-b border-border last:border-b-0">
            <div className="flex items-center justify-between border-b border-border bg-surfaceMuted/80 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-5 w-1 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral">Group: {group.label}</span>
              </div>
              <span className="rounded-full border border-accent/40 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent shadow-[0_10px_25px_-20px_rgba(52,152,219,0.7)]">
                {group.items.length} items
              </span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className={headerRowClasses}>
                  <th className={headerCellClasses}>Date</th>
                  <th className={headerCellClasses}>Type</th>
                  <th className={headerCellClasses}>Category</th>
                  <th className={headerCellClasses}>Amount</th>
                  <th className={headerCellClasses}>Note</th>
                </tr>
              </thead>
              <tbody>{rows(group.items)}</tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
      <table className="w-full text-left">
        <thead>
          <tr className={headerRowClasses}>
            <th className={headerCellClasses}>Date</th>
            <th className={headerCellClasses}>Type</th>
            <th className={headerCellClasses}>Category</th>
            <th className={headerCellClasses}>Amount</th>
            <th className={headerCellClasses}>Note</th>
          </tr>
        </thead>
        <tbody>{rows(transactions)}</tbody>
      </table>
    </div>
  )
}
