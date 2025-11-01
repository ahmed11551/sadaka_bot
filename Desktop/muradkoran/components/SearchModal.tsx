'use client'

import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

interface Surah {
  number: number
  name: string
  englishName: string
  numberOfAyahs: number
}

interface SearchModalProps {
  onClose: () => void
  onSelectSurah: (number: number) => void
}

export default function SearchModal({ onClose, onSelectSurah }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [surahs, setSurahs] = useState<Surah[]>([])

  useEffect(() => {
    fetchSurahs()
  }, [])

  const fetchSurahs = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah')
      const data = await response.json()
      if (data.code === 200) {
        setSurahs(data.data)
      }
    } catch (error) {
      console.error('Error fetching surahs:', error)
    }
  }

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Поиск Суры
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите название или номер суры..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              dir="ltr"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredSurahs.length > 0 ? (
              filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => {
                    onSelectSurah(surah.number)
                    onClose()
                  }}
                  className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {surah.number}. {surah.englishName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {surah.name}
                      </div>
                    </div>
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ml-4 flex-shrink-0">
                      {surah.number}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Сура не найдена
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

