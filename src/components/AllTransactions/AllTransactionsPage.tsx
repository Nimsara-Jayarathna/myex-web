import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import type { Transaction } from '../../types'
import { LoadingSpinner } from '../LoadingSpinner'
import { EmptyState } from '../EmptyState'
import { FiltersBar } from './FiltersBar'
import { SortingControls } from './SortingControls'
import { GroupingControls } from './GroupingControls'
import { TransactionTable } from './TransactionTable'
import { getCategories } from '../../api/categories'

export type SortField = 'date' | 'amount' | 'category'
export type SortDirection = 'asc' | 'desc'
export type TransactionTypeFilter = 'all' | 'income' | 'expense'
type Grouping = 'none' | 'month' | 'category'

interface AllTransactionsPageProps {
  transactions: Transaction[]
  isLoading?: boolean
  filters: {
    startDate: string
    endDate: string
    typeFilter: TransactionTypeFilter
    categoryFilter: string
    sortField: SortField
    sortDirection: SortDirection
  }
  onFiltersChange: (filters: AllTransactionsPageProps['filters']) => void
}

export const AllTransactionsPage = ({
  transactions,
  isLoading = false,
  filters,
  onFiltersChange,
}: AllTransactionsPageProps) => {
  const [grouping, setGrouping] = useState<Grouping>('none')
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const categories = useMemo(
    () =>
      (categoriesData ?? []).map(item => ({
        id: item.id ?? item._id ?? item.name,
        name: item.name,
        type: item.type,
      })),
    [categoriesData],
  )

  const categoriesForType = useMemo(
    () => (filters.typeFilter === 'all' ? categories : categories.filter(item => item.type === filters.typeFilter)),
    [categories, filters.typeFilter],
  )

  useEffect(() => {
    if (filters.categoryFilter === 'all') {
      return
    }
    const stillValid = categoriesForType.some(cat => cat.id === filters.categoryFilter)
    if (!stillValid) {
      onFiltersChange({ ...filters, categoryFilter: 'all' })
    }
  }, [categoriesForType, filters, onFiltersChange])

  const grouped = useMemo(() => {
    if (grouping === 'none') {
      return null
    }

    const buckets = new Map<string, Transaction[]>()

    transactions.forEach(txn => {
      let key: string
      if (grouping === 'month') {
        key = dayjs(txn.date).format('MMMM YYYY')
      } else {
        key =
          typeof txn.category === 'string'
            ? txn.category || txn.categoryName || txn.title || 'Uncategorised'
            : txn.category?.name ?? txn.categoryName ?? txn.title ?? 'Uncategorised'
      }
      if (!buckets.has(key)) {
        buckets.set(key, [])
      }
      buckets.get(key)!.push(txn)
    })

    return Array.from(buckets.entries()).map(([label, items]) => ({ label, items }))
  }, [grouping, transactions])

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
        <div className="flex flex-wrap gap-3">
          <SortingControls
            field={filters.sortField}
            direction={filters.sortDirection}
            onChange={(field, direction) => {
              onFiltersChange({
                ...filters,
                sortField: field,
                sortDirection: direction,
              })
            }}
          />
          <GroupingControls grouping={grouping} onChange={setGrouping} />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Adjust filters or add a transaction to see it here."
        />
      ) : (
        <TransactionTable transactions={transactions} grouped={grouped ?? undefined} />
      )}
    </section>
  )
}
