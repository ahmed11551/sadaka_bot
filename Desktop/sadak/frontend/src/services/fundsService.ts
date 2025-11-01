import apiClient from './api'
import { cacheService } from './cacheService'

export interface Fund {
  id: number
  name: string
  description?: string
  country_code?: string
  categories: string[]
  verified: boolean
  logo_url?: string
  website_url?: string
}

export const fundsService = {
  getFunds: async (params?: {
    country_code?: string
    category?: string
    verified?: boolean
  }) => {
    // Создаем ключ кеша из параметров
    const cacheKey = `funds_${JSON.stringify(params || {})}`
    
    // Проверяем кеш
    const cached = cacheService.get<Fund[]>(cacheKey)
    if (cached) {
      return cached
    }

    const response = await apiClient.get<Fund[]>('/funds', { params })
    
    // Сохраняем в кеш на 5 минут
    cacheService.set(cacheKey, response.data, 5 * 60 * 1000)
    
    return response.data
  },

  getFund: async (fundId: number) => {
    const cacheKey = `fund_${fundId}`
    
    const cached = cacheService.get<Fund>(cacheKey)
    if (cached) {
      return cached
    }

    const response = await apiClient.get<Fund>(`/funds/${fundId}`)
    
    // Кешируем на 10 минут для отдельных фондов
    cacheService.set(cacheKey, response.data, 10 * 60 * 1000)
    
    return response.data
  },
}

