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
    { path: '/donate', icon: 'coins' as const, label: 'Пожертвования', color: '#3390ec' },
    { path: '/support', icon: 'heart' as const, label: 'Поддержать', color: '#3390ec' },
    { path: '/campaigns', icon: 'target' as const, label: 'Кампании', color: '#3390ec' },
    { path: '/zakat', icon: 'handHeart' as const, label: 'Закят', color: '#3390ec' },
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
          fontSize: '28px', 
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, var(--text-heading))',
          margin: 0,
          lineHeight: '1.2'
        }}>
          Обзор платформы
        </h1>
      </div>

      {/* Карусель срочных кампаний - ВЕРХНИЙ БЛОК */}
      <UrgentCampaignsCarousel maxItems={5} />

      {/* Quick Actions - в стиле BankDash Quick Transfer */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, var(--text-heading))',
          marginBottom: '16px',
          padding: '0 4px'
        }}>
          Быстрые действия
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px',
          padding: '0 4px'
        }}>
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="card interactive-card stagger-item"
              onClick={() => haptic.impactOccurred('light')}
              style={{ 
                textDecoration: 'none',
                textAlign: 'center',
                padding: '16px 8px',
                borderRadius: '16px',
                background: 'var(--tg-theme-secondary-bg-color, var(--bg-primary))',
                border: 'none',
                transition: 'background-color 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: action.color,
                marginBottom: '8px',
              }}>
                <Icon name={action.icon} size={20} color="#ffffff" strokeWidth={2} />
              </div>
              <div style={{ 
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--tg-theme-text-color, var(--text-primary))',
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
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '16px',
            background: 'var(--tg-theme-secondary-bg-color, var(--bg-primary))',
            border: 'none',
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 600,
              color: 'var(--tg-theme-text-color, var(--text-heading))',
              margin: 0
            }}>
              Ваша статистика
            </h2>
            {stats.active_subscriptions > 0 && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 500,
                background: 'var(--primary)',
                color: '#ffffff',
              }}>
                {stats.active_subscriptions} {stats.active_subscriptions === 1 ? 'подписка' : 'подписок'}
              </span>
            )}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px' 
          }}>
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: 'none'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--tg-theme-hint-color, var(--text-muted))',
                marginBottom: '8px',
                fontWeight: 400
              }}>
                За этот месяц
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 600,
                color: 'var(--tg-theme-text-color, var(--text-primary))',
                marginBottom: '4px',
              }}>
                {stats.total_donations_month.toLocaleString('ru-RU')} {stats.currency}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--tg-theme-hint-color, var(--text-muted))',
                fontWeight: 400
              }}>
                {stats.total_count_month} {stats.total_count_month === 1 ? 'транзакция' : stats.total_count_month < 5 ? 'транзакции' : 'транзакций'}
              </div>
            </div>
            
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: 'none'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--tg-theme-hint-color, var(--text-muted))',
                marginBottom: '8px',
                fontWeight: 400
              }}>
                За этот год
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 600,
                color: 'var(--tg-theme-text-color, var(--text-primary))',
                marginBottom: '4px',
              }}>
                {stats.total_donations_year.toLocaleString('ru-RU')} {stats.currency}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--tg-theme-hint-color, var(--text-muted))',
                fontWeight: 400
              }}>
                {stats.total_count_year} {stats.total_count_year === 1 ? 'транзакция' : stats.total_count_year < 5 ? 'транзакции' : 'транзакций'}
              </div>
            </div>
          </div>

          {(stats.total_donations_month === 0 && stats.total_donations_year === 0) && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color, var(--text-muted))',
              fontWeight: 400,
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

