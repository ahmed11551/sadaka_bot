'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Search, BookOpen, Bookmark, ArrowUp, ArrowDown, List, Menu, Sparkles } from 'lucide-react'
import AyahCard from './AyahCard'
import SurahList from './SurahList'
import SearchModal from './SearchModal'
import NavigationPanel from './NavigationPanel'
import SmartSearch from './SmartSearch'
import BottomNavigation from './BottomNavigation'

interface Surah {
  number: number
  name: string
  englishName: string
  numberOfAyahs: number
}

interface Ayah {
  number: number
  text: string
  numberInSurah: number
}

interface QuranReaderProps {
  initialSurah?: number
  initialView?: 'surahs' | 'search' | 'bookmarks'
  searchQuery?: string
}

export default function QuranReader({ 
  initialSurah, 
  initialView,
  searchQuery 
}: QuranReaderProps = {}) {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentSurah, setCurrentSurah] = useState<number>(initialSurah || 1)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(true)
  const [showSurahList, setShowSurahList] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [ayahsPerPage] = useState<number>(10)
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false)
  const ayahsContainerRef = useRef<HTMLDivElement>(null)
  const [jumpToAyah, setJumpToAyah] = useState<number | null>(null)
  const [showNavPanel, setShowNavPanel] = useState<boolean>(false)
  const [currentAyah, setCurrentAyah] = useState<number | undefined>(undefined)
  const [showSmartSearch, setShowSmartSearch] = useState<boolean>(false)
  const [bottomNavTab, setBottomNavTab] = useState<'home' | 'search' | 'bookmarks' | 'smart'>('home')

  useEffect(() => {
    fetchSurahs()
    loadBookmarks()
    
    // Загружаем последнее прочитанное место
    if (!initialSurah && typeof window !== 'undefined') {
      const lastRead = localStorage.getItem('quran-last-read')
      if (lastRead) {
        try {
          const parsed = JSON.parse(lastRead)
          setCurrentSurah(parsed.surah)
          if (parsed.ayah) {
            setCurrentAyah(parsed.ayah)
            setJumpToAyah(parsed.ayah)
          }
        } catch (e) {
          console.error('Error loading last read:', e)
        }
      }
    }
    
    // Обработка начальных параметров
    if (initialView === 'surahs') {
      setShowSurahList(true)
    } else if (initialView === 'search') {
      setShowSearch(true)
    } else if (initialView === 'bookmarks') {
      // Можно добавить отдельное представление закладок
    }
    
    if (searchQuery) {
      setShowSearch(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentSurah) {
      fetchAyahs(currentSurah)
      setCurrentPage(1) // Сбрасываем страницу при смене суры
      setJumpToAyah(null)
      
      // Сохраняем историю чтения
      saveReadingHistory(currentSurah, currentAyah || 1)
      updateReadingStats(currentSurah)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSurah])

  // Сохранение истории чтения
  const saveReadingHistory = (surah: number, ayah: number) => {
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('quran-reading-history') || '[]')
      const newEntry = { surah, ayah, timestamp: Date.now() }
      
      // Удаляем дубликаты и добавляем новую запись
      const filtered = history.filter((h: any) => !(h.surah === surah && h.ayah === ayah))
      filtered.push(newEntry)
      
      // Оставляем только последние 100 записей
      const limited = filtered.slice(-100)
      localStorage.setItem('quran-reading-history', JSON.stringify(limited))
      
      // Сохраняем последнее прочитанное место
      localStorage.setItem('quran-last-read', JSON.stringify({ surah, ayah }))
    }
  }

  // Обновление статистики
  const updateReadingStats = (surah: number) => {
    if (typeof window !== 'undefined') {
      const statsStr = localStorage.getItem('quran-reading-stats')
      const stats = statsStr ? JSON.parse(statsStr) : { 
        totalAyahsRead: 0, 
        surahsRead: [],
        lastRead: null 
      }
      
      // Добавляем суру если её еще нет
      if (!stats.surahsRead.includes(surah)) {
        stats.surahsRead.push(surah)
      }
      
      // Обновляем последнее место
      stats.lastRead = { surah, ayah: currentAyah || 1 }
      
      localStorage.setItem('quran-reading-stats', JSON.stringify(stats))
    }
  }

  // Обработка прокрутки для показа кнопки "Наверх"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Переход к конкретному аяту
  useEffect(() => {
    if (jumpToAyah && ayahs.length > 0) {
      const targetAyah = ayahs.find(a => a.numberInSurah === jumpToAyah)
      if (targetAyah) {
        // Вычисляем на какой странице находится этот аят
        const ayahIndex = ayahs.findIndex(a => a.numberInSurah === jumpToAyah)
        const page = Math.ceil((ayahIndex + 1) / ayahsPerPage)
        setCurrentPage(page)
        
        // Прокручиваем к элементу после рендера
        setTimeout(() => {
          const element = document.getElementById(`ayah-${jumpToAyah}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('ring-4', 'ring-green-400', 'ring-opacity-75')
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-green-400', 'ring-opacity-75')
            }, 2000)
          }
        }, 100)
        setJumpToAyah(null)
      }
    }
  }, [jumpToAyah, ayahs, ayahsPerPage])

  const fetchSurahs = async () => {
    try {
      setError(null)
      const response = await fetch('https://api.alquran.cloud/v1/surah')
      const data = await response.json()
      if (data.code === 200) {
        setSurahs(data.data)
      } else {
        setError('Не удалось загрузить список сур')
      }
    } catch (error) {
      console.error('Error fetching surahs:', error)
      setError('Ошибка подключения к API')
    } finally {
      setLoading(false)
    }
  }

  const fetchAyahs = async (surahNumber: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
      const data = await response.json()
      if (data.code === 200) {
        setAyahs(data.data.ayahs)
      } else {
        setError('Не удалось загрузить аяты')
      }
    } catch (error) {
      console.error('Error fetching ayahs:', error)
      setError('Ошибка подключения к API')
    } finally {
      setLoading(false)
    }
  }

  const loadBookmarks = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran-bookmarks')
      if (saved) {
        setBookmarks(JSON.parse(saved))
      }
    }
  }

  const toggleBookmark = (surah: number, ayah: number) => {
    const key = `${surah}:${ayah}`
    const newBookmarks = [...bookmarks]
    const index = newBookmarks.findIndex(b => b.surah === surah && b.ayah === ayah)
    
    if (index >= 0) {
      newBookmarks.splice(index, 1)
    } else {
      newBookmarks.push({ surah, ayah })
    }
    
    setBookmarks(newBookmarks)
    if (typeof window !== 'undefined') {
      localStorage.setItem('quran-bookmarks', JSON.stringify(newBookmarks))
    }
  }

  const isBookmarked = (surah: number, ayah: number) => {
    return bookmarks.some(b => b.surah === surah && b.ayah === ayah)
  }

  const currentSurahData = surahs.find(s => s.number === currentSurah)

  const nextSurah = () => {
    if (currentSurah < 114) {
      setCurrentSurah(currentSurah + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevSurah = () => {
    if (currentSurah > 1) {
      setCurrentSurah(currentSurah - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Пагинация
  const totalPages = Math.ceil(ayahs.length / ayahsPerPage)
  const startIndex = (currentPage - 1) * ayahsPerPage
  const endIndex = startIndex + ayahsPerPage
  const currentAyahs = ayahs.slice(startIndex, endIndex)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleJumpToAyah = () => {
    const ayahNumber = prompt(`Введите номер аята (1-${currentSurahData?.numberOfAyahs || 0}):`)
    if (ayahNumber) {
      const num = parseInt(ayahNumber)
      if (!isNaN(num) && num >= 1 && num <= (currentSurahData?.numberOfAyahs || 0)) {
        setJumpToAyah(num)
      } else {
        alert(`Введите число от 1 до ${currentSurahData?.numberOfAyahs || 0}`)
      }
    }
  }

  if (loading && !ayahs.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error && !ayahs.length) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
        <button
          onClick={() => {
            if (currentSurah) {
              fetchAyahs(currentSurah)
            } else {
              fetchSurahs()
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  const handleNavigate = (surah: number, ayah?: number) => {
    setCurrentSurah(surah)
    if (ayah) {
      setJumpToAyah(ayah)
      setCurrentAyah(ayah)
    }
    setShowNavPanel(false)
  }

  return (
    <div className="max-w-4xl mx-auto content-with-bottom-nav pb-20">
      {/* Навигационная панель */}
      <NavigationPanel
        currentSurah={currentSurah}
        currentAyah={currentAyah}
        onNavigate={handleNavigate}
        onClose={() => setShowNavPanel(false)}
        isOpen={showNavPanel}
      />

      {/* Toolbar с плавными переходами */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 transition-all duration-200">
        {/* Верхняя панель - навигация по сурам */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNavPanel(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 active:scale-95 shadow-md"
              title="Умная навигация"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSurahList(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 active:scale-95 shadow-md"
            >
              <BookOpen className="w-5 h-5" />
              <span>Список сур</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <button
              onClick={prevSurah}
              disabled={currentSurah === 1}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
              title="Предыдущая сура"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center px-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentSurahData?.englishName || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentSurahData?.name || ''} • {currentSurahData?.numberOfAyahs || 0} аятов
              </p>
            </div>

            <button
              onClick={nextSurah}
              disabled={currentSurah === 114}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
              title="Следующая сура"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSmartSearch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 active:scale-95 shadow-md"
            title="Умный поиск по тексту"
          >
            <Sparkles className="w-5 h-5" />
            <span>Умный поиск</span>
          </button>
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-md"
          >
            <Search className="w-5 h-5" />
            <span>Поиск сур</span>
          </button>
          </div>
        </div>

        {/* Нижняя панель - пагинация и навигация */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t dark:border-gray-700 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleJumpToAyah}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 active:scale-95 text-sm shadow-md"
              title="Перейти к аяту"
            >
              <List className="w-4 h-4" />
              <span>К аяту</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400 px-3">
              Страница <span className="font-bold">{currentPage}</span> из <span className="font-bold">{totalPages}</span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Вперед</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Показано {startIndex + 1}-{Math.min(endIndex, ayahs.length)} из {ayahs.length} аятов
              </div>
              {/* Индикатор прогресса */}
              <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${(endIndex / ayahs.length) * 100}%` }}
                />
              </div>
            </div>
        </div>
      </div>

      {/* Ayahs */}
      <div ref={ayahsContainerRef} className="space-y-4">
        {loading && currentAyahs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : currentAyahs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Аяты не найдены
          </div>
        ) : (
          currentAyahs.map((ayah) => (
            <div key={ayah.number} id={`ayah-${ayah.numberInSurah}`} className="scroll-mt-20">
              <AyahCard
                ayah={ayah}
                surah={currentSurah}
                surahName={currentSurahData?.englishName || ''}
                isBookmarked={isBookmarked(currentSurah, ayah.numberInSurah)}
                onToggleBookmark={() => toggleBookmark(currentSurah, ayah.numberInSurah)}
              />
            </div>
          ))
        )}
      </div>

      {/* Пагинация внизу */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 pb-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Предыдущая</span>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (currentPage <= 4) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = currentPage - 3 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Следующая</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Кнопка "Наверх" - выше bottom navigation */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110 z-40"
          aria-label="Наверх"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Нижняя навигация в стиле Telegram Wallet */}
      <BottomNavigation
        activeTab={bottomNavTab}
        onTabChange={(tab) => {
          setBottomNavTab(tab)
          if (tab === 'search') {
            setShowSearch(true)
          } else if (tab === 'smart') {
            setShowSmartSearch(true)
          } else if (tab === 'bookmarks') {
            setShowNavPanel(true)
            // Можно добавить отдельный view для закладок
          }
        }}
      />

      {/* Smart Search Modal */}
      <SmartSearch
        isOpen={showSmartSearch}
        onClose={() => setShowSmartSearch(false)}
        onSelectAyah={(surah, ayah) => {
          setCurrentSurah(surah)
          setJumpToAyah(ayah)
          setCurrentAyah(ayah)
        }}
      />

      {/* Modals */}
      {showSurahList && (
        <SurahList
          surahs={surahs}
          currentSurah={currentSurah}
          onSelectSurah={(num) => {
            setCurrentSurah(num)
            setShowSurahList(false)
          }}
          onClose={() => setShowSurahList(false)}
        />
      )}

      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onSelectSurah={(num) => {
            setCurrentSurah(num)
            setShowSearch(false)
          }}
        />
      )}
    </div>
  )
}

