'use client'

import { useState, useMemo } from 'react'
import { X, Search } from 'lucide-react'

interface Surah {
  number: number
  name: string
  englishName: string
  numberOfAyahs: number
}

interface SurahListProps {
  surahs: Surah[]
  currentSurah: number
  onSelectSurah: (number: number) => void
  onClose: () => void
}

export default function SurahList({
  surahs,
  currentSurah,
  onSelectSurah,
  onClose,
}: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs
    
    const query = searchQuery.toLowerCase()
    return surahs.filter(surah =>
      surah.englishName.toLowerCase().includes(query) ||
      surah.name.toLowerCase().includes(query) ||
      surah.number.toString().includes(query)
    )
  }, [surahs, searchQuery])

  return (
    <div className="fixed inset-0 z-40">
      <div 
        className="fixed inset-0 bg-black transition-opacity duration-300 opacity-50"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto animate-slideInRight">
          <div className="flex items-center justify-between p-5 border-b dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Список Сур
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {surahs.length} сур
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или номеру суры..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                dir="ltr"
              />
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Найдено: {filteredSurahs.length} из {surahs.length}
              </div>
            )}
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            {filteredSurahs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Суры не найдены
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => {
                      onSelectSurah(surah.number)
                      onClose()
                    }}
                    className={`text-right p-4 rounded-2xl transition-all duration-200 active:scale-95 ${
                      currentSurah === surah.number
                        ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {surah.englishName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {surah.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {surah.numberOfAyahs} аятов
                        </div>
                      </div>
                      <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ml-4">
                        {surah.number}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
