import type { ChangeEvent } from 'react'

type TransactionTypeFilter = 'all' | 'income' | 'expense'

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
  const filteredCategories =
    typeFilter === 'all' ? categories : categories.filter(category => category.type === typeFilter)

  const handleDateChange = (key: 'startDate' | 'endDate') => (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      startDate: key === 'startDate' ? event.target.value : startDate,
      endDate: key === 'endDate' ? event.target.value : endDate,
      typeFilter,
      categoryFilter,
    })
  }

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      startDate,
      endDate,
      typeFilter: event.target.value as TransactionTypeFilter,
      categoryFilter: 'all',
    })
  }

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      startDate,
      endDate,
      typeFilter,
      categoryFilter: event.target.value,
    })
  }

  return (
    <div className="flex w-full flex-wrap items-stretch justify-between gap-4 rounded-3xl border border-border bg-white/90 p-4 shadow-soft">
      <div className="flex flex-col gap-1 text-xs text-muted">
        <span className="font-semibold uppercase tracking-[0.2em]">Date range</span>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={handleDateChange('startDate')}
            className="rounded-2xl border border-border bg-white px-3 py-2 text-sm text-neutral focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <span className="text-muted">to</span>
          <input
            type="date"
            value={endDate}
            onChange={handleDateChange('endDate')}
            className="rounded-2xl border border-border bg-white px-3 py-2 text-sm text-neutral focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs text-muted">
        <span className="font-semibold uppercase tracking-[0.2em]">Type</span>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 text-sm text-neutral">
          {(['all', 'income', 'expense'] as const).map(option => (
            <label key={option} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
              <input
                type="radio"
                name="typeFilter"
                value={option}
                checked={typeFilter === option}
                onChange={handleTypeChange}
                className="h-4 w-4 accent-accent"
              />
              <span className="capitalize text-neutral">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted">
        <span className="font-semibold uppercase tracking-[0.2em]">Category</span>
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="min-w-[160px] rounded-2xl border border-border bg-white px-3 py-2 text-sm text-neutral focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="all">All</option>
          {filteredCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
