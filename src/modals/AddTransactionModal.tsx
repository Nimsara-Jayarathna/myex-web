import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { getCategories } from '../api/categories'
import { createTransaction } from '../api/transactions'
import type { Transaction } from '../types'

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  onTransactionCreated?: (transaction: Transaction) => void
}

const categoryKey = ['categories']
const transactionKey = ['transactions']
const summaryKey = ['summary']
type AddTransactionStep = 'chooseType' | 'details'

export const AddTransactionModal = ({ open, onClose, onTransactionCreated }: AddTransactionModalProps) => {
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
  const [step, setStep] = useState<AddTransactionStep>('chooseType')
  const resolveCategoryId = (item?: { _id?: string; id?: string }) => item?._id ?? item?.id ?? ''
  const filteredCategories = useMemo(
    () => (categories ?? []).filter(item => item.type === type),
    [categories, type],
  )

  useEffect(() => {
    if (open) {
      setStep('chooseType')
      setType('expense')
      setDate(dayjs().format('YYYY-MM-DD'))
      setAmount('')
      setCategory('')
      setNote('')
    }
  }, [open])

  useEffect(() => {
    if (step !== 'details') {
      setCategory('')
      return
    }
    if (!filteredCategories.length) {
      setCategory('')
      return
    }
    setCategory(previous => {
      const stillValid = filteredCategories.some(item => resolveCategoryId(item) === previous)
      if (stillValid) {
        return previous
      }
      return resolveCategoryId(filteredCategories[0])
    })
  }, [filteredCategories, step])

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: transaction => {
      toast.success('Transaction added')
      queryClient.invalidateQueries({ queryKey: transactionKey })
      queryClient.invalidateQueries({ queryKey: summaryKey })
      onTransactionCreated?.(transaction)
      setAmount('')
      setNote('')
      onClose()
    },
    onError: () => toast.error('Unable to add transaction'),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step !== 'details') {
      return
    }
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

  const handleChooseType = (selectedType: 'income' | 'expense') => {
    setType(selectedType)
    setStep('details')
  }

  const handleBackToType = () => {
    setStep('chooseType')
    setCategory('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Transaction"
      subtitle={
        step === 'chooseType'
          ? 'Is this money coming in or going out?'
          : 'Track every income or expense with the details below.'
      }
      widthClassName={step === 'chooseType' ? 'max-w-md' : 'max-w-xl'}
    >
      {step === 'chooseType' ? (
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {(['income', 'expense'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleChooseType(option)}
                className={`flex flex-col gap-3 rounded-3xl border border-border bg-white/85 px-6 py-5 text-left shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] transition ${
                  option === 'income'
                    ? 'hover:border-income/40 hover:shadow-[0_24px_55px_-30px_rgba(46,204,113,0.55)]'
                    : 'hover:border-expense/40 hover:shadow-[0_24px_55px_-30px_rgba(231,76,60,0.55)]'
                }`}
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border px-3 text-lg font-semibold ${
                    option === 'income'
                      ? 'border-income/30 bg-income/10 text-income'
                      : 'border-expense/30 bg-expense/10 text-expense'
                  }`}
                >
                  {option === 'income' ? '+' : '-'}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold capitalize text-neutral">{option}</h3>
                  <p className="text-sm text-muted">
                    {option === 'income'
                      ? 'Log paychecks, sales, refunds, or unexpected inflows.'
                      : 'Capture spending, bills, or one-off costs.'}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted">
            Need a new category? Head to Settings to create one before logging it here.
          </p>
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-neutral shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-muted">Logging</span>
              <p className="text-base font-semibold capitalize text-neutral">{type}</p>
            </div>
            <button
              type="button"
              onClick={handleBackToType}
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

          <div className="flex flex-col gap-3 text-sm text-neutral">
            <span>Category</span>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map(item => {
                const id = resolveCategoryId(item)
                const isActive = category === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCategory(id)}
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
          {!categories?.length ? (
            <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs text-accent">
              You need at least one category. Create one in Settings first.
            </p>
          ) : null}
          {Boolean(categories?.length) && !filteredCategories.length ? (
            <p className="rounded-2xl border border-border bg-surfaceMuted/60 px-4 py-2 text-xs text-muted">
              No {type} categories yet. Switch type or add one in Settings.
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
            disabled={mutation.isPending || !filteredCategories.length}
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
      )}
    </Modal>
  )
}
