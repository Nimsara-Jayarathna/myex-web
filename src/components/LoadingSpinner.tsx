export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <span className="h-12 w-12 animate-spin rounded-full border-[3px] border-[var(--border-glass)] border-t-accent" />
    </div>
  )
}
