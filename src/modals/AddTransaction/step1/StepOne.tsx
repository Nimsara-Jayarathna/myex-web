interface StepOneProps {
  amount: string
  onChangeAmount: (value: string) => void
  onSelectType: (type: 'income' | 'expense') => void
}

export const StepOne = ({ amount, onChangeAmount, onSelectType }: StepOneProps) => (
  <div className="flex flex-col gap-6">
    <label className="flex flex-col gap-2 text-sm text-neutral">
      Amount
      <input
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={event => onChangeAmount(event.target.value)}
        className="rounded-2xl border border-border bg-white px-4 py-3 text-2xl font-semibold text-neutral placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        placeholder="0.00"
      />
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
      {(['income', 'expense'] as const).map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onSelectType(option)}
          className={`flex items-center gap-4 rounded-3xl border border-border bg-white/90 px-6 py-4 text-left shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] transition ${
            option === 'income'
              ? 'hover:border-income/40 hover:shadow-[0_24px_55px_-30px_rgba(46,204,113,0.55)]'
              : 'hover:border-expense/40 hover:shadow-[0_24px_55px_-30px_rgba(231,76,60,0.55)]'
          }`}
        >
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border px-3 text-lg font-semibold ${
              option === 'income'
                ? 'border-income/30 bg-income/10 text-income'
                : 'border-expense/30 bg-expense/10 text-expense'
            }`}
          >
            {option === 'income' ? '+' : '-'}
          </span>
          <h3 className="text-base font-semibold capitalize text-neutral">{option}</h3>
        </button>
      ))}
    </div>
  </div>
)
