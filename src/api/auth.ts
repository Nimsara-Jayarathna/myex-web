import { apiClient } from './client'
import type { AuthCredentials, AuthResponse } from '../types'

export const login = async (credentials: AuthCredentials) => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', credentials)
  return data
}

export const register = async (credentials: AuthCredentials) => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/register', credentials)
  return data
}
