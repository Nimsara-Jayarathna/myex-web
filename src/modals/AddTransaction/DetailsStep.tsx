import type { FormEvent } from 'react'
import { Spinner } from '../../components/Spinner'

interface CategoryShape {
  _id?: string
  id?: string
  name: string
  type: 'income' | 'expense'
}

interface DetailsStepProps {
  type: 'income' | 'expense'
  amount: string
  date: string
  note: string
  categories: CategoryShape[]
  filteredCategories: CategoryShape[]
  selectedCategoryId: string
  isSubmitting: boolean
  onChangeAmount: (value: string) => void
  onChangeDate: (value: string) => void
  onChangeNote: (value: string) => void
  onChangeCategory: (value: string) => void
  onBack: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const resolveCategoryId = (item?: { _id?: string; id?: string }) => item?._id ?? item?.id ?? ''

export const DetailsStep = ({
  type,
  amount,
  date,
  note,
  categories,
  filteredCategories,
  selectedCategoryId,
  isSubmitting,
  onChangeAmount,
  onChangeDate,
  onChangeNote,
  onChangeCategory,
  onBack,
  onSubmit,
}: DetailsStepProps) => (
  <form className="flex flex-col gap-5" onSubmit={onSubmit}>
    <div className="flex items-center justify-between rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-neutral shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-muted">Logging</span>
        <p className="text-base font-semibold capitalize text-neutral">{type}</p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="rounded-full border border-border bg-white px-4 py-1 text-xs font-medium text-muted transition hover:border-accent/40 hover:text-accent"
      >
        Change type
      </button>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm text-neutral">
        Amount
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={event => onChangeAmount(event.target.value)}
          className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="0.00"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-neutral">
        Date
        <input
          type="date"
          value={date}
          onChange={event => onChangeDate(event.target.value)}
          className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-neutral focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </label>
    </div>

    <div className="flex flex-col gap-3 text-sm text-neutral">
      <span>Category</span>
      <div className="flex flex-wrap gap-2">
        {filteredCategories.map(item => {
          const id = resolveCategoryId(item)
          const isActive = selectedCategoryId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeCategory(id)}
              className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'border-accent bg-accent text-white shadow-[0_12px_40px_-20px_rgba(52,152,219,0.6)]'
                  : 'border-border bg-white text-muted hover:border-accent/40 hover:text-neutral'
              }`}
            >
              {item.name}
            </button>
          )
        })}
      </div>
    </div>
    {!categories.length ? (
      <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs text-accent">
        You need at least one category. Create one in Settings first.
      </p>
    ) : null}
    {Boolean(categories.length) && !filteredCategories.length ? (
      <p className="rounded-2xl border border-border bg-surfaceMuted/60 px-4 py-2 text-xs text-muted">
        No {type} categories yet. Switch type or add one in Settings.
      </p>
    ) : null}

    <label className="flex flex-col gap-2 text-sm text-neutral">
      Note
      <textarea
        value={note}
        onChange={event => onChangeNote(event.target.value)}
        rows={3}
        placeholder="Optional note about this transaction"
        className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </label>

    <button
      type="submit"
      className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2F89C9] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isSubmitting || !filteredCategories.length}
    >
      {isSubmitting ? (
        <>
          <Spinner size="sm" />
          <span>Saving...</span>
        </>
      ) : (
        <span>{!categories.length ? 'Add a category first' : 'Save transaction'}</span>
      )}
    </button>
  </form>
)

