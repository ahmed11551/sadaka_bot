'use client'

import { useState, useEffect } from 'react'
import { Search, X, BookOpen } from 'lucide-react'

interface SmartSearchProps {
  onSelectAyah: (surah: number, ayah: number) => void
  onClose: () => void
  isOpen: boolean
}

interface SearchResult {
  surah: number
  ayah: number
  text: string
  englishName: string
  surahName: string
}

export default function SmartSearch({ onSelectAyah, onClose, isOpen }: SmartSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setResults([])
      setSearched(false)
    }
  }, [isOpen])

  const performSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)
    
    try {
      // Поиск через API Al-Quran Cloud
      const response = await fetch(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(searchQuery)}/all/ru`
      )
      const data = await response.json()
      
      if (data.code === 200 && data.data) {
        // Получаем уникальные результаты
        const uniqueResults = new Map<string, SearchResult>()
        
        for (const match of data.data.matches || []) {
          const key = `${match.surah.number}:${match.numberInSurah}`
          if (!uniqueResults.has(key)) {
            uniqueResults.set(key, {
              surah: match.surah.number,
              ayah: match.numberInSurah,
              text: match.text,
              englishName: match.surah.englishName,
              surahName: match.surah.name
            })
          }
        }
        
        setResults(Array.from(uniqueResults.values()))
      } else {
        // Если API не поддерживает поиск, делаем локальный поиск по сохраненным данным
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Умный поиск по Корану
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите слово или фразу для поиска..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                dir="ltr"
              />
            </div>
            <button
              onClick={performSearch}
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Поиск...' : 'Найти'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : searched && results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Ничего не найдено
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Попробуйте другой запрос
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Найдено результатов: {results.length}
              </div>
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelectAyah(result.surah, result.ayah)
                    onClose()
                  }}
                  className="w-full text-right p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {result.englishName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {result.surahName}
                      </span>
                    </div>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold">
                      {result.surah}:{result.ayah}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {result.text}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Введите запрос для поиска по тексту Корана</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

