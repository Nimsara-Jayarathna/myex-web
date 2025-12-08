import type { TransactionTypeFilter } from './types'
import { DateRangeFilter } from './filters/DateRangeFilter'
import { TypeFilter } from './filters/TypeFilter'
import { CategoryFilter } from './filters/CategoryFilter'

interface FiltersBarProps {
  startDate: string
  endDate: string
  typeFilter: TransactionTypeFilter
  categoryFilter: string
  categories: {
    id: string
    name: string
    type: 'income' | 'expense'
  }[]
  onChange: (filters: {
    startDate: string
    endDate: string
    typeFilter: TransactionTypeFilter
    categoryFilter: string
  }) => void
}

export const FiltersBar = ({
  startDate,
  endDate,
  typeFilter,
  categoryFilter,
  categories,
  onChange,
}: FiltersBarProps) => {
  const handleStartDateChange = (value: string) => {
    onChange({
      startDate: value,
      endDate,
      typeFilter,
      categoryFilter,
    })
  }

  const handleEndDateChange = (value: string) => {
    onChange({
      startDate,
      endDate: value,
      typeFilter,
      categoryFilter,
    })
  }

  const handleTypeChange = (value: TransactionTypeFilter) => {
    onChange({
      startDate,
      endDate,
      typeFilter: value,
      categoryFilter: 'all',
    })
  }

  const handleCategoryChange = (value: string) => {
    onChange({
      startDate,
      endDate,
      typeFilter,
      categoryFilter: value,
    })
  }

  return (
    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onChangeStartDate={handleStartDateChange}
        onChangeEndDate={handleEndDateChange}
      />

      <TypeFilter typeFilter={typeFilter} onChangeType={handleTypeChange} />

      <CategoryFilter
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        categories={categories}
        onChangeCategory={handleCategoryChange}
      />
    </div>
  )
}

