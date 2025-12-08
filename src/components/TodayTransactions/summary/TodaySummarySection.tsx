import { TodaySummaryCards } from '../../TodaySummaryCards'

interface TodaySummarySectionProps {
  income: number
  expense: number
  balance: number
}

export const TodaySummarySection = ({ income, expense, balance }: TodaySummarySectionProps) => {
  return <TodaySummaryCards income={income} expense={expense} balance={balance} />
}

