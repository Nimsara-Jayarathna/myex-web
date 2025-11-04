import axios from 'axios'
import { useAuthStore } from '../context/auth-store'

const FALLBACK_BASE_URL = 'https://api.myex.com'

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '')

const resolveBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim()
  if (fromEnv && fromEnv.length > 0) {
    return normalizeBaseUrl(fromEnv)
  }
  return FALLBACK_BASE_URL
}

export const API_BASE_URL = resolveBaseUrl()

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)
