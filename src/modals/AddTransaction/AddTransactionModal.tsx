import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { getCategories } from '../../api/categories'
import { createTransaction } from '../../api/transactions'
import type { Transaction } from '../../types'
import { ChooseTypeStep } from './ChooseTypeStep'
import { DetailsStep } from './DetailsStep'

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

  const defaultCategoryId = useMemo(() => {
    const defaultCategory = filteredCategories.find(item => item.isDefault)
    return resolveCategoryId(defaultCategory)
  }, [filteredCategories])

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
      if (defaultCategoryId) {
        return defaultCategoryId
      }
      return resolveCategoryId(filteredCategories[0])
    })
  }, [defaultCategoryId, filteredCategories, step])

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
        <ChooseTypeStep onChooseType={handleChooseType} />
      ) : (
        <DetailsStep
          type={type}
          amount={amount}
          date={date}
          note={note}
          categories={categories ?? []}
          filteredCategories={filteredCategories}
          selectedCategoryId={category}
          isSubmitting={mutation.isPending}
          onChangeAmount={setAmount}
          onChangeDate={setDate}
          onChangeNote={setNote}
          onChangeCategory={setCategory}
          onBack={handleBackToType}
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  )
}

