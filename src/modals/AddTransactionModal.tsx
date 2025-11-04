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

  useEffect(() => {
    if (open) {
      setDate(dayjs().format('YYYY-MM-DD'))
    }
  }, [open])

  useEffect(() => {
    if (categories && categories.length && !category) {
      setCategory(categories[0]._id)
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
          <label className="flex flex-col gap-2 text-sm text-white">
            Amount
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              placeholder="0.00"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white">
            Date
            <input
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none"
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
                  ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-sky-500/40 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-2 text-sm text-white">
          Category
          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none"
            disabled={!categories?.length}
          >
            {categories?.map(item => (
              <option key={item._id} value={item._id}>
                {item.name} - {item.type}
              </option>
            ))}
            {!categories?.length ? <option value="">No categories found</option> : null}
          </select>
        </label>
        {!categories?.length ? (
          <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-100">
            You need at least one category. Create one in Settings first.
          </p>
        ) : null}

        <label className="flex flex-col gap-2 text-sm text-white">
          Note
          <textarea
            value={note}
            onChange={event => setNote(event.target.value)}
            rows={3}
            placeholder="Optional note about this transaction"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
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
