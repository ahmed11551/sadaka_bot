'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QuranReader from '@/components/QuranReader'
import TelegramWidget from '@/components/TelegramWidget'
import ErrorBoundary from '@/components/ErrorBoundary'
import { BookOpen } from 'lucide-react'

function HomeContent() {
  const [isTelegram, setIsTelegram] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Проверка, открыто ли приложение в Telegram
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      setIsTelegram(true)
      const tg = (window as any).Telegram.WebApp
      tg.ready()
      tg.expand()
      
      // Открываем нужную суру, если передан параметр
      const surahParam = searchParams?.get('surah')
      if (surahParam) {
        // Передадим это в QuranReader через пропсы
      }
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              القرآن الكريم
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The Holy Quran Reader
          </p>
          {isTelegram && (
            <div className="mt-4 inline-block px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full">
              <span className="text-green-700 dark:text-green-300 text-sm">
                ✓ Opened in Telegram
              </span>
            </div>
          )}
        </header>

        <ErrorBoundary>
          <QuranReader 
            initialSurah={searchParams?.get('surah') ? parseInt(searchParams.get('surah')!) : undefined}
            initialView={searchParams?.get('view') as 'surahs' | 'search' | 'bookmarks' | undefined}
            searchQuery={searchParams?.get('search') || undefined}
          />
        </ErrorBoundary>
        <TelegramWidget />
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}

