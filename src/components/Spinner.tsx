interface SpinnerProps {
  size?: 'sm' | 'md'
}

const sizeStyles: Record<Required<SpinnerProps>['size'], string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
}

export const Spinner = ({ size = 'sm' }: SpinnerProps) => (
  <span
    className={`${sizeStyles[size]} inline-flex animate-spin rounded-full border-[var(--border-soft)] border-t-accent`}
    aria-hidden="true"
  />
)
