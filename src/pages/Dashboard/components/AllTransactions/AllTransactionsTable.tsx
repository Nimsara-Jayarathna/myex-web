import type { Transaction } from '../../../../types'
import type { GroupedTransactions } from './types'
import { TransactionTableHeader } from './table/TransactionTableHeader'
import { TransactionRow } from './table/TransactionRow'

interface AllTransactionsTableProps {
  transactions: Transaction[]
  grouped?: GroupedTransactions[]
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
}

const renderRows = (
  list: Transaction[],
  onDeleteTransaction?: (transaction: Transaction) => void,
  isDeleting?: boolean,
) =>
  list.map(transaction => {
    const key =
      transaction._id ?? transaction.id ?? `${transaction.date}-${transaction.amount}-${transaction.category}`
    return (
      <TransactionRow
        key={key}
        transaction={transaction}
        onDeleteTransaction={onDeleteTransaction}
        isDeleting={isDeleting}
      />
    )
  })

export const AllTransactionsTable = ({
  transactions,
  grouped,
  onDeleteTransaction,
  isDeleting,
}: AllTransactionsTableProps) => {
  if (grouped && grouped.length > 0) {
    return (
      <div className="overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-soft">
        {grouped.map(group => (
          <div key={group.label} className="border-b border-[var(--border-soft)] last:border-b-0">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--surface-4)] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-5 w-1 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--page-fg)]">
                  Group: {group.label}
                </span>
              </div>
              <span className="rounded-full border border-accent/40 bg-[var(--surface-1)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent shadow-[0_10px_25px_-20px_rgba(52,152,219,0.7)]">
                {group.items.length} items
              </span>
            </div>
            <table className="w-full text-left">
              <TransactionTableHeader />
              <tbody>{renderRows(group.items, onDeleteTransaction, isDeleting)}</tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-soft">
      <table className="w-full text-left">
        <TransactionTableHeader />
        <tbody>{renderRows(transactions, onDeleteTransaction, isDeleting)}</tbody>
      </table>
    </div>
  )
}

