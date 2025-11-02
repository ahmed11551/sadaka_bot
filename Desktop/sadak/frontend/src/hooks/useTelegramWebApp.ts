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
      // Настройка цветовой схемы из Telegram
      const updateTheme = () => {
        if (WebApp.colorScheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
        
        // Устанавливаем цвета из Telegram
        if (WebApp.themeParams) {
          const root = document.documentElement
          if (WebApp.themeParams.bg_color) {
            root.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color)
          }
          if (WebApp.themeParams.text_color) {
            root.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color)
          }
          if (WebApp.themeParams.hint_color) {
            root.style.setProperty('--tg-theme-hint-color', WebApp.themeParams.hint_color)
          }
          if (WebApp.themeParams.link_color) {
            root.style.setProperty('--tg-theme-link-color', WebApp.themeParams.link_color)
          }
          if (WebApp.themeParams.button_color) {
            root.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color)
          }
          if (WebApp.themeParams.button_text_color) {
            root.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color)
          }
          if (WebApp.themeParams.secondary_bg_color) {
            root.style.setProperty('--tg-theme-secondary-bg-color', WebApp.themeParams.secondary_bg_color)
          }
        }
      }
      
      updateTheme()
      
      // Слушаем изменения темы
      if (WebApp.onEvent) {
        WebApp.onEvent('themeChanged', updateTheme)
      }
      
      // Расширяем приложение на весь экран
      if (WebApp.expand) {
        WebApp.expand()
      }
      
      return () => {
        if (WebApp.offEvent) {
          WebApp.offEvent('themeChanged', updateTheme)
        }
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

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    const WebApp = getWebApp()
    if (WebApp?.HapticFeedback) {
      try {
        WebApp.HapticFeedback.impactOccurred(type)
      } catch (e) {
        // Haptic not available
      }
    }
  }

  return {
    initTelegramWebApp,
    getInitData,
    triggerHaptic,
    WebApp: getWebApp(),
  }
}

