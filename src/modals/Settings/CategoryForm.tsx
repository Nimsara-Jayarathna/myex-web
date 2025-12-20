import type { FormEvent } from 'react'
import { Spinner } from '../../components/Spinner'

interface CategoryFormProps {
  name: string
  type: 'income' | 'expense'
  isSaving: boolean
  onChangeName: (value: string) => void
  onChangeType: (type: 'income' | 'expense') => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const CategoryForm = ({ name, type, isSaving, onChangeName, onChangeType, onSubmit }: CategoryFormProps) => (
  <form
    onSubmit={onSubmit}
    className="grid gap-4 rounded-3xl border border-[var(--border-soft)] bg-gradient-to-br from-[var(--surface-1)] via-[var(--surface-2)] to-[var(--surface-4)] p-5 shadow-sm md:grid-cols-[3fr_2fr] md:items-end"
  >
    <div className="flex flex-col gap-2 md:pr-2">
      <label htmlFor="category-name" className="text-sm font-semibold text-[var(--page-fg)]">
        Category name
      </label>
      <input
        id="category-name"
        name="name"
        value={name}
        onChange={event => onChangeName(event.target.value)}
        maxLength={12}
        className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-subtle)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        placeholder="e.g. Groceries"
      />
    </div>
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Type</span>
      </div>
      <div className="inline-flex rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-soft">
        {(['income', 'expense'] as const).map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onChangeType(option)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition first:rounded-l-full last:rounded-r-full ${
              type === option
                ? 'bg-accent text-white shadow-[0_12px_35px_-20px_rgba(52,152,219,0.6)]'
                : 'text-[var(--page-fg)] hover:bg-accent/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2F89C9] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Spinner size="sm" />
            <span>Saving...</span>
          </>
        ) : (
          <span>Add category</span>
        )}
      </button>
    </div>
  </form>
)
