// API методы для доставки

import { 
  CalculateDeliveryRequest, 
  CalculateDeliveryResponse,
  CDEKDeliveryData,
  PostDeliveryData,
  OzonDeliveryData
} from '@/types/delivery';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://centertkani.ru/api';

/**
 * CDEK API интеграция
 * @see https://api.cdek.ru/
 */
export const cdekApi = {
  /**
   * Получить стоимость доставки СДЭК
   */
  calculateDelivery: async (data: CDEKDeliveryData): Promise<number> => {
    try {
      // TODO: Реальная интеграция с CDEK API
      const response = await fetch(`${API_BASE}/delivery/cdek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('CDEK calculation failed');
      const result = await response.json();
      return result.price;
    } catch (error) {
      console.error('CDEK API error:', error);
      // Fallback цена
      return 0;
    }
  },

  /**
   * Получить пункты выдачи СДЭК
   */
  getPickupPoints: async (cityCode: number) => {
    const response = await fetch(`${API_BASE}/delivery/cdek/pickup-points?city=${cityCode}`);
    return response.json();
  },
};

/**
 * Почта России API интеграция
 * @see https://www.pochta.ru/support/business/api-dostavki
 */
export const postApi = {
  /**
   * Получить стоимость доставки Почтой России
   */
  calculateDelivery: async (data: PostDeliveryData): Promise<number> => {
    try {
      // TODO: Реальная интеграция с Почтой России API
      const response = await fetch(`${API_BASE}/delivery/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Post calculation failed');
      const result = await response.json();
      return result.price;
    } catch (error) {
      console.error('Post API error:', error);
      return 0;
    }
  },
};

/**
 * Ozon API интеграция (если нужно)
 */
export const ozonApi = {
  calculateDelivery: async (data: OzonDeliveryData): Promise<number> => {
    // TODO: Интеграция с Ozon API если требуется
    return 0;
  },
};

/**
 * Универсальный метод расчета доставки
 */
export const deliveryApi = {
  calculate: async (request: CalculateDeliveryRequest): Promise<CalculateDeliveryResponse> => {
    // Запрос к нашему API, который обрабатывает расчет доставки
    const response = await fetch(`${API_BASE}/delivery/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    return response.json();
  },
};

