'use client'

import { useEffect, useState } from 'react'

export default function TelegramWidget() {
  const [tg, setTg] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const telegram = (window as any).Telegram.WebApp
      setTg(telegram)
      
      // Инициализация Telegram Web App
      telegram.ready()
      telegram.expand()
      
      // Определение темы пользователя
      const isDark = telegram.colorScheme === 'dark' || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Настройка цветовой темы
      if (isDark) {
        telegram.setHeaderColor('#1f2937')
        telegram.setBackgroundColor('#111827')
      } else {
        telegram.setHeaderColor('#ffffff')
        telegram.setBackgroundColor('#f0fdf4')
      }

      // Настройка главной кнопки (если нужно)
      telegram.MainButton.setText('Открыть в боте')
      telegram.MainButton.onClick(() => {
        telegram.close()
      })

      // Добавление обработчика для кнопки назад
      telegram.BackButton.onClick(() => {
        if (window.history.length > 1) {
          window.history.back()
        } else {
          telegram.close()
        }
      })

      // Показываем кнопку назад если есть история
      if (window.history.length > 1) {
        telegram.BackButton.show()
      }

      // Обработка изменений темы
      telegram.onEvent('themeChanged', () => {
        const isDark = telegram.colorScheme === 'dark'
        if (isDark) {
          telegram.setHeaderColor('#1f2937')
          telegram.setBackgroundColor('#111827')
        } else {
          telegram.setHeaderColor('#ffffff')
          telegram.setBackgroundColor('#f0fdf4')
        }
      })
    }
  }, [])

  // Скрываем/показываем кнопку назад при изменении истории
  useEffect(() => {
    if (!tg) return

    const handlePopState = () => {
      if (window.history.length > 1) {
        tg.BackButton.show()
      } else {
        tg.BackButton.hide()
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [tg])

  return null
}

