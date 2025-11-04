import { create } from 'zustand'
import type { AuthResponse, UserProfile } from '../types'

interface AuthState {
  token: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  setAuth: (payload: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: ({ token, user }: AuthResponse) =>
    set({
      token,
      user,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    }),
}))
