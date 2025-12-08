interface ListHeaderProps {
  title: string
}

export const ListHeader = ({ title }: ListHeaderProps) => (
  <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
    <div>
      <h2 className="text-lg font-semibold text-neutral">{title}</h2>
      <p className="text-sm text-muted">Track and review every inflow and outflow.</p>
    </div>
  </header>
)

