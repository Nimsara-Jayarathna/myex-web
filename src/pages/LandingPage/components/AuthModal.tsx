import { type FormEvent } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Modal } from '../../../components/Modal'
import { Spinner } from '../../../components/Spinner'
import type { AuthMode } from '../../../types'

interface AuthModalProps {
  open: boolean
  mode: AuthMode | null
  isLoading: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onModeChange: (mode: AuthMode) => void
  formState: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
  onFieldChange: (field: 'firstName' | 'lastName' | 'email' | 'password', value: string) => void
}

export const AuthModal = ({
  open,
  mode,
  isLoading,
  onClose,
  onSubmit,
  onModeChange,
  formState,
  onFieldChange,
}: AuthModalProps) => {
  const activeMode: AuthMode = mode ?? 'login'

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose} title={activeMode === 'login' ? 'Welcome back' : 'Start your journey'}>
          <form onSubmit={onSubmit} className="space-y-5 p-2">
            {activeMode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  className="rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                  value={formState.firstName}
                  onChange={event => onFieldChange('firstName', event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  className="rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                  value={formState.lastName}
                  onChange={event => onFieldChange('lastName', event.target.value)}
                />
              </div>
            )}
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
              value={formState.email}
              onChange={event => onFieldChange('email', event.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-5 py-3.5 text-sm text-[var(--page-fg)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
              value={formState.password}
              onChange={event => onFieldChange('password', event.target.value)}
            />

            <button
              disabled={isLoading}
              className="mt-2 h-14 w-full rounded-full bg-[#3498db] text-base font-bold text-white shadow-[0_15px_30px_-10px_rgba(52,152,219,0.5)] transition hover:bg-[#2F89C9] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Spinner size="sm" /> : activeMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
              {activeMode === 'login' ? 'New to MyEx?' : 'Already onboard?'}{' '}
              <button
                type="button"
                onClick={() => onModeChange(activeMode === 'login' ? 'register' : 'login')}
                className="text-[#3498db] underline underline-offset-4"
              >
                {activeMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  )
}
