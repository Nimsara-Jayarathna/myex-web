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
    description: 'Track income, expenses, and balance in one realtime view tailored to your patterns.',
  },
  {
    title: 'Effortless logging',
    description: 'Add transactions with contextual categories, notes, and smart defaults in two taps.',
  },
  {
    title: 'Insightful analytics',
    description: 'Transform raw spending data into daily and monthly trends that keep you on target.',
  },
]

export const LandingPage = () => {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuth()
  const [mode, setMode] = useState<AuthMode | null>(null)
  const [formState, setFormState] = useState({
    name: '',
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

    const payload = {
      email: formState.email.trim(),
      password: formState.password.trim(),
      ...(mode === 'register' ? { name: formState.name.trim() } : {}),
    }

    if (!payload.email || !payload.password) {
      toast.error('Email and password are required')
      return
    }

    if (mode === 'register' && !payload.name) {
      toast.error('Please add your name')
      return
    }

    if (mode === 'login') {
      loginMutation.mutate(payload)
    } else {
      registerMutation.mutate(payload)
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
      name: '',
      email: '',
      password: '',
    })
    loginMutation.reset()
    registerMutation.reset()
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 py-16 text-slate-100">
      <motion.div
        className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
            Smart Finance, Refined
          </span>
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
              All your money stories in one beautifully clear dashboard.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
              MyEx helps you understand every transaction with context, clarity, and calm. Track, analyze, and
              celebrate your financial habits with elegant tooling built for modern teams and individuals.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              type="button"
              onClick={() => setMode('login')}
              whileHover={{ y: -4, boxShadow: '0 18px 35px -18px rgba(56,189,248,0.65)' }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 px-8 py-3 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-sky-200/70"
            >
              Log In
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setMode('register')}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/50 hover:bg-sky-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-sky-200/70"
            >
              Create an account
            </motion.button>
          </div>
        </motion.div>

        <motion.ul
          className="grid w-full gap-4 text-left sm:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {featureHighlights.map((feature, index) => (
            <motion.li
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-sky-400/10 opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex flex-col gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-200">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{feature.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <Modal open={isModalOpen} onClose={closeModal} title={modalCopy.title} subtitle={modalCopy.subtitle}>
        {mode ? (
          <div className="mb-5 flex flex-col gap-4">
            <div className="flex justify-center">
              <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold text-slate-300">
                {(['login', 'register'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMode(tab)}
                    className={`rounded-full px-4 py-1.5 transition ${
                      mode === tab ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tab === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-slate-400">
              {mode === 'login'
                ? 'Enter your credentials to jump back into your dashboard.'
                : 'Set a secure password and we will initialize your workspace.'}
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' ? (
            <label className="flex flex-col gap-2 text-sm text-white">
              Full name
              <input
                type="text"
                autoComplete="name"
                value={formState.name}
                onChange={event => setFormState(prev => ({ ...prev, name: event.target.value }))}
                placeholder="Chelsea Carter"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </label>
          ) : null}
          <label className="flex flex-col gap-2 text-sm text-white">
            Email
            <input
              type="email"
              autoComplete="email"
              value={formState.email}
              onChange={event => setFormState(prev => ({ ...prev, email: event.target.value }))}
              placeholder="you@example.com"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white">
            Password
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={formState.password}
              onChange={event => setFormState(prev => ({ ...prev, password: event.target.value }))}
              placeholder="********"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </label>

          {activeMutation.isError ? (
            <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
              Something went wrong. Please try again.
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : null}
            <span>{isLoading ? 'Working on it...' : mode === 'login' ? 'Sign in to MyEx' : 'Create account'}</span>
          </button>
          <p className="text-center text-[11px] text-slate-500">
            By continuing you agree to our{' '}
            <span className="text-slate-200 underline decoration-slate-500 decoration-dotted underline-offset-4">
              Terms
            </span>{' '}
            and{' '}
            <span className="text-slate-200 underline decoration-slate-500 decoration-dotted underline-offset-4">
              Privacy Policy
            </span>
            .
          </p>
        </form>
      </Modal>
    </main>
  )
}
