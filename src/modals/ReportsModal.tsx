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
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.15)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Expenses',
          data: dataset.map(item => item.expense),
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.12)',
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
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {(['daily', 'monthly'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`rounded-full px-4 py-1 text-sm capitalize transition ${
                  view === option ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : 'text-slate-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {data?.totals ? (
            <div className="grid gap-3 text-xs uppercase tracking-wide text-white/60 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-emerald-100">
                <span className="block text-[11px] text-emerald-200/70">Income</span>
                <strong className="text-base text-white">{formatCurrency(data.totals.totalIncome)}</strong>
              </div>
              <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-rose-100">
                <span className="block text-[11px] text-rose-200/70">Expenses</span>
                <strong className="text-base text-white">{formatCurrency(data.totals.totalExpense)}</strong>
              </div>
              <div className="rounded-2xl border border-sky-400/40 bg-sky-500/10 px-4 py-3 text-sky-100">
                <span className="block text-[11px] text-sky-200/70">Balance</span>
                <strong className="text-base text-white">{formatCurrency(data.totals.balance)}</strong>
              </div>
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : data ? (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-slate-900/30 to-transparent p-4 shadow-inner shadow-black/40">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      color: '#CBD5F5',
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
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                  },
                  y: {
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No summary data yet. Add a transaction to see insights.
          </p>
        )}
      </div>
    </Modal>
  )
}
