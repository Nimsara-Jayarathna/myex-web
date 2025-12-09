import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { getCategories, createCategory, deleteCategory, setDefaultCategory } from '../../api/categories'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorBanner } from '../../components/ErrorBanner'
import { mapApiError } from '../../utils/errors'
import type { Category } from '../../types'
import { CategoryForm } from './CategoryForm'
import { DefaultCategories } from './DefaultCategories'
import { CategoriesGrid } from './CategoriesGrid'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

const categoryKey = ['categories']

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [defaultIncomeId, setDefaultIncomeId] = useState('')
  const [defaultExpenseId, setDefaultExpenseId] = useState('')
  const [uiError, setUiError] = useState<{ message: string; detail?: string } | null>(null)

  const {
    data: categories,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: categoryKey,
    queryFn: getCategories,
    enabled: open,
    retry: 1,
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
      setUiError(null)
    },
    onError: error => setUiError(mapApiError(error)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success('Category removed')
      queryClient.invalidateQueries({ queryKey: categoryKey })
      setUiError(null)
    },
    onError: error => setUiError(mapApiError(error)),
  })

  const setDefaultMutation = useMutation({
    mutationFn: (categoryId: string) => setDefaultCategory(categoryId),
    onSuccess: () => {
      toast.success('Default category updated')
      queryClient.invalidateQueries({ queryKey: categoryKey })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setUiError(null)
    },
    onError: error => setUiError(mapApiError(error)),
  })

  useEffect(() => {
    const incomeDefault = incomeCategories.find(item => item.isDefault)
    const expenseDefault = expenseCategories.find(item => item.isDefault)
    setDefaultIncomeId(incomeDefault ? resolveCategoryId(incomeDefault) : '')
    setDefaultExpenseId(expenseDefault ? resolveCategoryId(expenseDefault) : '')
  }, [categories, expenseCategories, incomeCategories])

  useEffect(() => {
    if (open) {
      setUiError(null)
    }
  }, [open])

  const handleDefaultSelect = (categoryId: string, categoryType: 'income' | 'expense') => {
    if (!categoryId) return
    if (categoryType === 'income') {
      if (categoryId === defaultIncomeId) return
      setDefaultIncomeId(categoryId)
    } else {
      if (categoryId === defaultExpenseId) return
      setDefaultExpenseId(categoryId)
    }
    setDefaultMutation.mutate(categoryId)
  }

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
        {uiError || isError ? (
          <div className="flex justify-center">
            <ErrorBanner
              message={(uiError ?? mapApiError(error)).message}
              detail={(uiError ?? mapApiError(error)).detail}
              onRetry={isError ? () => refetch() : undefined}
              className="w-full max-w-2xl"
            />
          </div>
        ) : null}

        <CategoryForm
          name={name}
          type={type}
          isSaving={createMutation.isPending}
          onChangeName={setName}
          onChangeType={setType}
          onSubmit={handleSubmit}
        />

        <DefaultCategories
          incomeCategories={incomeCategories}
          expenseCategories={expenseCategories}
          defaultIncomeId={defaultIncomeId}
          defaultExpenseId={defaultExpenseId}
          isUpdating={setDefaultMutation.isPending}
          onChangeDefault={handleDefaultSelect}
          resolveCategoryId={resolveCategoryId}
        />

        <CategoriesGrid
          isLoading={isLoading}
          isFetching={isFetching}
          categories={categories ?? []}
          deleteMutation={deleteMutation}
          resolveCategoryId={resolveCategoryId}
          onDelete={handleDelete}
        />
      </div>
    </Modal>
  )
}

