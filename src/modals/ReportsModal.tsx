import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Modal } from '../components/Modal'
import { getTransactionSummary } from '../api/transactions'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatCurrency } from '../utils/format'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface ReportsModalProps {
  open: boolean
  onClose: () => void
}

const summaryKey = ['summary']

export const ReportsModal = ({ open, onClose }: ReportsModalProps) => {
  const [view, setView] = useState<'daily' | 'monthly'>('monthly')
  const { data, isLoading } = useQuery({
    queryKey: summaryKey,
    queryFn: getTransactionSummary,
    enabled: open,
  })

  const chartData = useMemo(() => {
    const dataset = view === 'daily' ? data?.daily ?? [] : data?.monthly ?? []
    const labels = dataset.map(item => item.label)

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: dataset.map(item => item.income),
          borderColor: '#2ECC71',
          backgroundColor: 'rgba(46, 204, 113, 0.15)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Expenses',
          data: dataset.map(item => item.expense),
          borderColor: '#E74C3C',
          backgroundColor: 'rgba(231, 76, 60, 0.12)',
          fill: true,
          tension: 0.3,
        },
      ],
    }
  }, [data, view])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reports & Insights"
      subtitle="Visualize your cashflow trends to understand where money comes and goes."
      widthClassName="max-w-3xl"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 rounded-full border border-border bg-white p-1 shadow-sm">
            {(['daily', 'monthly'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`rounded-full px-4 py-1 text-sm capitalize transition ${
                  view === option ? 'bg-accent text-white shadow-soft' : 'text-muted hover:text-neutral'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {data?.totals ? (
            <div className="grid gap-3 text-xs uppercase tracking-wide text-muted sm:grid-cols-3">
              <div className="rounded-2xl border border-income/30 bg-income/10 px-4 py-3 text-income">
                <span className="block text-[11px] text-income/80">Income</span>
                <strong className="text-base text-neutral">{formatCurrency(data.totals.totalIncome)}</strong>
              </div>
              <div className="rounded-2xl border border-expense/30 bg-expense/10 px-4 py-3 text-expense">
                <span className="block text-[11px] text-expense/80">Expenses</span>
                <strong className="text-base text-neutral">{formatCurrency(data.totals.totalExpense)}</strong>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-accent">
                <span className="block text-[11px] text-accent/80">Balance</span>
                <strong className="text-base text-neutral">{formatCurrency(data.totals.balance)}</strong>
              </div>
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : data ? (
          <div className="rounded-3xl border border-border bg-white/90 p-4 shadow-card">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      color: '#4F677F',
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: context => {
                        const value = context.parsed.y ?? 0
                        return `${context.dataset.label}: ${formatCurrency(value)}`
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: '#4F677F' },
                    grid: { color: 'rgba(79, 103, 127, 0.1)' },
                  },
                  y: {
                    ticks: { color: '#4F677F' },
                    grid: { color: 'rgba(79, 103, 127, 0.1)' },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-white/80 px-4 py-8 text-center text-sm text-muted">
            No summary data yet. Add a transaction to see insights.
          </p>
        )}
      </div>
    </Modal>
  )
}
