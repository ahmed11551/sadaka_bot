// Типы для доставки и оплаты

export type DeliveryMethod = 'pickup' | 'sdek' | 'post' | 'ozon';
export type PaymentMethod = 'online' | 'cash' | 'invoice';

export interface DeliveryOption {
  method: DeliveryMethod;
  name: string;
  description?: string;
  icon: string;
  price?: number;
  estimatedDays?: string;
}

export interface PaymentOption {
  method: PaymentMethod;
  name: string;
  description?: string;
  icon: string;
  availableFor?: DeliveryMethod[];
}

export interface CalculateDeliveryRequest {
  city: string;
  weight?: number;
  volume?: number;
}

export interface CalculateDeliveryResponse {
  sdek?: {
    price: number;
    days: string;
    tariff: string;
  };
  post?: {
    price: number;
    days: string;
    tariff: string;
  };
  ozon?: {
    price: number;
    days: string;
  };
}

// СДЭК API Types
export interface CDEKDeliveryData {
  from_location: {
    code: number;
    city: string;
  };
  to_location: {
    code: number;
    city: string;
  };
  packages: Array<{
    weight: number;
    length?: number;
    width?: number;
    height?: number;
  }>;
  tariff_code?: string;
}

// Почта России API Types  
export interface PostDeliveryData {
  from: {
    postal_code: string;
    city: string;
  };
  to: {
    postal_code: string;
    city: string;
  };
  weight: number;
  declared_value?: number;
}

// Ozon API Types
export interface OzonDeliveryData {
  destination: {
    zip_code: string;
    city: string;
  };
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

