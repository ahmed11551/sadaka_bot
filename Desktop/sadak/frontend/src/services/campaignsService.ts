import apiClient from './api'
import { cacheService } from './cacheService'

export interface Campaign {
  id: number
  owner_id: number
  fund_id: number
  title: string
  description: string
  category?: string
  goal_amount: string
  collected_amount: string
  currency: string
  banner_url?: string
  start_date: string
  end_date: string
  status: string
  participants_count: number
  created_at: string
  updated_at?: string
}

export interface CampaignCreate {
  fund_id: number
  title: string
  description: string
  category?: string
  goal_amount: number
  currency?: string
  banner_url?: string
  end_date: string
}

export const campaignsService = {
  getCampaigns: async (params?: {
    country_code?: string
    category?: string
    status?: string
  }) => {
    const cacheKey = `campaigns_${JSON.stringify(params || {})}`
    
    const cached = cacheService.get<Campaign[]>(cacheKey)
    if (cached) {
      return cached
    }

    const response = await apiClient.get<Campaign[]>('/campaigns', { params })
    
    // Кешируем активные кампании на 2 минуты (быстро меняются)
    const ttl = params?.status === 'active' ? 2 * 60 * 1000 : 5 * 60 * 1000
    cacheService.set(cacheKey, response.data, ttl)
    
    return response.data
  },

  getCampaign: async (campaignId: number) => {
    const response = await apiClient.get<Campaign>(`/campaigns/${campaignId}`)
    return response.data
  },

  createCampaign: async (data: CampaignCreate) => {
    const response = await apiClient.post<Campaign>('/campaigns', data)
    return response.data
  },

  donateToCampaign: async (campaignId: number, amount: number) => {
    const response = await apiClient.post('/campaigns/' + campaignId + '/donate', {
      amount_value: amount,
      currency: 'RUB',
      donation_type: 'campaign',
    })
    return response.data
  },
}

