import { useMemo } from 'react'
import { useAuthStore } from '../context/auth-store'

export const useAuth = () => {
  const token = useAuthStore(state => state.token)
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const logout = useAuthStore(state => state.logout)
  const setAuth = useAuthStore(state => state.setAuth)

  return useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      logout,
      setAuth,
    }),
    [token, user, isAuthenticated, logout, setAuth],
  )
}
