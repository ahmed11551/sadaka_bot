'use client'

import { Home, BookOpen, Search, Bookmark, Sparkles } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: 'home' | 'search' | 'bookmarks' | 'smart'
  onTabChange: (tab: 'home' | 'search' | 'bookmarks' | 'smart') => void
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Главная', icon: Home },
    { id: 'search' as const, label: 'Поиск', icon: Search },
    { id: 'smart' as const, label: 'Умный', icon: Sparkles },
    { id: 'bookmarks' as const, label: 'Закладки', icon: Bookmark },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className={`relative mb-1 ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                <Icon className="w-6 h-6" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 dark:bg-green-400 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

