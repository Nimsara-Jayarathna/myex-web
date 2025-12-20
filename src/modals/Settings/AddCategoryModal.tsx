import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { createCategory } from '../../api/categories'
import { mapApiError } from '../../utils/errors'

interface AddCategoryModalProps {
  open: boolean
  onClose: () => void
}

const categoryKey = ['categories']

export const AddCategoryModal = ({ open, onClose }: AddCategoryModalProps) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [uiError, setUiError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName('')
      setUiError(null)
    }
  }, [open])

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; type: 'income' | 'expense' }) => createCategory(payload),
    onSuccess: () => {
      toast.success('Category created')
      queryClient.invalidateQueries({ queryKey: categoryKey })
      setUiError(null)
      setName('')
      onClose()
    },
    onError: error => {
      const mapped = mapApiError(error)
      setUiError(mapped.message)
      toast.error(mapped.message)
    },
  })

  const handleSave = (type: 'income' | 'expense') => {
    const trimmed = name.trim()
    if (!trimmed) {
      setUiError('Category name is required')
      return
    }
    setUiError(null)
    createMutation.mutate({ name: trimmed, type })
  }

  const isSaving = createMutation.isPending

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Category"
      subtitle="Give your category a name, then choose whether it tracks income or expenses."
      widthClassName="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="new-category-name" className="text-sm font-semibold text-[var(--page-fg)]">
            Category name
          </label>
          <input
            id="new-category-name"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
            disabled={isSaving}
            maxLength={18}
            className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-subtle)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="e.g. Groceries, Rent, Salary"
          />
          {uiError ? <p className="text-xs font-medium text-expense/90">{uiError}</p> : null}
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-3 text-xs text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Type</span>
          <p>Select whether this category is used for money coming in or going out.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('income')}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-income px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#28A55C] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? <Spinner size="sm" /> : null}
            <span>Save as income</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('expense')}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-expense px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#C63E32] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? <Spinner size="sm" /> : null}
            <span>Save as expense</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
