import { useEffect, useRef, useState } from 'react'
import type { TransactionTypeFilter } from '../types'
import { FilterCard } from './FilterCard'

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
}

interface CategoryFilterProps {
  typeFilter: TransactionTypeFilter
  categoryFilter: string
  categories: Category[]
  onChangeCategory: (value: string) => void
}

export const CategoryFilter = ({
  typeFilter,
  categoryFilter,
  categories,
  onChangeCategory,
}: CategoryFilterProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredCategories =
    typeFilter === 'all'
      ? categories
      : categories.filter(category => category.type === typeFilter)

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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCategorySelect = (value: string) => {
    onChangeCategory(value)
    setIsCategoryOpen(false)
  }

  return (
    <FilterCard title="Category">
      <div ref={categoryDropdownRef} className="relative mx-auto w-full max-w-[260px]">
        <button
          type="button"
          onClick={() => setIsCategoryOpen(open => !open)}
          className="flex w-full items-center justify-between rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-2 text-sm font-semibold text-[var(--page-fg)] shadow-sm backdrop-blur-md hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/25"
        >
          <span className="truncate">{categoryLabel}</span>
          <span className="ml-2 text-xs font-semibold text-[var(--text-subtle)]">{isCategoryOpen ? '▲' : '▼'}</span>
        </button>

        {isCategoryOpen && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] shadow-[0_22px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className={`flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-glass)] ${
                categoryFilter === 'all' ? 'bg-accent/10 text-accent' : 'text-[var(--page-fg)]'
              }`}
            >
              All categories
            </button>

            {filteredCategories.map(category => (
              <button
                type="button"
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex w-full items-center justify-between px-4 py-2 text-sm transition hover:bg-[var(--surface-glass)] ${
                  categoryFilter === category.id ? 'bg-accent/10 font-semibold text-accent' : 'text-[var(--page-fg)]'
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
        )}
      </div>
    </FilterCard>
  )
}

