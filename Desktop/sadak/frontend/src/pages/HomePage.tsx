import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Icon from '../components/Icon'
import { historyService, UserStats } from '../services/historyService'
import LoadingSpinner from '../components/LoadingSpinner'
import UrgentCampaignsCarousel from '../components/UrgentCampaignsCarousel'
import PullToRefresh from '../components/PullToRefresh'
import { haptic } from '../utils/haptic'
import '../App.css'

const HomePage = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const quickActions = [
    { path: '/donate', icon: 'coins' as const, label: 'Пожертвования', color: '#3b82f6', gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)' },
    { path: '/support', icon: 'heart' as const, label: 'Поддержать', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' },
    { path: '/campaigns', icon: 'target' as const, label: 'Кампании', color: '#f59e0b', gradient: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)' },
    { path: '/zakat', icon: 'handHeart' as const, label: 'Закят', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' },
  ]

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoadingStats(true)
      const data = await historyService.getStats()
      setStats(data)
      haptic.notificationOccurred('success')
    } catch (err) {
      console.error('Error loading stats:', err)
      haptic.notificationOccurred('error')
    } finally {
      setLoadingStats(false)
    }
  }

  const handleRefresh = async () => {
    haptic.impactOccurred('medium')
    await loadStats()
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="page-container fade-in">
      {/* Заголовок в стиле BankDash */}
      <div style={{ 
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 800,
          color: 'var(--text-heading)',
          margin: 0,
          letterSpacing: '-0.03em',
          lineHeight: '1.15'
        }}>
          Обзор платформы
        </h1>
        {/* Индикатор обновления для теста */}
        <div style={{
          padding: '6px 12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '20px',
          fontSize: '11px',
          color: '#ffffff',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          ✨ Обновлено
        </div>
      </div>

      {/* Карусель срочных кампаний - ВЕРХНИЙ БЛОК */}
      <UrgentCampaignsCarousel maxItems={5} />

      {/* Quick Actions - в стиле BankDash Quick Transfer */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 700,
          color: 'var(--text-heading)',
          marginBottom: '20px',
          padding: '0 4px',
          letterSpacing: '-0.02em'
        }}>
          Быстрые действия
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px',
          padding: '0 4px'
        }}>
          {quickActions.map((action, index) => (
            <Link
              key={action.path}
              to={action.path}
              className="card interactive-card stagger-item"
              onClick={() => haptic.impactOccurred('light')}
              style={{ 
                textDecoration: 'none',
                textAlign: 'center',
                padding: '20px 12px',
                borderRadius: '25px',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
                border: '0.5px solid rgba(0,0,0,0.08)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '15px',
                background: action.gradient,
                marginBottom: '12px',
                boxShadow: `0 4px 12px ${action.color}30`,
              }}>
                <Icon name={action.icon} size={24} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div style={{ 
                fontSize: '13px',
                fontWeight: 500,
                color: '#343c6a',
                lineHeight: 1.3
              }}>
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Widget - в стиле BankDash */}
      {!loadingStats && stats && (
        <div 
          className="card"
          style={{ 
            marginBottom: '32px',
            padding: '28px',
            borderRadius: '25px',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
            border: '0.5px solid rgba(0,0,0,0.08)',
            animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards',
            animationDelay: '0.2s'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600,
              color: '#343c6a',
              margin: 0
            }}>
              Ваша статистика
            </h2>
            {stats.active_subscriptions > 0 && (
              <span style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #2d60ff 0%, #1814f3 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(45, 96, 255, 0.25)'
              }}>
                {stats.active_subscriptions} {stats.active_subscriptions === 1 ? 'подписка' : 'подписок'}
              </span>
            )}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px' 
          }}>
            <div style={{
              padding: '20px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
              border: '1px solid rgba(113, 142, 191, 0.1)'
            }}>
              <div style={{ 
                fontSize: '13px', 
                color: '#718ebf',
                marginBottom: '8px',
                fontWeight: 400
              }}>
                За этот месяц
              </div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 600,
                color: '#343c6a',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>
                {stats.total_donations_month.toLocaleString('ru-RU')} {stats.currency}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: '#718ebf',
                fontWeight: 400
              }}>
                {stats.total_count_month} {stats.total_count_month === 1 ? 'транзакция' : stats.total_count_month < 5 ? 'транзакции' : 'транзакций'}
              </div>
            </div>
            
            <div style={{
              padding: '20px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
              border: '1px solid rgba(113, 142, 191, 0.1)'
            }}>
              <div style={{ 
                fontSize: '13px', 
                color: '#718ebf',
                marginBottom: '8px',
                fontWeight: 400
              }}>
                За этот год
              </div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 600,
                color: '#343c6a',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>
                {stats.total_donations_year.toLocaleString('ru-RU')} {stats.currency}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: '#718ebf',
                fontWeight: 400
              }}>
                {stats.total_count_year} {stats.total_count_year === 1 ? 'транзакция' : stats.total_count_year < 5 ? 'транзакции' : 'транзакций'}
              </div>
            </div>
          </div>

          {(stats.total_donations_month === 0 && stats.total_donations_year === 0) && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, rgba(45, 96, 255, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
              textAlign: 'center',
              fontSize: '14px',
              color: '#718ebf',
              fontWeight: 400,
              border: '1px solid rgba(113, 142, 191, 0.15)'
            }}>
              💫 Начните делать добрые дела прямо сейчас!
            </div>
          )}
        </div>
      )}

      {loadingStats && (
        <div className="card" style={{ marginBottom: '32px', textAlign: 'center', padding: '32px', borderRadius: '25px' }}>
          <LoadingSpinner size="sm" />
        </div>
      )}
      </div>
    </PullToRefresh>
  )
}

export default HomePage

