import { ControlCard, ControlButton } from './SharedControls'
import type { SortField } from './types'

interface SortControlsProps {
  field: SortField
  onChange: (field: SortField) => void
}

export const SortControls = ({ field, onChange }: SortControlsProps) => {
  const fields: { id: SortField; label: string }[] = [
    { id: 'date', label: 'Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'category', label: 'Category' },
  ]

  return (
    <ControlCard title="Sort by">
      {fields.map(f => (
        <ControlButton
          key={f.id}
          label={f.label}
          isActive={field === f.id}
          onClick={() => onChange(f.id)}
        />
      ))}
    </ControlCard>
  )
}
