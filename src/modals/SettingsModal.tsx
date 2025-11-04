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

  const handleDelete = (category: Category) => {
    deleteMutation.mutate(category._id)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Manage Categories"
      subtitle="Create and organize your income and expense categories."
      widthClassName="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-slate-900/40 to-transparent p-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="category-name" className="text-sm font-medium text-white">
            Category name
          </label>
          <input
            id="category-name"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
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
                  ? 'border-sky-400/60 bg-sky-500/20 text-sky-100 shadow-inner shadow-sky-500/40'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/60 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
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
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
          <span>Existing categories</span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-white"
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
              const isDeleting = deleteMutation.isPending && deleteMutation.variables === category._id
              return (
                <li
                  key={category._id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-500/10"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{category.name}</span>
                    <span className="text-xs uppercase tracking-wide text-slate-400">{category.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-200 transition hover:border-rose-300 hover:bg-rose-500/20 hover:text-rose-100"
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Spinner size="sm" /> : null}
                    Remove
                  </button>
                </li>
              )
            })}
            {categories?.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-xs text-slate-400">
                No categories yet. Create one above.
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </Modal>
  )
}
