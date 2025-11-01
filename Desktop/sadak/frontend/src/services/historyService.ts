import apiClient from './api'

export interface HistoryItem {
  type: 'donation' | 'subscription'
  id: number
  amount: number
  currency: string
  status: string
  created_at: string
  completed_at?: string
  
  // Для donation
  donation_type?: string
  fund_id?: number
  campaign_id?: number
  
  // Для subscription
  plan?: string
  period?: string
  charity_percent?: number
  next_charge_at?: string
}

export const historyService = {
  getHistory: async () => {
    const response = await apiClient.get<HistoryItem[]>('/me/history')
    return response.data
  },
}

