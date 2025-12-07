type Grouping = 'none' | 'month' | 'category'

interface GroupingControlsProps {
  grouping: Grouping
  onChange: (grouping: Grouping) => void
}

export const GroupingControls = ({ grouping, onChange }: GroupingControlsProps) => {
  const options: { id: Grouping; label: string }[] = [
    { id: 'none', label: 'No grouping' },
    { id: 'month', label: 'Month' },
    { id: 'category', label: 'Category' },
  ]

  return (
    <div className="flex items-center gap-2 rounded-3xl border border-border bg-white/90 p-4 shadow-soft">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Group by</span>
      <div className="inline-flex rounded-full border border-border bg-white shadow-soft">
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`px-4 py-2 text-sm font-semibold transition first:rounded-l-full last:rounded-r-full ${
              grouping === option.id ? 'bg-accent text-white' : 'text-neutral hover:bg-accent/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
