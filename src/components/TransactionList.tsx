import type { Transaction } from '../types'
import { formatCurrency, formatDate } from '../utils/format'

interface TransactionListProps {
  transactions: Transaction[]
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_28px_60px_-45px_rgba(56,189,248,0.6)]">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="text-sm font-medium uppercase tracking-[0.28em] text-white/60">Recent Transactions</span>
      </header>
      <ul className="max-h-[420px] space-y-1 overflow-y-auto px-2 py-2">
        {transactions.map(transaction => {
          const category =
            typeof transaction.category === 'string' ? transaction.categoryName ?? transaction.category : transaction.category?.name
          const isIncome = transaction.type === 'income'
          const amountLabel = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}`

          return (
            <li
              key={transaction._id}
              className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                    isIncome
                      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  {isIncome ? 'In' : 'Out'}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-white">{category}</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{formatDate(transaction.date)}</span>
                  {transaction.note ? (
                    <span className="text-xs text-slate-400">{transaction.note}</span>
                  ) : null}
                </div>
              </div>
              <span
                className={`text-right text-base font-semibold tracking-tight ${isIncome ? 'text-emerald-300' : 'text-rose-300'}`}
              >
                {amountLabel}
              </span>
            </li>
          )
        })}
        {transactions.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-400">
            No transactions yet. Add your first one!
          </li>
        ) : null}
      </ul>
    </div>
  )
}
