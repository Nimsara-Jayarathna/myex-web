import type { Transaction } from '../types'
import { TodaySummaryCards } from './TodaySummaryCards'
import { TransactionsSection } from './TransactionsSection'

interface TodayTransactionsPageProps {
  transactions: Transaction[]
  isLoading?: boolean
  income: number
  expense: number
  balance: number
}

export const TodayTransactionsPage = ({
  transactions,
  isLoading = false,
  income,
  expense,
  balance,
}: TodayTransactionsPageProps) => {
  return (
    <div className="space-y-6">
      <TodaySummaryCards income={income} expense={expense} balance={balance} />
      <TransactionsSection
        title="Today's Activity"
        transactions={transactions}
        isLoading={isLoading}
        emptyTitle="No activity today"
        emptyDescription="Add a transaction to see it reflected in today's activity."
      />
    </div>
  )
}

