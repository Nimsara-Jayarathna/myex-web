import { apiClient } from './client'
import type { SummaryResponse, Transaction, TransactionInput } from '../types'

type TransactionApiShape = Transaction & {
  _id?: string
  id?: string
  category?: Transaction['category']
  title?: string
}

type TransactionsResponse = TransactionApiShape[] | { transactions: TransactionApiShape[] }

const normalizeTransaction = (transaction: TransactionApiShape): Transaction => {
  const identifier = transaction._id ?? transaction.id
  const category =
    typeof transaction.category === 'string'
      ? transaction.category
      : transaction.category?.name ?? transaction.category
  return {
    ...transaction,
    _id: identifier,
    id: identifier,
    category,
    categoryName: transaction.categoryName ?? (typeof category === 'string' ? category : undefined),
    title: transaction.title ?? (typeof category === 'string' ? category : transaction.title),
  }
}

const extractTransactions = (data: TransactionsResponse): TransactionApiShape[] => {
  if (Array.isArray(data)) {
    return data
  }
  if (data?.transactions) {
    return data.transactions
  }
  return []
}

export const getTransactions = async () => {
  const { data } = await apiClient.get<TransactionsResponse>('/api/transactions')
  return extractTransactions(data).map(normalizeTransaction)
}

export const createTransaction = async (payload: TransactionInput) => {
  const { data } = await apiClient.post<TransactionApiShape | { transaction: TransactionApiShape }>(
    '/api/transactions',
    payload,
  )

  if (!data) {
    throw new Error('Transaction response missing')
  }

  if ('transaction' in data && data.transaction) {
    return normalizeTransaction(data.transaction)
  }

  return normalizeTransaction(data as TransactionApiShape)
}

export const getTransactionSummary = async () => {
  const { data } = await apiClient.get<SummaryResponse>('/api/transactions/summary')
  return data
}
