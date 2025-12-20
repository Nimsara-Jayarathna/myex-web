import { type FormEvent, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login, register } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import type { AuthMode } from '../../types'
import { AuthModal } from './components/AuthModal'
import { DashboardPreview } from './components/DashboardPreview'
import { FeaturesSection } from './components/FeaturesSection'
import { HeroSection } from './components/HeroSection'
import { LandingNavbar } from './components/LandingNavbar'

export const LandingPage = () => {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuth()
  const [mode, setMode] = useState<AuthMode | null>(null)
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', password: '' })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      setAuth(data)
      navigate('/dashboard')
    },
    onError: () => toast.error('Invalid credentials'),
  })

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: data => {
      setAuth(data)
      navigate('/dashboard')
    },
    onError: () => toast.error('Unable to create account'),
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
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

  const handleFieldChange = (field: 'firstName' | 'lastName' | 'email' | 'password', value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const isModalOpen = mode !== null
  const isLoading = loginMutation.isPending || registerMutation.isPending

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#FBFBFE] text-[#2C3E50]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-grid opacity-[0.03]" />
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-white/90 via-white/50 to-transparent" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#3498db]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#2ecc71]/10 blur-[120px]" />
      </div>

      <LandingNavbar onLogin={() => transitionToMode('login')} onRegister={() => transitionToMode('register')} />

      <div className="relative z-10 mx-auto max-w-7xl px-8 pb-32 pt-16">
        <div className="grid items-center gap-20 lg:grid-cols-[1.1fr_1fr]">
          <HeroSection onRegister={() => transitionToMode('register')} />
          <DashboardPreview />
        </div>

        <FeaturesSection />
      </div>

      <AuthModal
        open={isModalOpen}
        mode={mode}
        isLoading={isLoading}
        onClose={() => setMode(null)}
        onSubmit={handleSubmit}
        onModeChange={transitionToMode}
        formState={formState}
        onFieldChange={handleFieldChange}
      />
    </main>
  )
}
