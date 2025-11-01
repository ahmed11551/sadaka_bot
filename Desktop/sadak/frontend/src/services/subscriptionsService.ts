import apiClient from './api'

export interface SubscriptionInit {
  plan: string
  period: string
  fund_id?: number
  amount?: number
}

export interface Subscription {
  id: number
  user_id: number
  plan: string
  period: string
  status: string
  amount: number
  currency: string
  fund_id?: number
  next_payment_date?: string
  created_at: string
  payment_url?: string
}

export const subscriptionsService = {
  initSubscription: async (data: SubscriptionInit) => {
    const response = await apiClient.post<Subscription>('/subscriptions', data)
    return response.data
  },

  getSubscriptions: async () => {
    const response = await apiClient.get<Subscription[]>('/subscriptions')
    return response.data
  },

  cancelSubscription: async (subscriptionId: number) => {
    const response = await apiClient.delete(`/subscriptions/${subscriptionId}`)
    return response.data
  },
}

