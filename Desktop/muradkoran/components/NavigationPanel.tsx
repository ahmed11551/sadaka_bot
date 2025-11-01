'use client'

import { useState, useEffect } from 'react'
import { 
  Home, BookOpen, Search, Bookmark, History, 
  BarChart3, Sparkles, Book, X, ChevronRight 
} from 'lucide-react'

interface NavigationPanelProps {
  currentSurah: number
  currentAyah?: number
  onNavigate: (surah: number, ayah?: number) => void
  onClose: () => void
  isOpen: boolean
}

export default function NavigationPanel({
  currentSurah,
  currentAyah,
  onNavigate,
  onClose,
  isOpen
}: NavigationPanelProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'bookmarks' | 'history' | 'stats' | 'smart'>('home')
  const [recentReads, setRecentReads] = useState<Array<{ surah: number; ayah: number; timestamp: number }>>([])
  const [readingStats, setReadingStats] = useState({
    totalAyahsRead: 0,
    surahsRead: [] as number[],
    lastRead: null as { surah: number; ayah: number } | null
  })
  const [bookmarks, setBookmarks] = useState<Array<{ surah: number; ayah: number }>>([])

  useEffect(() => {
    // Загружаем историю чтения
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('quran-reading-history')
      if (history) {
        try {
          const parsed = JSON.parse(history)
          setRecentReads(parsed.slice(-10)) // Последние 10
        } catch (e) {
          console.error('Error loading history:', e)
        }
      }

      // Загружаем статистику
      const stats = localStorage.getItem('quran-reading-stats')
      if (stats) {
        try {
          const parsed = JSON.parse(stats)
          setReadingStats({
            totalAyahsRead: parsed.totalAyahsRead || 0,
            surahsRead: parsed.surahsRead || [],
            lastRead: parsed.lastRead || null
          })
        } catch (e) {
          console.error('Error loading stats:', e)
        }
      }

      // Загружаем закладки
      const bookmarksStr = localStorage.getItem('quran-bookmarks')
      if (bookmarksStr) {
        try {
          const parsed = JSON.parse(bookmarksStr)
          setBookmarks(parsed)
        } catch (e) {
          console.error('Error loading bookmarks:', e)
        }
      }
    }
  }, [isOpen]) // Перезагружаем при открытии панели

  const tabs = [
    { id: 'home' as const, label: 'Главная', icon: Home },
    { id: 'search' as const, label: 'Поиск', icon: Search },
    { id: 'bookmarks' as const, label: 'Закладки', icon: Bookmark },
    { id: 'history' as const, label: 'История', icon: History },
    { id: 'stats' as const, label: 'Статистика', icon: BarChart3 },
    { id: 'smart' as const, label: 'Умный Коран', icon: Sparkles },
  ]

  return (
    <>
      {/* Overlay с анимацией */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Боковая панель с плавной анимацией */}
      <div 
        className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-800 w-80 max-w-[85vw] shadow-2xl flex flex-col z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header с Telegram-style */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Коран
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Навигация
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs с вертикальной навигацией в стиле Telegram */}
        <div className="p-2 border-b dark:border-gray-700">
          <div className="overflow-x-auto">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 active:scale-95'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${
                      activeTab === tab.id 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      activeTab === tab.id
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content с плавным переходом */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 animate-fadeIn">
          {activeTab === 'home' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-2xl mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Текущее чтение
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Сура {currentSurah}
                  {currentAyah && `, Аят ${currentAyah}`}
                </p>
              </div>

              {readingStats.lastRead && (
                <button
                  onClick={() => onNavigate(readingStats.lastRead!.surah, readingStats.lastRead!.ayah)}
                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 p-4 rounded-2xl text-right transition-all duration-200 active:scale-95 mb-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="font-semibold text-gray-800 dark:text-white mb-1">
                        Продолжить чтение
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Сура {readingStats.lastRead.surah}, Аят {readingStats.lastRead.ayah}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate(1)}
                  className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl text-right transition-all duration-200 active:scale-95"
                >
                  <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                    Аль-Фатиха
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Сура 1
                  </div>
                </button>
                <button
                  onClick={() => onNavigate(2)}
                  className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl text-right transition-all duration-200 active:scale-95"
                >
                  <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                    Аль-Бакара
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Сура 2
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Для поиска по тексту аятов используйте кнопку &quot;Умный поиск&quot; в главном меню.
                </p>
                <button
                  onClick={() => {
                    onClose()
                    // Откроем умный поиск через событие или проп
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Открыть умный поиск
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Поиск работает по всему тексту Корана с поддержкой арабского и русского языков
              </p>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                Ваши закладки ({bookmarks.length})
              </h3>
              {bookmarks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  У вас пока нет закладок. Добавьте их при чтении аятов.
                </p>
              ) : (
                bookmarks.map((bookmark, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(bookmark.surah, bookmark.ayah)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl text-right transition-all duration-200 active:scale-95 mb-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800 dark:text-white">
                          Сура {bookmark.surah}, Аят {bookmark.ayah}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                История чтения
              </h3>
              {recentReads.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  История пуста
                </p>
              ) : (
                recentReads.map((read, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(read.surah, read.ayah)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl text-right transition-all duration-200 active:scale-95 mb-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                          Сура {read.surah}, Аят {read.ayah}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(read.timestamp).toLocaleString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Статистика чтения
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Прочитано аятов:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {readingStats.totalAyahsRead}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Прочитано сур:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {readingStats.surahsRead.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Прогресс:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {((readingStats.surahsRead.length / 114) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'smart' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Умный Коран
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Интеллектуальные функции для удобного чтения
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Рекомендация суры на основе времени суток
                    const hour = new Date().getHours()
                    let recommendedSurah = 1
                    if (hour >= 5 && hour < 12) {
                      recommendedSurah = 1 // Аль-Фатиха утром
                    } else if (hour >= 12 && hour < 17) {
                      recommendedSurah = 67 // Аль-Мульк днем
                    } else {
                      recommendedSurah = 78 // Ан-Наба вечером
                    }
                    onNavigate(recommendedSurah)
                  }}
                  className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-right transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        Рекомендация дня
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Подходящая сура для текущего времени
                      </div>
                    </div>
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </button>

                <button
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-right transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        Ежедневное чтение
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        План чтения на сегодня
                      </div>
                    </div>
                    <Book className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                <button
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-right transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        Похожие суры
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Рекомендации на основе вашего чтения
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  )
}

