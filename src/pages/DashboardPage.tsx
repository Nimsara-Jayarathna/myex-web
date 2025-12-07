import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendDown, faArrowTrendUp, faWallet } from '@fortawesome/free-solid-svg-icons'
import { Navbar } from '../components/Navbar'
import { SummaryCard } from '../components/SummaryCard'
import { getTransactionSummary, getTransactions } from '../api/transactions'
import { TransactionList } from '../components/TransactionList'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { EmptyState } from '../components/EmptyState'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { AddTransactionModal } from '../modals/AddTransactionModal'
import { SettingsModal } from '../modals/SettingsModal'
import { ReportsModal } from '../modals/ReportsModal'
import { logoutSession } from '../api/auth'
import { useAuth } from '../hooks/useAuth'

const transactionKey = ['transactions']
const summaryKey = ['summary']

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const [isReportsOpen, setReportsOpen] = useState(false)
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false)

  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
    queryKey: summaryKey,
    queryFn: getTransactionSummary,
    enabled: isAuthenticated,
  })

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useQuery({
    queryKey: transactionKey,
    queryFn: getTransactions,
    enabled: isAuthenticated,
  })

  const summaryCards = useMemo(() => {
    const totals = summary?.totals
    const income = totals?.totalIncome ?? 0
    const expense = totals?.totalExpense ?? 0
    const balance = totals?.balance ?? 0

    return [
      {
        title: 'Total income',
        amount: income,
        accent: 'income' as const,
        icon: <FontAwesomeIcon icon={faArrowTrendUp} />,
        highlight: 'Money in',
      },
      {
        title: 'Total expenses',
        amount: expense,
        accent: 'expense' as const,
        icon: <FontAwesomeIcon icon={faArrowTrendDown} />,
        highlight: 'Money out',
      },
      {
        title: 'Net balance',
        amount: balance,
        accent: 'balance' as const,
        icon: <FontAwesomeIcon icon={faWallet} />,
        highlight: balance >= 0 ? 'You are on track' : 'Spending exceeds income',
      },
    ]
  }, [summary])

  const handleLogout = () => {
    void logoutSession().catch(() => {})
    logout()
    toast.success('Logged out')
    navigate('/', { replace: true })
  }

  const displayName = user?.name?.split(' ')[0] ?? user?.email ?? 'there'

  useEffect(() => {
    if (isSummaryError || isTransactionsError) {
      toast.error('Unable to load dashboard data')
    }
  }, [isSummaryError, isTransactionsError])

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
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
        <section className="grid gap-6 md:grid-cols-3">
          {isSummaryLoading ? (
            <div className="md:col-span-3">
              <LoadingSpinner />
            </div>
          ) : (
            summaryCards.map(card => (
              <SummaryCard
                key={card.title}
                title={card.title}
                amount={card.amount}
                accent={card.accent}
                icon={card.icon}
                highlight={card.highlight}
              />
            ))
          )}
        </section>

        <section className="rounded-4xl border border-border bg-white/90 p-6 shadow-card">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral">Transactions</h2>
              <p className="text-sm text-muted">Track and review every inflow and outflow.</p>
            </div>
            <button
              type="button"
              onClick={() => setAddTransactionOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-[#2F89C9]"
            >
              Add transaction
            </button>
          </header>
          {isTransactionsLoading ? (
            <LoadingSpinner />
          ) : transactions && transactions.length ? (
            <TransactionList transactions={transactions} />
          ) : (
            <EmptyState
              title="No transactions yet"
              description="Log your first income or expense to unlock insights."
              action={
                <button
                  type="button"
                  onClick={() => setAddTransactionOpen(true)}
                  className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2F89C9]"
                >
                  Add transaction
                </button>
              }
            />
          )}
        </section>
      </main>

      <FloatingActionButton onClick={() => setAddTransactionOpen(true)} />

      <SettingsModal open={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <ReportsModal open={isReportsOpen} onClose={() => setReportsOpen(false)} />
      <AddTransactionModal open={isAddTransactionOpen} onClose={() => setAddTransactionOpen(false)} />
    </div>
  )
}
