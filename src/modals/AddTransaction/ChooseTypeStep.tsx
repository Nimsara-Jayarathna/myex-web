interface ChooseTypeStepProps {
  onChooseType: (type: 'income' | 'expense') => void
}

export const ChooseTypeStep = ({ onChooseType }: ChooseTypeStepProps) => (
  <div className="flex flex-col gap-5">
    <div className="grid gap-4 sm:grid-cols-2">
      {(['income', 'expense'] as const).map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onChooseType(option)}
          className={`flex flex-col gap-3 rounded-3xl border border-border bg-white/85 px-6 py-5 text-left shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] transition ${
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
          <div className="space-y-1">
            <h3 className="text-lg font-semibold capitalize text-neutral">{option}</h3>
            <p className="text-sm text-muted">
              {option === 'income'
                ? 'Log paychecks, sales, refunds, or unexpected inflows.'
                : 'Capture spending, bills, or one-off costs.'}
            </p>
          </div>
        </button>
      ))}
    </div>
    <p className="text-center text-xs text-muted">
      Need a new category? Head to Settings to create one before logging it here.
    </p>
  </div>
)

