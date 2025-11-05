import { type FormEvent, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { getCategories } from '../api/categories'
import { createTransaction } from '../api/transactions'

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
}

const categoryKey = ['categories']
const transactionKey = ['transactions']
const summaryKey = ['summary']

export const AddTransactionModal = ({ open, onClose }: AddTransactionModalProps) => {
  const queryClient = useQueryClient()
  const { data: categories } = useQuery({
    queryKey: categoryKey,
    queryFn: getCategories,
    enabled: open,
  })

  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const resolveCategoryId = (item?: { _id?: string; id?: string }) => item?._id ?? item?.id ?? ''

  useEffect(() => {
    if (open) {
      setDate(dayjs().format('YYYY-MM-DD'))
    }
  }, [open])

  useEffect(() => {
    if (categories && categories.length && !category) {
      const firstCategoryId = resolveCategoryId(categories[0])
      if (firstCategoryId) {
        setCategory(firstCategoryId)
      }
    }
  }, [categories, category])

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transaction added')
      queryClient.invalidateQueries({ queryKey: transactionKey })
      queryClient.invalidateQueries({ queryKey: summaryKey })
      setAmount('')
      setNote('')
      onClose()
    },
    onError: () => toast.error('Unable to add transaction'),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericAmount = Number(amount)
    if (!numericAmount || Number.isNaN(numericAmount)) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!category) {
      toast.error('Select a category')
      return
    }
    mutation.mutate({
      amount: numericAmount,
      type,
      category,
      date,
      note: note.trim() ? note.trim() : undefined,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Transaction"
      subtitle="Track every income or expense to keep your finances transparent."
      widthClassName="max-w-xl"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-neutral">
            Amount
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="0.00"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-neutral">
            Date
            <input
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
              className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-neutral focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          {(['income', 'expense'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={`rounded-2xl border px-4 py-2 text-sm font-medium capitalize transition ${
                type === option
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-white text-muted hover:border-accent/40 hover:text-neutral'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-2 text-sm text-neutral">
          Category
          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-neutral focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            disabled={!categories?.length}
          >
            {categories?.map(item => (
              <option key={resolveCategoryId(item)} value={resolveCategoryId(item)}>
                {item.name} - {item.type}
              </option>
            ))}
            {!categories?.length ? <option value="">No categories found</option> : null}
          </select>
        </label>
        {!categories?.length ? (
          <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs text-accent">
            You need at least one category. Create one in Settings first.
          </p>
        ) : null}

        <label className="flex flex-col gap-2 text-sm text-neutral">
          Note
          <textarea
            value={note}
            onChange={event => setNote(event.target.value)}
            rows={3}
            placeholder="Optional note about this transaction"
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2F89C9] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={mutation.isPending || !categories?.length}
        >
          {mutation.isPending ? (
            <>
              <Spinner size="sm" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{!categories?.length ? 'Add a category first' : 'Save transaction'}</span>
          )}
        </button>
      </form>
    </Modal>
  )
}
