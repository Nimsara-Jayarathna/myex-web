import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AllTransactionsFilters } from '../types'
import { getAllCategories } from '../../../../../api/categories'

interface CategoryOption {
  id: string
  name: string
  type: 'income' | 'expense'
}

interface UseAllTransactionsCategoriesResult {
  categoriesForType: CategoryOption[]
}

export const useAllTransactionsCategories = (
  filters: AllTransactionsFilters,
  onFiltersChange: (filters: AllTransactionsFilters) => void
): UseAllTransactionsCategoriesResult => {
  const { data: categoriesData } = useQuery({
    queryKey: ['categoriesAll', filters.typeFilter],
    queryFn: () =>
      getAllCategories(
        filters.typeFilter === 'all'
          ? undefined
          : filters.typeFilter === 'income' || filters.typeFilter === 'expense'
            ? filters.typeFilter
            : undefined
      ),
  })

  const categoriesForType = useMemo(
    () =>
      (categoriesData ?? []).map(item => ({
        id: item.id ?? item._id ?? item.name,
        name: item.name,
        type: item.type,
      })),
    [categoriesData]
  )

  useEffect(() => {
    if (filters.categoryFilter === 'all') return
    if (!categoriesForType.length) return

    const stillValid = categoriesForType.some(cat => cat.id === filters.categoryFilter)
    if (!stillValid) {
      onFiltersChange({ ...filters, categoryFilter: 'all' })
    }
  }, [categoriesForType, filters, onFiltersChange])

  return { categoriesForType }
}

