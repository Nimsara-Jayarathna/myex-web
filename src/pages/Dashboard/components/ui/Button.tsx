interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const baseClasses =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-white hover:bg-accent/90',
  secondary:
    'border border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--page-fg)] hover:border-accent/50 hover:text-accent',
  ghost: 'text-[var(--page-fg)] hover:text-accent',
}

export const Button = ({ variant = 'secondary', className = '', ...props }: ButtonProps) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()
  return <button type="button" className={classes} {...props} />
}

