import { Line } from 'react-chartjs-2'
import { formatCurrency } from '../../utils/format'

interface ReportsChartProps {
  chartData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      fill: boolean
      tension: number
    }[]
  }
}

export const ReportsChart = ({ chartData }: ReportsChartProps) => (
  <div className="rounded-3xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 shadow-card backdrop-blur-md">
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color:
                (typeof window !== 'undefined' &&
                  getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()) ||
                '#4F677F',
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
            ticks: {
              color:
                (typeof window !== 'undefined' &&
                  getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()) ||
                '#4F677F',
            },
            grid: {
              color:
                (typeof window !== 'undefined' &&
                  getComputedStyle(document.documentElement).getPropertyValue('--border-glass').trim()) ||
                'rgba(79, 103, 127, 0.1)',
            },
          },
          y: {
            ticks: {
              color:
                (typeof window !== 'undefined' &&
                  getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()) ||
                '#4F677F',
            },
            grid: {
              color:
                (typeof window !== 'undefined' &&
                  getComputedStyle(document.documentElement).getPropertyValue('--border-glass').trim()) ||
                'rgba(79, 103, 127, 0.1)',
            },
          },
        },
      }}
    />
  </div>
)
