import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTelegramWebApp } from './hooks/useTelegramWebApp'
import { useToast } from './hooks/useToast'
import { setShareToastCallback } from './utils/share'
import DynamicBottomNav from './components/DynamicBottomNav'
import LoadingSpinner from './components/LoadingSpinner'
import PageTransition from './components/PageTransition'
import './App.css'
import './styles/theme.css'

// Lazy loading для всех страниц - улучшает производительность
const HomePage = lazy(() => import('./pages/HomePage'))
const DonatePage = lazy(() => import('./pages/DonatePage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const CampaignsPage = lazy(() => import('./pages/CampaignsPage'))
const CampaignDetailPage = lazy(() => import('./pages/CampaignDetailPage'))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'))
const ZakatPage = lazy(() => import('./pages/ZakatPage'))
const PartnersPage = lazy(() => import('./pages/PartnersPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))

// Компонент загрузки для Suspense
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh' 
  }}>
    <LoadingSpinner />
  </div>
)

// Проверка наличия Telegram WebApp
const isTelegramWebApp = () => {
  try {
    // @ts-ignore
    return typeof window !== 'undefined' && window.Telegram?.WebApp
  } catch {
    return false
  }
}

function App() {
  const { initTelegramWebApp } = useTelegramWebApp()
  const { ToastContainer, success } = useToast()
  const isTelegram = isTelegramWebApp()

  useEffect(() => {
    // Инициализация Telegram WebApp только если он доступен
    if (isTelegram) {
      try {
        // @ts-ignore
        const WebApp = window.Telegram.WebApp
        WebApp.ready()
        WebApp.expand()
        initTelegramWebApp()
      } catch (e) {
        console.log('Telegram WebApp not available, running in web mode')
      }
    }
    
    // Настройка callback для Toast в утилитах шаринга
    setShareToastCallback((message, type = 'success') => {
      if (type === 'success') success(message)
      // Для других типов можно добавить отдельные обработчики если нужно
    })
  }, [success])

  return (
    <Router>
      <div className="app">
        <Suspense fallback={<PageLoader />}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/zakat" element={<ZakatPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </PageTransition>
        </Suspense>
        <DynamicBottomNav />
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App

