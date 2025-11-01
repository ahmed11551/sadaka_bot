'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Volume2, VolumeX } from 'lucide-react'

interface AyahCardProps {
  ayah: {
    number: number
    text: string
    numberInSurah: number
  }
  surah: number
  surahName: string
  isBookmarked: boolean
  onToggleBookmark: () => void
}

interface Translation {
  text: string
  language: string
}

export default function AyahCard({
  ayah,
  surah,
  surahName,
  isBookmarked,
  onToggleBookmark,
}: AyahCardProps) {
  const [translation, setTranslation] = useState<Translation | null>(null)
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Загружаем аудио URL из API
    const loadAudio = async () => {
      try {
        // Используем альтернативный API для аудио
        const response = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surah}:${ayah.numberInSurah}/editions/audio-quran-images`
        )
        const data = await response.json()
        if (data.code === 200 && data.data?.audio) {
          setAudioUrl(data.data.audio)
        }
      } catch (error) {
        console.error('Error loading audio:', error)
      }
    }
    
    loadAudio()
    
    return () => {
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah, ayah.numberInSurah])

  const fetchTranslation = async () => {
    if (translation || loadingTranslation) return
    
    setLoadingTranslation(true)
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surah}:${ayah.numberInSurah}/ru.abdulazizkarimov`
      )
      const data = await response.json()
      if (data.code === 200 && data.data?.text) {
        setTranslation({
          text: data.data.text,
          language: 'ru'
        })
        setShowTranslation(true)
      }
    } catch (error) {
      console.error('Error fetching translation:', error)
    } finally {
      setLoadingTranslation(false)
    }
  }

  const toggleAudio = () => {
    if (!audioUrl) {
      fetchTranslation() // Показываем перевод если аудио недоступно
      return
    }

    if (audio && isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      const newAudio = new Audio(audioUrl)
      newAudio.onended = () => setIsPlaying(false)
      newAudio.onerror = () => {
        setIsPlaying(false)
        console.error('Error playing audio')
      }
      newAudio.play().catch(error => {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
      })
      setAudio(newAudio)
      setIsPlaying(true)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
            {surah}:{ayah.numberInSurah}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            disabled={!audioUrl && loadingTranslation}
            className={`p-2 rounded-lg transition-colors ${
              isPlaying
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
          >
            {isPlaying ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className="arabic-text text-gray-800 dark:text-gray-200 mb-4 leading-relaxed break-words whitespace-pre-wrap">
        {ayah.text}
      </div>

      {/* Перевод */}
      <div className="mb-4">
        {showTranslation && translation ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Перевод на русский:
            </div>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {translation.text}
            </div>
          </div>
        ) : (
          <button
            onClick={fetchTranslation}
            disabled={loadingTranslation}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
          >
            {loadingTranslation ? 'Загрузка...' : 'Показать перевод'}
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 border-t pt-3 dark:border-gray-700">
        Сура {surahName}, Аят {ayah.numberInSurah}
      </div>
    </div>
  )
}

