import apiClient from './api'

export interface ZakatCalc {
  id: number
  user_id: number
  total_wealth: string
  nisab_value: string
  zakat_due: string
  donation_id?: number
  created_at: string
}

export interface ZakatCalcCreate {
  cash?: number
  gold?: { weight: number; rate: number }
  silver?: { weight: number; rate: number }
  goods?: number
  debts?: number
}

export const zakatService = {
  calculate: async (data: ZakatCalcCreate) => {
    const response = await apiClient.post<ZakatCalc>('/zakat/calc', data)
    return response.data
  },

  pay: async (calculationId: number) => {
    const response = await apiClient.post('/zakat/pay', {
      calculation_id: calculationId,
    })
    return response.data
  },
}

