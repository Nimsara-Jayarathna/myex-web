import type { Transaction } from '../../../types'
import { TransactionsSection } from '../../TransactionsSection'

interface TodayActivitySectionProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export const TodayActivitySection = ({ transactions, isLoading = false }: TodayActivitySectionProps) => {
  return (
    <TransactionsSection
      title="Today's Activity"
      transactions={transactions}
      isLoading={isLoading}
      emptyTitle="No activity today"
      emptyDescription="Add a transaction to see it reflected in today's activity."
    />
  )
}

