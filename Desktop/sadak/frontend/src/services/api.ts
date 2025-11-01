import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Проверка наличия Telegram WebApp
const isTelegramWebApp = () => {
  try {
    // @ts-ignore
    return typeof window !== 'undefined' && window.Telegram?.WebApp
  } catch {
    return false
  }
}

// Добавление initData в заголовки для каждого запроса (только если в Telegram)
apiClient.interceptors.request.use((config) => {
  if (isTelegramWebApp()) {
    try {
      // @ts-ignore
      const WebApp = window.Telegram?.WebApp
      const initData = WebApp?.initData
      if (initData) {
        config.headers['X-Telegram-Init-Data'] = initData
      }
    } catch (e) {
      // Игнорируем ошибки если Telegram SDK не доступен
    }
  } else {
    // Для веб-версии добавляем токен авторизации если есть
    const webToken = localStorage.getItem('auth_token')
    if (webToken) {
      config.headers['Authorization'] = `Bearer ${webToken}`
    }
    // Также добавляем заголовок для идентификации веб-запроса
    config.headers['X-Client-Type'] = 'web'
  }
  return config
})

export default apiClient

