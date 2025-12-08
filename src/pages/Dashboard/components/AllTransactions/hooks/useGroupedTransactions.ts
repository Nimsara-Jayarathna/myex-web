import { useMemo } from 'react'
import dayjs from 'dayjs'
import type { Transaction } from '../../../../../types'
import type { GroupedTransactions, Grouping } from '../types'

export const useGroupedTransactions = (
  transactions: Transaction[],
  grouping: Grouping
): GroupedTransactions[] | null => {
  return useMemo(() => {
    if (grouping === 'none') return null

    const buckets = new Map<string, Transaction[]>()
    transactions.forEach(txn => {
      let key: string
      if (grouping === 'month') {
        key = dayjs(txn.date).format('MMMM YYYY')
      } else {
        key =
          typeof txn.category === 'string'
            ? txn.category || txn.categoryName || txn.title || 'Uncategorised'
            : txn.category?.name ?? txn.categoryName ?? txn.title ?? 'Uncategorised'
      }
      if (!buckets.has(key)) buckets.set(key, [])
      buckets.get(key)!.push(txn)
    })

    return Array.from(buckets.entries()).map(([label, items]) => ({ label, items }))
  }, [grouping, transactions])
}

