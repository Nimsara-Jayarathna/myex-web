import { FilterCard } from './FilterCard'

interface DateRangeFilterProps {
  startDate: string
  endDate: string
  onChangeStartDate: (value: string) => void
  onChangeEndDate: (value: string) => void
}

export const DateRangeFilter = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}: DateRangeFilterProps) => (
  <FilterCard title="Date range">
    <div className="flex flex-wrap items-center justify-center gap-2">
      <input
        type="date"
        value={startDate}
        onChange={event => onChangeStartDate(event.target.value)}
        className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-sm text-[var(--page-fg)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <span className="text-[var(--text-muted)]">to</span>
      <input
        type="date"
        value={endDate}
        onChange={event => onChangeEndDate(event.target.value)}
        className="rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] px-3 py-2 text-sm text-[var(--page-fg)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  </FilterCard>
)

