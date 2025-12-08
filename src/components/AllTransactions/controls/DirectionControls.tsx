import { ControlCard, ControlButton } from './SharedControls'
import type { SortDirection } from '../types'

interface DirectionControlsProps {
  direction: SortDirection
  onChange: (direction: SortDirection) => void
}

export const DirectionControls = ({ direction, onChange }: DirectionControlsProps) => {
  const options: { id: SortDirection; label: string; icon: string }[] = [
    { id: 'asc', label: 'Ascending', icon: '↑' },
    { id: 'desc', label: 'Descending', icon: '↓' },
  ]

  return (
    <ControlCard title="Direction">
      {options.map(opt => (
        <ControlButton
          key={opt.id}
          label={opt.label}
          icon={opt.icon}
          isActive={direction === opt.id}
          onClick={() => onChange(opt.id)}
        />
      ))}
    </ControlCard>
  )
}

