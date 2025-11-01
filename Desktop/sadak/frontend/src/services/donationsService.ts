import apiClient from './api'

export interface Donation {
  id: number
  user_id: number
  fund_id?: number
  campaign_id?: number
  amount_value: string
  currency: string
  status: string
  provider?: string
  payment_id?: string
  payment_url?: string
  donation_type: string
  created_at: string
  completed_at?: string
}

export interface DonationInit {
  fund_id?: number
  campaign_id?: number
  amount_value: number
  currency?: string
  donation_type?: string
  return_url?: string
}

export const donationsService = {
  initDonation: async (data: DonationInit) => {
    const response = await apiClient.post<Donation>('/donations/init', data)
    return response.data
  },

  getDonation: async (donationId: number) => {
    const response = await apiClient.get<Donation>(`/donations/${donationId}`)
    return response.data
  },
}

