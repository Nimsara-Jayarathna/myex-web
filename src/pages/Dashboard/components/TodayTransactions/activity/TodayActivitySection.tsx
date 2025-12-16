import type { Transaction } from '../../../../../types'
import { TransactionsSection } from '../../Transactions/TransactionsSection'
import { TodaySummaryCards } from '../TodaySummaryCards'

interface TodayActivitySectionProps {
  transactions: Transaction[]
  isLoading?: boolean
  income: number
  expense: number
  balance: number
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
}

export const TodayActivitySection = ({
  transactions,
  isLoading = false,
  income,
  expense,
  balance,
  onDeleteTransaction,
  isDeleting,
}: TodayActivitySectionProps) => {
  return (
    <div className="space-y-6">
      <TodaySummaryCards income={income} expense={expense} balance={balance} />
      <TransactionsSection
        title="Today's Activity"
        transactions={transactions}
        isLoading={isLoading}
        emptyTitle="No activity today"
        emptyDescription="Add a transaction to see it reflected in today's activity."
        onDeleteTransaction={onDeleteTransaction}
        isDeleting={isDeleting}
      />
    </div>
  )
}
