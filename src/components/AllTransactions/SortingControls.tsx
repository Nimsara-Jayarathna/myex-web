type SortField = 'date' | 'amount' | 'category'
type SortDirection = 'asc' | 'desc'

interface SortingControlsProps {
  field: SortField
  direction: SortDirection
  onChange: (field: SortField, direction: SortDirection) => void
}

export const SortingControls = ({ field, direction, onChange }: SortingControlsProps) => {
  const fields: { id: SortField; label: string }[] = [
    { id: 'date', label: 'Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'category', label: 'Category' },
  ]

  const directions: { id: SortDirection; label: string }[] = [
    { id: 'asc', label: 'Asc' },
    { id: 'desc', label: 'Desc' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-white/90 p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Sort by</span>
        <div className="inline-flex rounded-full border border-border bg-white shadow-soft">
          {fields.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id, direction)}
              className={`px-4 py-2 text-sm font-semibold transition first:rounded-l-full last:rounded-r-full ${
                field === item.id ? 'bg-accent text-white' : 'text-neutral hover:bg-accent/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Direction</span>
        <div className="inline-flex rounded-full border border-border bg-white shadow-soft">
          {directions.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(field, item.id)}
              className={`px-4 py-2 text-sm font-semibold transition first:rounded-l-full last:rounded-r-full ${
                direction === item.id ? 'bg-accent text-white' : 'text-neutral hover:bg-accent/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
