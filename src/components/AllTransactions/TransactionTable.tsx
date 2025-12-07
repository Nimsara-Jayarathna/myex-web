import type { Transaction } from '../../types'
import { formatCurrency, formatDate } from '../../utils/format'

interface GroupedTransactions {
  label: string
  items: Transaction[]
}

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
            <div className="flex items-center justify-between bg-surfaceMuted px-5 py-3 text-sm font-semibold text-neutral">
              <span>{group.label}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">{group.items.length} items</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white">
                <tr className="text-xs uppercase tracking-[0.18em] text-muted">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Note</th>
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
        <thead className="bg-surfaceMuted/60">
          <tr className="text-xs uppercase tracking-[0.18em] text-muted">
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Note</th>
          </tr>
        </thead>
        <tbody>{rows(transactions)}</tbody>
      </table>
    </div>
  )
}
