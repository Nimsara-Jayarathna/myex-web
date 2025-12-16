const headerRowClasses =
  'text-[11px] uppercase tracking-[0.22em] text-neutral/80 border-b border-accent/30 bg-gradient-to-r from-accent/10 via-white to-accent/10'

const headerCellClasses = 'px-4 py-3 text-left text-xs font-semibold text-neutral'
const headerCellRightAlignedClasses = 'px-4 py-3 text-right text-xs font-semibold text-neutral'

export const TransactionTableHeader = () => (
  <thead>
    <tr className={headerRowClasses}>
      <th className={headerCellClasses}>Date</th>
      <th className={headerCellClasses}>Type</th>
      <th className={headerCellClasses}>Category</th>
      <th className={headerCellClasses}>Amount</th>
      <th className={headerCellClasses}>Note</th>
      <th className={headerCellRightAlignedClasses}>Actions</th>
    </tr>
  </thead>
)
