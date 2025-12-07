import { type FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { getCategories, createCategory, deleteCategory } from '../api/categories'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { Category } from '../types'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

const categoryKey = ['categories']

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('income')

  const { data: categories, isLoading, isFetching } = useQuery({
    queryKey: categoryKey,
    queryFn: getCategories,
    enabled: open,
  })

  const resolveCategoryId = (category: Category) => category._id ?? category.id ?? ''

  const incomeCategories = useMemo(
    () => (categories ?? []).filter(item => item.type === 'income'),
    [categories],
  )

  const expenseCategories = useMemo(
    () => (categories ?? []).filter(item => item.type === 'expense'),
    [categories],
  )

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created')
      setName('')
      queryClient.invalidateQueries({ queryKey: categoryKey })
    },
    onError: () => toast.error('Unable to create category'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success('Category removed')
      queryClient.invalidateQueries({ queryKey: categoryKey })
    },
    onError: () => toast.error('Unable to remove category'),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      toast.error('Category name is required')
      return
    }
    createMutation.mutate({ name: name.trim(), type })
  }

  const handleDelete = (category: Category) => {
    const identifier = resolveCategoryId(category)
    if (!identifier) {
      toast.error('Unable to delete category: missing identifier')
      return
    }
    deleteMutation.mutate(identifier)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Manage Categories"
      subtitle="Create and organize your income and expense categories."
      widthClassName="max-w-4xl"
    >
      <div className="space-y-5">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-3xl border border-border bg-gradient-to-br from-white via-white/95 to-surfaceMuted/70 p-5 shadow-sm md:grid-cols-[2fr_1fr]"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="category-name" className="text-sm font-semibold text-neutral">
              Category name
            </label>
            <input
              id="category-name"
              name="name"
              value={name}
              onChange={event => setName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="e.g. Groceries"
            />
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Type</span>
            <div className="inline-flex rounded-full border border-border bg-white shadow-soft">
              {(['income', 'expense'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  className={`px-4 py-2 text-sm font-semibold capitalize transition first:rounded-l-full last:rounded-r-full ${
                    type === option
                      ? 'bg-accent text-white shadow-[0_12px_35px_-20px_rgba(52,152,219,0.6)]'
                      : 'text-neutral hover:bg-accent/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2F89C9] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
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

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-neutral shadow-soft">
            Income: <span className="rounded-full bg-income/15 px-2 py-0.5 text-income">{incomeCategories.length}</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-neutral shadow-soft">
            Expense:{' '}
            <span className="rounded-full bg-expense/15 px-2 py-0.5 text-expense">{expenseCategories.length}</span>
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-border/60 bg-white/70 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-muted">
          <span>Existing categories</span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium text-muted transition hover:border-accent/40 hover:text-accent"
            onClick={() => queryClient.invalidateQueries({ queryKey: categoryKey })}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Spinner size="sm" />
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Income categories',
                  description: 'Streams bringing money in.',
                  accent: 'income' as const,
                  items: incomeCategories,
                },
                {
                  title: 'Expense categories',
                  description: 'Places where money goes out.',
                  accent: 'expense' as const,
                  items: expenseCategories,
                },
              ].map(column => {
                const isIncome = column.accent === 'income'
                const badgeClasses = isIncome
                  ? 'border-income/40 bg-income/15 text-income'
                  : 'border-expense/40 bg-expense/15 text-expense'
                const emptyState = isIncome
                  ? 'No income categories yet. Add one above.'
                  : 'No expense categories yet. Add one above.'

                return (
                  <div
                    key={column.title}
                    className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border bg-white/90 p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.25)] backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-neutral">{column.title}</h3>
                        <p className="text-xs text-muted">{column.description}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium ${
                          isIncome
                            ? 'border-income/40 bg-income/10 text-income'
                            : 'border-expense/40 bg-expense/10 text-expense'
                        }`}
                      >
                        {column.items.length}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {column.items.length ? (
                        column.items.map(category => {
                          const categoryId = resolveCategoryId(category)
                          const isDeleting =
                            deleteMutation.isPending && deleteMutation.variables === categoryId
                          const initials = category.name?.[0]?.toUpperCase() ?? '?'
                          const removeButtonClasses =
                            'border-expense/30 text-expense hover:border-expense/50 hover:bg-expense/10'
                          return (
                            <li
                              key={categoryId}
                              className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-white/90 px-4 py-3 text-sm text-neutral shadow-[0_18px_45px_-35px_rgba(15,23,42,0.3)] transition hover:border-accent/40 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold ${badgeClasses}`}
                                >
                                  {initials}
                                </span>
                                <div className="flex flex-col">
                                  <span className="font-medium text-neutral">{category.name}</span>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                                    <span className="uppercase tracking-[0.25em]">
                                      {category.type}
                                    </span>
                                    {category.isDefault ? (
                                      <span className="rounded-full bg-surfaceMuted px-2 py-0.5 text-[11px] font-medium text-muted">
                                        Default
                                      </span>
                                    ) : null}
                                    {category.isActive === false ? (
                                      <span className="rounded-full bg-border px-2 py-0.5 text-[11px] font-medium text-muted">
                                        Inactive
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDelete(category)}
                                className={`inline-flex items-center gap-1 self-end rounded-full border px-3 py-1 text-xs font-medium transition sm:self-center ${removeButtonClasses}`}
                                disabled={isDeleting}
                              >
                                {isDeleting ? <Spinner size="sm" /> : null}
                                Remove
                              </button>
                            </li>
                          )
                        })
                      ) : (
                        <li className="rounded-2xl border border-dashed border-border bg-white/70 px-4 py-6 text-center text-xs text-muted">
                          {emptyState}
                        </li>
                      )}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      </div>
    </Modal>
  )
}
