import type { Transaction } from '../../types'
import { TodaySummarySection } from './summary/TodaySummarySection'
import { TodayActivitySection } from './activity/TodayActivitySection'

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
      <TodaySummarySection income={income} expense={expense} balance={balance} />
      <TodayActivitySection transactions={transactions} isLoading={isLoading} />
    </div>
  )
}

