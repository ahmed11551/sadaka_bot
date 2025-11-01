import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTelegramWebApp } from './hooks/useTelegramWebApp'
import { useToast } from './hooks/useToast'
import TabNavigation from './components/TabNavigation'
import DonatePage from './pages/DonatePage'
import SupportPage from './pages/SupportPage'
import CampaignsPage from './pages/CampaignsPage'
import CampaignDetailPage from './pages/CampaignDetailPage'
import SubscriptionPage from './pages/SubscriptionPage'
import ZakatPage from './pages/ZakatPage'
import PartnersPage from './pages/PartnersPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import './App.css'
import './styles/theme.css'

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
  const { ToastContainer } = useToast()
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
  }, [])

  return (
    <Router>
      <div className="app">
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
        <TabNavigation />
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App

