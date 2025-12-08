import { useState } from 'react'
import type { AllTransactionsPageProps, Grouping, SortDirection, SortField } from './types'
import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { FiltersBar } from './FiltersBar'
import { SortControls } from './controls/SortControls'
import { DirectionControls } from './controls/DirectionControls'
import { GroupingControls } from './controls/GroupingControls'
import { TransactionTable } from './TransactionTable'
import { useAllTransactionsCategories } from './hooks/useAllTransactionsCategories'
import { useGroupedTransactions } from './hooks/useGroupedTransactions'

export const AllTransactionsPage = ({
  transactions,
  isLoading = false,
  filters,
  onFiltersChange,
}: AllTransactionsPageProps) => {
  const [grouping, setGrouping] = useState<Grouping>('none')

  const { categoriesForType } = useAllTransactionsCategories(filters, onFiltersChange)
  const grouped = useGroupedTransactions(transactions, grouping)

  return (
    <section className="space-y-4 rounded-4xl border border-border bg-white/90 p-6 shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral">All Transactions</h2>
          <p className="text-sm text-muted">Filter, sort, or group your full history.</p>
        </div>
      </header>

      <div className="space-y-3">
        <FiltersBar
          startDate={filters.startDate}
          endDate={filters.endDate}
          typeFilter={filters.typeFilter}
          categoryFilter={filters.categoryFilter}
          categories={categoriesForType}
          onChange={({ startDate, endDate, typeFilter, categoryFilter }) => {
            onFiltersChange({
              ...filters,
              startDate,
              endDate,
              typeFilter,
              categoryFilter,
            })
          }}
        />

        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
          <SortControls
            field={filters.sortField}
            onChange={(field: SortField) => onFiltersChange({ ...filters, sortField: field })}
          />
          <DirectionControls
            direction={filters.sortDirection}
            onChange={(direction: SortDirection) => onFiltersChange({ ...filters, sortDirection: direction })}
          />
          <GroupingControls grouping={grouping} onChange={setGrouping} />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : transactions.length === 0 ? (
        <EmptyState title="No transactions found" description="Adjust filters or add a transaction to see it here." />
      ) : (
        <TransactionTable transactions={transactions} grouped={grouped ?? undefined} />
      )}
    </section>
  )
}

