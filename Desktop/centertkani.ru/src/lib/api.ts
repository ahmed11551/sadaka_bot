// API client for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://centertkani.ru/api';

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

async function fetchApi(endpoint: string, config: ApiConfig = {}) {
  const { method = 'GET', headers = {}, body } = config;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Products API
export const productsApi = {
  getAll: (params?: { category?: string; page?: number; limit?: number }) =>
    fetchApi('/products', { body: params }),

  getById: (id: string) =>
    fetchApi(`/products/${id}`),

  getNew: () =>
    fetchApi('/products/new'),

  getSale: () =>
    fetchApi('/products/sale'),

  search: (query: string) =>
    fetchApi('/products/search', { body: { query } }),
};

// Categories API
export const categoriesApi = {
  getAll: () =>
    fetchApi('/categories'),

  getById: (id: string) =>
    fetchApi(`/categories/${id}`),
};

// Cart API
export const cartApi = {
  get: () =>
    fetchApi('/cart'),

  add: (data: any) =>
    fetchApi('/cart', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    fetchApi(`/cart/${id}`, { method: 'PUT', body: data }),

  remove: (id: string) =>
    fetchApi(`/cart/${id}`, { method: 'DELETE' }),
};

// Checkout API
export const checkoutApi = {
  create: (data: any) =>
    fetchApi('/checkout', { method: 'POST', body: data }),

  validatePromoCode: (code: string) =>
    fetchApi('/checkout/promo', { method: 'POST', body: { code } }),
};

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    fetchApi('/auth/login', { method: 'POST', body: data }),

  register: (data: any) =>
    fetchApi('/auth/register', { method: 'POST', body: data }),

  logout: () =>
    fetchApi('/auth/logout', { method: 'POST' }),

  getProfile: () =>
    fetchApi('/auth/profile'),
};

// Orders API
export const ordersApi = {
  get: () =>
    fetchApi('/orders'),

  getById: (id: string) =>
    fetchApi(`/orders/${id}`),

  repeat: (id: string) =>
    fetchApi(`/orders/${id}/repeat`, { method: 'POST' }),
};

// Collections API
export const collectionsApi = {
  getAll: () =>
    fetchApi('/collections'),

  getById: (id: string) =>
    fetchApi(`/collections/${id}`),
};

// Works API
export const worksApi = {
  getAll: () =>
    fetchApi('/works'),

  getById: (id: string) =>
    fetchApi(`/works/${id}`),
};

// Loyalty API
export const loyaltyApi = {
  getBalance: () =>
    fetchApi('/loyalty/balance'),

  getHistory: () =>
    fetchApi('/loyalty/history'),
};

export default fetchApi;

