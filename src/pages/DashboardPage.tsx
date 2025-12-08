import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { Navbar } from '../components/Navbar'
import { getTransactionsFiltered } from '../api/transactions'
import { TransactionsSection } from '../components/TransactionsSection'
import { TabNavigation } from '../components/TabNavigation'
import { TodaySummaryCards } from '../components/TodaySummaryCards'
import { AllTransactionsPage } from '../components/AllTransactions/AllTransactionsPage'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { AddTransactionModal } from '../modals/AddTransactionModal'
import { SettingsModal } from '../modals/SettingsModal'
import { ReportsModal } from '../modals/ReportsModal'
import { logoutSession } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import type { Transaction } from '../types'
import type { TransactionFilters } from '../api/transactions'
import type { AllTransactionsFilters } from '../components/AllTransactions/types'

const transactionKey = ['transactions']

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const [isReportsOpen, setReportsOpen] = useState(false)
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today')
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [todayIncome, setTodayIncome] = useState(0)
  const [todayExpense, setTodayExpense] = useState(0)
  const [todayBalance, setTodayBalance] = useState(0)
  const [allFilters, setAllFilters] = useState<AllTransactionsFilters>({
    startDate: '',
    endDate: '',
    typeFilter: 'all',
    categoryFilter: 'all',
    sortField: 'date',
    sortDirection: 'desc',
  })
  const todayDate = dayjs().format('YYYY-MM-DD')

  const {
    data: todayData,
    isLoading: isTodayLoading,
    isError: isTodayError,
  } = useQuery({
    queryKey: [...transactionKey, 'today', todayDate],
    queryFn: () =>
      getTransactionsFiltered({
        startDate: todayDate,
        endDate: todayDate,
      } as TransactionFilters),
    enabled: isAuthenticated && activeTab === 'today',
  })

  const {
    data: allData,
    isLoading: isAllLoading,
    isError: isAllError,
  } = useQuery({
    queryKey: [...transactionKey, 'all', allFilters],
    queryFn: () =>
      getTransactionsFiltered({
        startDate: allFilters.startDate || undefined,
        endDate: allFilters.endDate || undefined,
        type: allFilters.typeFilter === 'all' ? undefined : allFilters.typeFilter,
        category: allFilters.categoryFilter === 'all' ? undefined : allFilters.categoryFilter,
        sortBy: allFilters.sortField,
        sortDir: allFilters.sortDirection,
      }),
    enabled: isAuthenticated && activeTab === 'all',
  })

  useEffect(() => {
    const items = todayData?.transactions ?? []
    setTodayTransactions(items)
    const income = items.filter(item => item.type === 'income').reduce((total, item) => total + item.amount, 0)
    const expense = items.filter(item => item.type === 'expense').reduce((total, item) => total + item.amount, 0)
    setTodayIncome(income)
    setTodayExpense(expense)
    setTodayBalance(income - expense)
  }, [todayData])

  useEffect(() => {
    setAllTransactions(allData?.transactions ?? [])
  }, [allData])

  const handleTransactionCreated = (transaction: Transaction) => {
    const todayReference = dayjs()
    setAllTransactions(prev => [transaction, ...prev])
    if (dayjs(transaction.date).isSame(todayReference, 'day')) {
      setTodayTransactions(prev => [transaction, ...prev])
      setTodayIncome(prev => prev + (transaction.type === 'income' ? transaction.amount : 0))
      setTodayExpense(prev => prev + (transaction.type === 'expense' ? transaction.amount : 0))
      setTodayBalance(prev => prev + (transaction.type === 'income' ? transaction.amount : -transaction.amount))
    }
  }

  const handleLogout = () => {
    void logoutSession().catch(() => {})
    logout()
    toast.success('Logged out')
    navigate('/', { replace: true })
  }

  const displayName = user?.name?.split(' ')[0] ?? user?.email ?? 'there'

  useEffect(() => {
    if (isTodayError || isAllError) {
      toast.error('Unable to load dashboard data')
    }
  }, [isAllError, isTodayError])

  return (
    <div className="relative min-h-screen bg-background pb-24 text-neutral">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,152,219,0.12),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(46,204,113,0.1),_transparent_55%)]" />
      <Navbar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenReports={() => setReportsOpen(true)}
        onLogout={handleLogout}
        userName={displayName}
      />
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-16 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <TabNavigation
            tabs={[
              { id: 'today' as const, label: "Today's Activity" },
              { id: 'all' as const, label: 'All Transactions' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === 'today' ? (
          <div className="space-y-6">
            <TodaySummaryCards income={todayIncome} expense={todayExpense} balance={todayBalance} />
            <TransactionsSection
              title="Today's Activity"
              transactions={todayTransactions}
              isLoading={isTodayLoading}
              emptyTitle="No activity today"
              emptyDescription="Add a transaction to see it reflected in today's activity."
            />
          </div>
        ) : (
          <AllTransactionsPage
            transactions={allTransactions}
            isLoading={isAllLoading}
            filters={allFilters}
            onFiltersChange={setAllFilters}
          />
        )}
      </main>

      <FloatingActionButton onClick={() => setAddTransactionOpen(true)} />

      <SettingsModal open={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <ReportsModal open={isReportsOpen} onClose={() => setReportsOpen(false)} />
      <AddTransactionModal
        open={isAddTransactionOpen}
        onClose={() => setAddTransactionOpen(false)}
        onTransactionCreated={handleTransactionCreated}
      />
    </div>
  )
}
