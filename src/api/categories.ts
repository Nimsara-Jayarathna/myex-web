import { apiClient } from './client'
import type { Category } from '../types'

export const getCategories = async () => {
  const { data } = await apiClient.get<Category[]>('/api/categories')
  return data
}

export const createCategory = async (payload: Pick<Category, 'name' | 'type'>) => {
  const { data } = await apiClient.post<Category>('/api/categories', payload)
  return data
}

export const deleteCategory = async (categoryId: string) => {
  await apiClient.delete(`/api/categories/${categoryId}`)
}
