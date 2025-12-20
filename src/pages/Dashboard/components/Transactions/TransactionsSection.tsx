import type { Transaction } from '../../../../types'
import { TransactionList } from '../../../../components/TransactionList'
import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { ListHeader } from './ListHeader'

interface TransactionsSectionProps {
  title: string
  transactions: Transaction[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  onDeleteTransaction?: (transaction: Transaction) => void
  isDeleting?: boolean
}

export const TransactionsSection = ({
  title,
  transactions,
  isLoading = false,
  emptyTitle = 'No transactions yet',
  emptyDescription = 'Log your first income or expense to unlock insights.',
  onDeleteTransaction,
  isDeleting,
}: TransactionsSectionProps) => {
  return (
    <section className="rounded-4xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-6 shadow-card">
      <ListHeader title={title} />

      {isLoading ? (
        <LoadingSpinner />
      ) : transactions && transactions.length ? (
        <TransactionList
          transactions={transactions}
          title={title}
          onDeleteTransaction={onDeleteTransaction}
          isDeleting={isDeleting}
        />
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </section>
  )
}
