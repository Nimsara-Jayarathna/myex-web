import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { login, register } from '../api/auth'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../hooks/useAuth'
import type { AuthMode } from '../types'

const featureHighlights = [
  {
    title: 'Unified cashflow',
    description: 'Track income, expenses, and balance in a single, calm dashboard tailored to your goals.',
  },
  {
    title: 'Effortless logging',
    description: 'Record transactions with smart defaults, notes, and categories in seconds.',
  },
  {
    title: 'Insightful analytics',
    description: 'Understand trends instantly with clean visuals for daily through monthly views.',
  },
]

const statHighlights = [
  { label: 'Avg. setup', value: '2 min' },
  { label: 'Categories ready', value: '12+' },
  { label: 'Customer rating', value: '4.8/5' },
]

export const LandingPage = () => {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuth()
  const [mode, setMode] = useState<AuthMode | null>(null)
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      setAuth(data)
      toast.success('Welcome back!')
      navigate('/dashboard', { replace: true })
    },
    onError: () => toast.error('Invalid email or password'),
  })

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: data => {
      setAuth(data)
      toast.success("Account created. Let's get tracking!")
      navigate('/dashboard', { replace: true })
    },
    onError: () => toast.error('Unable to create account'),
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!mode) return

    const trimmed = {
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      email: formState.email.trim(),
      password: formState.password.trim(),
    }

    if (!trimmed.email || !trimmed.password) {
      toast.error('Email and password are required')
      return
    }

    if (mode === 'login') {
      loginMutation.mutate({
        email: trimmed.email,
        password: trimmed.password,
      })
    } else {
      if (!trimmed.firstName || !trimmed.lastName) {
        toast.error('Please add your first and last name')
        return
      }

      registerMutation.mutate({
        email: trimmed.email,
        password: trimmed.password,
        fname: trimmed.firstName,
        lname: trimmed.lastName,
      })
    }
  }

  const activeMutation = mode === 'login' ? loginMutation : registerMutation
  const isModalOpen = mode !== null
  const isLoading = activeMutation.isPending

  const modalCopy = useMemo(
    () => ({
      title: mode === 'login' ? 'Welcome back' : 'Create your MyEx account',
      subtitle:
        mode === 'login'
          ? 'Access your personalized dashboard, insights, and saved categories.'
          : 'Set up your profile and start tracking smarter within seconds.',
    }),
    [mode],
  )

  const closeModal = () => {
    setMode(null)
    setFormState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    })
    loginMutation.reset()
    registerMutation.reset()
  }

  const transitionToMode = (nextMode: AuthMode) => {
    if (mode === nextMode) {
      return
    }
    setMode(nextMode)
    setFormState(prev => ({
      ...prev,
      ...(nextMode === 'login' ? { firstName: '', lastName: '' } : {}),
    }))
    loginMutation.reset()
    registerMutation.reset()
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background px-6 py-16 text-neutral">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-white/80 via-white/50 to-transparent" />
      <motion.div
        className="relative z-10 flex w-full max-w-6xl flex-col gap-16 text-center lg:text-left"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <motion.div
            className="flex flex-col items-center gap-6 lg:items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent shadow-sm">
              Finance, refined
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-neutral sm:text-5xl lg:text-6xl">
                Everything you earn and spend, beautifully organized.
              </h1>
              <p className="max-w-2xl text-base text-muted sm:text-lg">
                MyEx pairs intuitive tracking with calm visuals so you can review income, expenses, and balance within
                a single, distraction-free workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <motion.button
                type="button"
                onClick={() => transitionToMode('login')}
                whileHover={{ y: -4, boxShadow: '0 18px 35px -18px rgba(52,152,219,0.45)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[#2F89C9] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Log in
              </motion.button>
              <motion.button
                type="button"
                onClick={() => transitionToMode('register')}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-8 py-3 text-sm font-semibold text-accent transition hover:border-accent/40 hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Create account
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-5 rounded-4xl border border-border bg-surface p-8 text-left shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted">Current balance</p>
                <p className="mt-2 text-3xl font-semibold text-neutral">$8,245.67</p>
              </div>
              <span className="rounded-full bg-income/15 px-4 py-1 text-xs font-semibold text-income">+12% this month</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-income/30 bg-income/10 px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-income/80">Income</p>
                <p className="mt-2 text-xl font-semibold text-income">$4,820.00</p>
              </div>
              <div className="rounded-3xl border border-expense/30 bg-expense/10 px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-expense/80">Expenses</p>
                <p className="mt-2 text-xl font-semibold text-expense">$1,960.40</p>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-surfaceMuted px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-muted">Upcoming items</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li className="flex items-center justify-between">
                  <span>Team lunch</span>
                  <span className="rounded-full bg-expense/10 px-3 py-1 text-xs font-semibold text-expense">$120</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Freelance payout</span>
                  <span className="rounded-full bg-income/10 px-3 py-1 text-xs font-semibold text-income">$640</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-4 text-left sm:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {featureHighlights.map(feature => (
            <motion.article
              key={feature.title}
              className="group relative flex h-full flex-col justify-between gap-6 rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-soft"
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            >
              <div className="flex flex-col gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-sm font-semibold text-accent">
                  {feature.title.split(' ')[0]}
                </span>
                <h3 className="text-lg font-semibold text-neutral">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/70">Learn more</span>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-border bg-white/80 px-6 py-8 shadow-sm sm:justify-between"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-sm text-muted">Designed for founders, families, and finance teams that value clarity.</p>
          <div className="flex flex-wrap items-center gap-5">
            {statHighlights.map(stat => (
              <div key={stat.label} className="text-left">
                <p className="text-xs uppercase tracking-wide text-muted/70">{stat.label}</p>
                <p className="text-lg font-semibold text-neutral">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={modalCopy.title}
        subtitle={modalCopy.subtitle}
        widthClassName="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          <div className="flex justify-center">
            <div className="flex w-full max-w-xs items-center gap-1 rounded-full border border-white/60 bg-white/35 p-1 shadow-soft backdrop-blur-lg">
              <button
                type="button"
                onClick={() => transitionToMode('login')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-accent via-[#3fa9f5] to-[#277bb9] text-white shadow-[0_18px_40px_-24px_rgba(52,152,219,0.6)]'
                    : 'text-neutral/70 hover:text-neutral'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => transitionToMode('register')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-accent via-[#3fa9f5] to-[#277bb9] text-white shadow-[0_18px_40px_-24px_rgba(52,152,219,0.6)]'
                    : 'text-neutral/70 hover:text-neutral'
                }`}
              >
                Sign up
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-neutral/70">
            {mode === 'login'
              ? 'Enter your credentials to jump back into your dashboard.'
              : 'Add your details and we will spin up a fresh workspace.'}
          </p>
          <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_35px_100px_-60px_rgba(15,35,55,0.7)] backdrop-blur-2xl">
            {mode === 'register' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-neutral/80">
                  First name
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={formState.firstName}
                    onChange={event => setFormState(prev => ({ ...prev, firstName: event.target.value }))}
                    placeholder="Alex"
                    className="rounded-2xl border border-white/60 bg-white/90 px-4 py-2.5 text-sm text-neutral placeholder:text-muted/70 shadow-[inset_0_1px_4px_rgba(15,23,42,0.08)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-neutral/80">
                  Last name
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={formState.lastName}
                    onChange={event => setFormState(prev => ({ ...prev, lastName: event.target.value }))}
                    placeholder="Morgan"
                    className="rounded-2xl border border-white/60 bg-white/90 px-4 py-2.5 text-sm text-neutral placeholder:text-muted/70 shadow-[inset_0_1px_4px_rgba(15,23,42,0.08)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </label>
              </div>
            ) : null}
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral/80">
              Email
              <input
                type="email"
                autoComplete="email"
                value={formState.email}
                onChange={event => setFormState(prev => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                className="rounded-2xl border border-white/60 bg-white/90 px-4 py-2.5 text-sm text-neutral placeholder:text-muted/70 shadow-[inset_0_1px_4px_rgba(15,23,42,0.08)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral/80">
              Password
              <input
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={formState.password}
                onChange={event => setFormState(prev => ({ ...prev, password: event.target.value }))}
                placeholder="********"
                className="rounded-2xl border border-white/60 bg-white/90 px-4 py-2.5 text-sm text-neutral placeholder:text-muted/70 shadow-[inset_0_1px_4px_rgba(15,23,42,0.08)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>

            {activeMutation.isError ? (
              <p className="rounded-2xl border border-expense/30 bg-expense/15 px-4 py-2 text-sm text-expense">
                Something went wrong. Please try again.
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent via-[#3fa9f5] to-[#277bb9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_24px_60px_-28px_rgba(52,152,219,0.7)] transition hover:from-[#2f8fd0] hover:via-[#3b9be0] hover:to-[#226aa7] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-80"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : null}
              <span>{isLoading ? 'Working on it...' : mode === 'login' ? 'Sign in to MyEx' : 'Create account'}</span>
            </button>
          </div>
          <p className="text-center text-[11px] text-neutral/70">
            By continuing you agree to our{' '}
            <span className="text-neutral underline decoration-border/80 underline-offset-4">Terms</span> and{' '}
            <span className="text-neutral underline decoration-border/80 underline-offset-4">Privacy Policy</span>.
          </p>
          <p className="text-center text-xs text-neutral/70">
            {mode === 'login' ? (
              <>
                New to MyEx?{' '}
                <button
                  type="button"
                  onClick={() => transitionToMode('register')}
                  className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition hover:text-[#2F89C9]"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already onboard?{' '}
                <button
                  type="button"
                  onClick={() => transitionToMode('login')}
                  className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition hover:text-[#2F89C9]"
                >
                  Log in here
                </button>
              </>
            )}
          </p>
        </form>
      </Modal>
    </main>
  )
}
