import type { TransactionTypeFilter } from '../types'
import { FilterCard } from './FilterCard'

interface TypeFilterProps {
  typeFilter: TransactionTypeFilter
  onChangeType: (value: TransactionTypeFilter) => void
}

export const TypeFilter = ({ typeFilter, onChangeType }: TypeFilterProps) => (
  <FilterCard title="Type">
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(['all', 'income', 'expense'] as const).map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onChangeType(option)}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            typeFilter === option
              ? 'border-accent bg-accent text-white shadow-md'
              : 'border-[var(--border-glass)] bg-[var(--surface-glass)] text-[var(--page-fg)] hover:border-accent/50 hover:text-accent'
          }`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  </FilterCard>
)

