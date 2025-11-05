import { type FormEvent, useState } from 'react'
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

  const resolveCategoryId = (category: Category) => category._id ?? category.id ?? ''

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
      widthClassName="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-3xl border border-border bg-white/90 p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="category-name" className="text-sm font-medium text-neutral">
            Category name
          </label>
          <input
            id="category-name"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="e.g. Groceries"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {(['income', 'expense'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={`rounded-2xl border px-4 py-2 text-sm font-medium capitalize transition ${
                type === option
                  ? 'border-accent bg-accent/10 text-accent shadow-inner shadow-accent/20'
                  : 'border-border bg-white text-muted hover:border-accent/40 hover:text-neutral'
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
      </form>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted">
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
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {categories?.map(category => {
              const categoryId = resolveCategoryId(category)
              const isDeleting = deleteMutation.isPending && deleteMutation.variables === categoryId
              return (
                <li
                  key={categoryId}
                  className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted transition hover:border-accent/40 hover:bg-surfaceMuted"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral">{category.name}</span>
                    <span className="text-xs uppercase tracking-wide text-muted/70">{category.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="inline-flex items-center gap-1 rounded-full border border-expense/30 px-3 py-1 text-xs font-medium text-expense transition hover:border-expense/50 hover:bg-expense/10"
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Spinner size="sm" /> : null}
                    Remove
                  </button>
                </li>
              )
            })}
            {categories?.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-border bg-white/80 px-4 py-6 text-center text-xs text-muted">
                No categories yet. Create one above.
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </Modal>
  )
}
