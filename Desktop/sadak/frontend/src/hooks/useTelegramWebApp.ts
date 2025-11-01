import { useEffect } from 'react'

// Безопасное получение Telegram WebApp
const getWebApp = () => {
  try {
    // @ts-ignore
    return typeof window !== 'undefined' ? window.Telegram?.WebApp : null
  } catch {
    return null
  }
}

export const useTelegramWebApp = () => {
  useEffect(() => {
    const WebApp = getWebApp()
    if (WebApp) {
      // Настройка цветовой схемы
      if (WebApp.colorScheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    }
  }, [])

  const initTelegramWebApp = () => {
    const WebApp = getWebApp()
    if (WebApp) {
      // Дополнительная инициализация при необходимости
      console.log('Telegram WebApp initialized', {
        version: WebApp.version,
        platform: WebApp.platform,
        colorScheme: WebApp.colorScheme,
      })
    }
  }

  const getInitData = () => {
    const WebApp = getWebApp()
    return WebApp?.initData || ''
  }

  return {
    initTelegramWebApp,
    getInitData,
    WebApp: getWebApp(),
  }
}

