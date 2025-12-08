import { ControlCard, ControlButton } from './SharedControls'
import type { Grouping } from './AllTransactionsPage'

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
    <ControlCard title="Group by">
      {options.map(opt => (
        <ControlButton
          key={opt.id}
          label={opt.label}
          isActive={grouping === opt.id}
          onClick={() => onChange(opt.id)}
        />
      ))}
    </ControlCard>
  )
}
