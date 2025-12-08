import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AllTransactionsFilters } from '../types'
import { getCategories } from '../../../../../api/categories'

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
    [categoriesData]
  )

  const categoriesForType = useMemo(
    () =>
      filters.typeFilter === 'all'
        ? categories
        : categories.filter(item => item.type === filters.typeFilter),
    [categories, filters.typeFilter]
  )

  useEffect(() => {
    if (filters.categoryFilter === 'all') return
    const stillValid = categoriesForType.some(cat => cat.id === filters.categoryFilter)
    if (!stillValid) {
      onFiltersChange({ ...filters, categoryFilter: 'all' })
    }
  }, [categoriesForType, filters, onFiltersChange])

  return { categoriesForType }
}

