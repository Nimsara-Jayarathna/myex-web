import type { Transaction } from '../../../../types'
import { TransactionTableHeader } from '../AllTransactions/table/TransactionTableHeader'
import { TransactionRow } from '../AllTransactions/table/TransactionRow'

interface TodayTransactionsTableProps {
  transactions: Transaction[]
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
}

export const TodayTransactionsTable = ({
  transactions,
  onDeleteTransaction,
  isDeleting,
}: TodayTransactionsTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
      <table className="w-full text-left">
        <TransactionTableHeader />
        <tbody>
          {transactions.map(transaction => {
            const key =
              transaction._id ??
              transaction.id ??
              `${transaction.date}-${transaction.amount}-${transaction.category}`

            return (
              <TransactionRow
                key={key}
                transaction={transaction}
                onDeleteTransaction={onDeleteTransaction}
                isDeleting={isDeleting}
                forceDeletable
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

