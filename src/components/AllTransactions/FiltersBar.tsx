import { useEffect, useRef, useState, type ChangeEvent } from 'react'

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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null)
  const filteredCategories =
    typeFilter === 'all' ? categories : categories.filter(category => category.type === typeFilter)
  const categoryLabel =
    filteredCategories.find(category => category.id === categoryFilter)?.name ??
    (categoryFilter === 'all' ? 'All categories' : 'Choose a category')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const handleCategorySelect = (value: string) => {
    onChange({
      startDate,
      endDate,
      typeFilter,
      categoryFilter: value,
    })
    setIsCategoryOpen(false)
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
        <div ref={categoryDropdownRef} className="relative min-w-[200px]">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(open => !open)}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-white/95 px-4 py-3 text-sm font-semibold text-neutral shadow-[0_10px_28px_-22px_rgba(15,23,42,0.35)] transition hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          >
            <span className="truncate">{categoryLabel}</span>
            <span className="ml-3 text-xs font-semibold text-muted/70">{isCategoryOpen ? '▲' : '▼'}</span>
          </button>
          {isCategoryOpen ? (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-[0_22px_50px_-24px_rgba(15,23,42,0.35)]">
              <button
                type="button"
                onClick={() => handleCategorySelect('all')}
                className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition hover:bg-surfaceMuted ${
                  categoryFilter === 'all' ? 'bg-accent/10 text-accent' : 'text-neutral'
                }`}
              >
                <span>All categories</span>
              </button>
              {filteredCategories.map(category => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-surfaceMuted ${
                    categoryFilter === category.id ? 'bg-accent/10 font-semibold text-accent' : 'text-neutral'
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      category.type === 'income'
                        ? 'border-income/30 bg-income/10 text-income'
                        : 'border-expense/30 bg-expense/10 text-expense'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        category.type === 'income' ? 'bg-income' : 'bg-expense'
                      }`}
                      aria-hidden="true"
                    />
                    {category.type}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
