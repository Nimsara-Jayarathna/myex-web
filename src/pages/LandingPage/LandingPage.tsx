import { type FormEvent, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { login, register } from '../../api/auth'
import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'
import { useAuth } from '../../hooks/useAuth'
import type { AuthMode } from '../../types'

export const LandingPage = () => {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuth()
  const [mode, setMode] = useState<AuthMode | null>(null)
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', password: '' })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => { setAuth(data); navigate('/dashboard'); },
    onError: () => toast.error('Invalid credentials'),
  })

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: data => { setAuth(data); navigate('/dashboard'); },
    onError: () => toast.error('Unable to create account'),
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const transitionToMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    loginMutation.reset()
    registerMutation.reset()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!mode) return
    if (mode === 'login') {
      loginMutation.mutate({ email: formState.email, password: formState.password })
    } else {
      registerMutation.mutate({
        email: formState.email,
        password: formState.password,
        fname: formState.firstName,
        lname: formState.lastName,
      })
    }
  }

  const isModalOpen = mode !== null
  const isLoading = loginMutation.isPending || registerMutation.isPending

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#FBFBFE] text-[#2C3E50]">
      {/* 1. GLASSY HERO BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-grid opacity-[0.03]" /> {/* Placeholder for your grid pattern */}
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-white/90 via-white/50 to-transparent" />
        
        {/* Design Reference: Radial Gradients */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#3498db]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#2ecc71]/10 blur-[120px]" />
      </div>

      {/* 2. NAVBAR: Pill-shaped & Bordered */}
      <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-black tracking-tighter text-[#2C3E50]">
          MyEx<span className="text-[#3498db]">.</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => transitionToMode('login')}
            className="rounded-full border border-gray-200 bg-white/80 px-6 py-2 text-sm font-bold text-[#2C3E50] backdrop-blur-md transition hover:border-[#3498db] hover:text-[#3498db]"
          >
            Log in
          </button>
          <button 
            onClick={() => transitionToMode('register')}
            className="hidden rounded-full bg-[#3498db] px-6 py-2 text-sm font-bold text-white shadow-[0_10px_20px_-5px_rgba(52,152,219,0.4)] transition hover:bg-[#2F89C9] sm:block"
          >
            Create account
          </button>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-8 pt-16 pb-32">
        <div className="grid items-center gap-20 lg:grid-cols-[1.1fr_1fr]">
          
          {/* 3. HERO CONTENT: Fade + Slide Up */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <span className="inline-flex rounded-full bg-[#3498db]/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#3498db]">
              Finance, refined
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-[#2C3E50] sm:text-7xl">
              Everything you earn & spend, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498db] to-[#5dade2]">beautifully organized.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-500">
              MyEx pairs intuitive tracking with calm visuals so you can review income, expenses, and balance within a single, distraction-free workspace.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <motion.button 
                whileHover={{ y: -4, boxShadow: '0 18px 35px -18px rgba(52,152,219,0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => transitionToMode('register')}
                className="rounded-full bg-[#3498db] px-10 py-4 text-base font-bold text-white shadow-[0_20px_40px_-10px_rgba(52,152,219,0.4)] transition hover:bg-[#2F89C9]"
              >
                Get started for free
              </motion.button>
            </div>
          </motion.div>

          {/* 4. DASHBOARD WIDGET: Replicating provided images with Design Lang */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative rounded-[2.5rem] border border-gray-100 bg-white/60 p-4 shadow-card backdrop-blur-xl"
          >
            <div className="rounded-[2rem] bg-white p-8 shadow-soft border border-gray-50">
              {/* Segmented Control from Image */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex rounded-full bg-gray-50 p-1 border border-gray-100 shadow-inner">
                  <button className="rounded-full bg-[#3498db] px-6 py-1.5 text-xs font-bold text-white shadow-sm">Today's Activity</button>
                  <button className="rounded-full px-6 py-1.5 text-xs font-bold text-gray-400">All Transactions</button>
                </div>
              </div>

              {/* Semantic Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-3xl border border-[#2ecc71]/20 bg-[#2ecc71]/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#2ecc71]/70">Income Today</p>
                  <p className="mt-1 text-2xl font-black text-[#2ecc71]">$4,820.00</p>
                </div>
                <div className="rounded-3xl border border-[#e74c3c]/20 bg-[#e74c3c]/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#e74c3c]/70">Expenses Today</p>
                  <p className="mt-1 text-2xl font-black text-[#e74c3c]">$1,120.40</p>
                </div>
              </div>

              {/* Transaction List Pattern */}
              <div className="space-y-3">
                {[
                  { label: 'Freelance Payout', price: '+$2,400.00', color: '#2ecc71' },
                  { label: 'Grocery Store', price: '-$120.00', color: '#e74c3c' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl bg-gray-50/50 p-4 border border-gray-100/50">
                    <span className="text-sm font-semibold text-[#2C3E50]">{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. FEATURES: Large radii + Hover Lifts */}
        <div className="mt-40 grid gap-8 md:grid-cols-3">
          {[
            { title: 'Unified View', desc: 'A single, calm dashboard tailored to your personal goals.' },
            { title: 'Smart Logging', desc: 'Record transactions with smart defaults and categories in seconds.' },
            { title: 'Privacy First', desc: 'Your data is encrypted and remains entirely yours. No ads, ever.' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="rounded-[2rem] border border-gray-100 bg-white p-10 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="mb-6 h-12 w-12 rounded-2xl bg-[#3498db]/10 flex items-center justify-center text-[#3498db] font-black">
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50]">{feature.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 6. AUTH MODAL: Adhering to Modal/Pop-up Reference */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal 
            open={isModalOpen} 
            onClose={() => setMode(null)} 
            title={mode === 'login' ? 'Welcome back' : 'Start your journey'}
          >
            <form onSubmit={handleSubmit} className="p-2 space-y-5">
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="First Name" required
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                    onChange={(e) => setFormState({...formState, firstName: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Last Name" required
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                    onChange={(e) => setFormState({...formState, lastName: e.target.value})}
                  />
                </div>
              )}
              <input 
                type="email" placeholder="Email Address" required
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                onChange={(e) => setFormState({...formState, email: e.target.value})}
              />
              <input 
                type="password" placeholder="Password" required
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm outline-none transition focus:border-[#3498db]/30 focus:ring-4 focus:ring-[#3498db]/5"
                onChange={(e) => setFormState({...formState, password: e.target.value})}
              />
              
              <button 
                disabled={isLoading}
                className="mt-2 w-full h-14 rounded-full bg-[#3498db] text-base font-bold text-white shadow-[0_15px_30px_-10px_rgba(52,152,219,0.5)] transition hover:bg-[#2F89C9] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Spinner size="sm" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="mt-6 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {mode === 'login' ? "New to MyEx?" : "Already onboard?"}{' '}
                <button 
                  type="button" 
                  onClick={() => transitionToMode(mode === 'login' ? 'register' : 'login')} 
                  className="text-[#3498db] underline underline-offset-4"
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </main>
  )
}
