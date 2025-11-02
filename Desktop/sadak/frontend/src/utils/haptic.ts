/**
 * Утилита для Haptic Feedback (вибрация) в Telegram WebApp
 * Делает приложение более интерактивным как Telegram Wallet
 */

const getWebApp = () => {
  try {
    // @ts-ignore
    return typeof window !== 'undefined' ? window.Telegram?.WebApp : null
  } catch {
    return null
  }
}

export const haptic = {
  /**
   * Легкая вибрация - для обычных кликов
   */
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    const WebApp = getWebApp()
    if (WebApp?.HapticFeedback) {
      try {
        WebApp.HapticFeedback.impactOccurred(style)
      } catch (e) {
        console.debug('Haptic feedback not available')
      }
    }
  },

  /**
   * Вибрация при успешном действии
   */
  notificationOccurred: (type: 'error' | 'success' | 'warning' = 'success') => {
    const WebApp = getWebApp()
    if (WebApp?.HapticFeedback) {
      try {
        WebApp.HapticFeedback.notificationOccurred(type)
      } catch (e) {
        console.debug('Haptic feedback not available')
      }
    }
  },

  /**
   * Выбор действия (например, выбор из списка)
   */
  selectionChanged: () => {
    const WebApp = getWebApp()
    if (WebApp?.HapticFeedback) {
      try {
        WebApp.HapticFeedback.selectionChanged()
      } catch (e) {
        console.debug('Haptic feedback not available')
      }
    }
  },
}

