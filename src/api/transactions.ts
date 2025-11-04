import { apiClient } from './client'
import type { SummaryResponse, Transaction, TransactionInput } from '../types'

export const getTransactions = async () => {
  const { data } = await apiClient.get<Transaction[]>('/api/transactions')
  return data
}

export const createTransaction = async (payload: TransactionInput) => {
  const { data } = await apiClient.post<Transaction>('/api/transactions', payload)
  return data
}

export const getTransactionSummary = async () => {
  const { data } = await apiClient.get<SummaryResponse>('/api/transactions/summary')
  return data
}
