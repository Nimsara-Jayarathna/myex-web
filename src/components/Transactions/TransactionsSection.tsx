import type { Transaction } from '../../types'
import { TransactionList } from '../TransactionList'
import { LoadingSpinner } from '../LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { ListHeader } from './ListHeader'

interface TransactionsSectionProps {
  title: string
  transactions: Transaction[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export const TransactionsSection = ({
  title,
  transactions,
  isLoading = false,
  emptyTitle = 'No transactions yet',
  emptyDescription = 'Log your first income or expense to unlock insights.',
}: TransactionsSectionProps) => {
  return (
    <section className="rounded-4xl border border-border bg-white/90 p-6 shadow-card">
      <ListHeader title={title} />

      {isLoading ? (
        <LoadingSpinner />
      ) : transactions && transactions.length ? (
        <TransactionList transactions={transactions} title={title} />
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </section>
  )
}

