const headerRowClasses =
  'text-[11px] uppercase tracking-[0.22em] text-[var(--text-subtle)] border-b border-accent/30 bg-gradient-to-r from-accent/10 via-[var(--surface-glass)] to-accent/10'

const headerCellClasses = 'px-4 py-3 text-left text-xs font-semibold text-[var(--page-fg)]'
const headerCellRightAlignedClasses = 'px-4 py-3 text-right text-xs font-semibold text-[var(--page-fg)]'

export const TransactionTableHeader = () => (
  <thead>
    <tr className={headerRowClasses}>
      <th className={headerCellClasses}>Date</th>
      <th className={headerCellClasses}>Type</th>
      <th className={headerCellClasses}>Category</th>
      <th className={headerCellClasses}>Amount</th>
      <th className={headerCellClasses}>Note</th>
      <th className={headerCellRightAlignedClasses} aria-label="Delete" />
    </tr>
  </thead>
)
