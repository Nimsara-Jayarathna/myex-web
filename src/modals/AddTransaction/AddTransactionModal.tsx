import { type FormEvent, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { Modal } from '../../components/Modal'
import { createTransaction } from '../../api/transactions'
import type { Transaction } from '../../types'
import { getCategories } from '../../api/categories'

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  onTransactionCreated?: (transaction: Transaction) => void
}

const transactionKey = ['transactions']
const summaryKey = ['summary']
type AddTransactionStep = 1 | 2

export const AddTransactionModal = ({ open, onClose, onTransactionCreated }: AddTransactionModalProps) => {
  const queryClient = useQueryClient()

  const [amount, setAmount] = useState('')
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [categories, setCategories] = useState<{ id: string; name: string; type: 'income' | 'expense'; isDefault?: boolean }[]>([])
  const [filteredCategories, setFilteredCategories] = useState<{ id: string; name: string; type: 'income' | 'expense'; isDefault?: boolean }[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const [step, setStep] = useState<AddTransactionStep>(1)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setTransactionType('expense')
      setDate(dayjs().format('YYYY-MM-DD'))
      setAmount('')
      setSelectedCategory('')
      setNote('')
    }
  }, [open])

  useEffect(() => {
    if (step !== 2) return

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const result = await getCategories()
        const mapped = (result ?? []).map(item => ({
          id: item.id ?? item._id ?? item.name,
          name: item.name,
          type: item.type,
          isDefault: item.isDefault,
        }))
        setCategories(mapped)
      } catch {
        toast.error('Unable to load categories')
      } finally {
        setIsLoadingCategories(false)
      }
    }

    void loadCategories()
  }, [step])

  useEffect(() => {
    if (!categories.length) {
      setFilteredCategories([])
      setSelectedCategory('')
      return
    }

    const nextFiltered = categories.filter(category => category.type === transactionType)
    setFilteredCategories(nextFiltered)

    if (!nextFiltered.length) {
      setSelectedCategory('')
      return
    }

    const defaultForType = nextFiltered.find(category => category.isDefault)
    setSelectedCategory(defaultForType?.id ?? nextFiltered[0]?.id ?? '')
  }, [categories, transactionType])

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
    const numericAmount = Number(amount)
    if (!numericAmount || Number.isNaN(numericAmount)) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!selectedCategory) {
      toast.error('Select a category')
      return
    }

    mutation.mutate({
      amount: numericAmount,
      type: transactionType,
      category: selectedCategory,
      date,
      note: note.trim() ? note.trim() : undefined,
    })
  }

  const handleSelectTypeAndContinue = (selectedType: 'income' | 'expense') => {
    const numericAmount = Number(amount)
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Enter a valid amount first')
      return
    }
    setTransactionType(selectedType)
    setStep(2)
  }

  const handleBackToStepOne = () => {
    setStep(1)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Transaction"
      subtitle="Quickly log income or expenses in two simple steps."
      widthClassName={step === 1 ? 'max-w-md' : 'max-w-xl'}
    >
      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-sm text-neutral">
            Amount
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              className="rounded-2xl border border-border bg-white px-4 py-3 text-2xl font-semibold text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="0.00"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['income', 'expense'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectTypeAndContinue(option)}
                className={`flex flex-col gap-3 rounded-3xl border border-border bg-white/90 px-6 py-5 text-left shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] transition ${
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
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-neutral shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToStepOne}
                className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted transition hover:border-accent/40 hover:text-accent"
              >
                ← Back
              </button>
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Amount</span>
                <span className="text-sm font-semibold text-neutral">{amount || '0.00'}</span>
              </span>
            </div>
            <div className="inline-flex rounded-full border border-border bg-white shadow-soft">
              {(['income', 'expense'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTransactionType(option)}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition first:rounded-l-full last:rounded-r-full ${
                    transactionType === option
                      ? option === 'income'
                        ? 'bg-income text-white'
                        : 'bg-expense text-white'
                      : 'text-muted hover:bg-accent/5'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-neutral">Category</span>
            {isLoadingCategories ? (
              <p className="rounded-2xl border border-border bg-surfaceMuted/60 px-4 py-2 text-xs text-muted">
                Loading categories...
              </p>
            ) : !filteredCategories.length ? (
              <p className="rounded-2xl border border-dashed border-border bg-white/70 px-4 py-2 text-xs text-muted">
                No categories for this type. Create one in Settings first.
              </p>
            ) : (
              // -------------------------------------------------------------
              // UPDATED GRID: 5 columns per row, gap-3 for balanced spacing
              // -------------------------------------------------------------
              <div className="grid grid-cols-5 gap-3">
                {filteredCategories.slice(0, 10).map(category => {
                  const isSelected = selectedCategory === category.id
                  const isDefaultForType = Boolean(category.isDefault)
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      // Updated button style:
                      // - h-full: ensures equal height
                      // - flex-col: centers text better in narrow columns
                      // - justify-center: vertical centering
                      // - px-1: prevents padding overflow
                      className={`relative flex h-full min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 text-center text-xs font-medium transition ${
                        isSelected
                          ? 'border-accent bg-accent text-white shadow-md'
                          : 'border-border bg-white text-muted hover:border-accent/40 hover:text-neutral'
                      }`}
                    >
                      {/* Optional: Checkmark absolutely positioned to save space in the center */}
                      {isSelected && (
                        <span className="absolute right-1 top-1 text-[9px] leading-none opacity-80">✓</span>
                      )}
                      
                      <span className="w-full truncate px-1 leading-tight">{category.name}</span>

                      {isDefaultForType && (
                        <span className="absolute left-1 top-1 text-[9px] leading-none text-yellow-400" title="Default category">
                          ★
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <label className="flex flex-col gap-2 text-sm text-neutral">
            <span className="flex items-center gap-2">
              <span>Date</span>
              {date === dayjs().format('YYYY-MM-DD') ? (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                  Today
                </span>
              ) : null}
            </span>
            <input
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
              className={`rounded-2xl border px-4 py-3 text-sm text-neutral focus:outline-none focus:ring-2 ${
                date === dayjs().format('YYYY-MM-DD')
                  ? 'border-accent bg-accent/5 focus:border-accent focus:ring-accent/40'
                  : 'border-border bg-white focus:border-accent focus:ring-accent/30'
              }`}
            />
          </label>

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
            disabled={mutation.isPending || isLoadingCategories || !filteredCategories.length}
          >
            {mutation.isPending ? (
              <span>Saving...</span>
            ) : (
              <span>Add Transaction</span>
            )}
          </button>
        </form>
      )}
    </Modal>
  )
}