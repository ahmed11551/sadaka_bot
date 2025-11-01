/**
 * Утилиты для работы с авторизацией в веб-версии
 */

// Создание или получение пользователя для веб-версии
export const getWebUser = () => {
  // Проверяем наличие Telegram
  const isTelegram = typeof window !== 'undefined' && 
    // @ts-ignore
    window.Telegram?.WebApp
  
  if (isTelegram) {
    return null // Используем Telegram авторизацию
  }
  
  // Для веб-версии используем localStorage для хранения временного пользователя
  let userId = localStorage.getItem('web_user_id')
  
  if (!userId) {
    // Создаем уникальный ID для пользователя
    userId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('web_user_id', userId)
  }
  
  return {
    id: userId,
    type: 'web'
  }
}

// Получение токена авторизации для веб-версии
export const getWebAuthToken = () => {
  return localStorage.getItem('auth_token')
}

// Сохранение токена авторизации
export const setWebAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token)
}

// Очистка авторизации
export const clearWebAuth = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('web_user_id')
}

