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

// Централизованная обработка ошибок API
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок сети
    if (!error.response) {
      error.message = 'Ошибка сети. Проверьте подключение к интернету.'
      return Promise.reject(error)
    }

    // Обработка различных статус-кодов
    const status = error.response?.status
    const data = error.response?.data

    switch (status) {
      case 401:
        error.message = 'Необходима авторизация'
        // Можно добавить перенаправление на страницу логина для веб-версии
        if (!isTelegramWebApp()) {
          localStorage.removeItem('auth_token')
        }
        break
      case 403:
        error.message = data?.detail || 'Доступ запрещен'
        break
      case 404:
        error.message = data?.detail || 'Ресурс не найден'
        break
      case 422:
        error.message = data?.detail || 'Ошибка валидации данных'
        break
      case 500:
        error.message = 'Ошибка сервера. Попробуйте позже.'
        break
      case 502:
      case 503:
      case 504:
        error.message = 'Сервис временно недоступен. Попробуйте позже.'
        break
      default:
        error.message = data?.detail || error.message || 'Произошла ошибка'
    }

    return Promise.reject(error)
  }
)

export default apiClient

