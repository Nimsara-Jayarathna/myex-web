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
)
