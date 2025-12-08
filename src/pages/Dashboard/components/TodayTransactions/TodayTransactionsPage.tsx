import type { Transaction } from '../../../../types'
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
    <TodayActivitySection
      transactions={transactions}
      isLoading={isLoading}
      income={income}
      expense={expense}
      balance={balance}
    />
  )
}

