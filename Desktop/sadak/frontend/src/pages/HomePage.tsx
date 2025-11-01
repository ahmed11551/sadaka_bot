import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Icon from '../components/Icon'
import { historyService, UserStats } from '../services/historyService'
import LoadingSpinner from '../components/LoadingSpinner'
import '../App.css'

const HomePage = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const quickActions = [
    { path: '/donate', icon: 'coins' as const, label: 'Пожертвовать', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    { path: '/support', icon: 'heart' as const, label: 'Поддержать', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { path: '/campaigns', icon: 'target' as const, label: 'Кампании', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    { path: '/zakat', icon: 'handHeart' as const, label: 'Закят', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
  ]

  const features = [
    { icon: 'shield' as const, title: 'Безопасно', desc: 'Защищенные платежи' },
    { icon: 'checkCircle' as const, title: 'Прозрачно', desc: 'Отчеты по каждому проекту' },
    { icon: 'zap' as const, title: 'Быстро', desc: 'Пожертвование за минуту' },
    { icon: 'globe' as const, title: 'Универсально', desc: 'Поддержка разных фондов' },
  ]

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await historyService.getStats()
      setStats(data)
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  return (
    <div className="page-container fade-in">
      {/* Hero Section */}
      <div 
        className="hero-section"
        style={{ 
          borderRadius: '24px', 
          padding: '48px 24px', 
          marginBottom: '32px',
          textAlign: 'center',
          color: '#ffffff',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{ 
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Icon name="handHeart" size={40} color="#ffffff" strokeWidth={2.5} />
          </div>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '12px', 
            color: '#ffffff',
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Садака-Пасс
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.95, 
            marginBottom: 0,
            textShadow: '0 1px 5px rgba(0,0,0,0.1)'
          }}>
            Современная платформа для благотворительных пожертвований
          </p>
        </div>
      </div>

      {/* Stats Widget - вдохновлено DAYIM */}
      {!loadingStats && stats && (
        <div 
          className="card"
          style={{ 
            marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            padding: '24px'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div className="card-title" style={{ margin: 0 }}>
              Ваша статистика
            </div>
            {stats.active_subscriptions > 0 && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                background: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)'
              }}>
                {stats.active_subscriptions} {stats.active_subscriptions === 1 ? 'подписка' : 'подписок'}
              </span>
            )}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px' 
          }}>
            <div>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '4px'
              }}>
                За этот месяц
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                {stats.total_donations_month.toLocaleString('ru-RU')} {stats.currency}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--tg-theme-hint-color)',
                marginTop: '4px'
              }}>
                {stats.total_count_month} {stats.total_count_month === 1 ? 'транзакция' : stats.total_count_month < 5 ? 'транзакции' : 'транзакций'}
              </div>
            </div>
            
            <div>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '4px'
              }}>
                За этот год
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                {stats.total_donations_year.toLocaleString('ru-RU')} {stats.currency}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--tg-theme-hint-color)',
                marginTop: '4px'
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
              background: 'rgba(102, 126, 234, 0.05)',
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)'
            }}>
              💫 Начните делать добрые дела прямо сейчас!
            </div>
          )}
        </div>
      )}

      {loadingStats && (
        <div className="card" style={{ marginBottom: '32px', textAlign: 'center', padding: '32px' }}>
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Быстрые действия</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px' 
        }}>
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="quick-action-card"
              style={{ 
                textDecoration: 'none', 
                textAlign: 'center',
                padding: '28px 20px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: action.gradient,
                opacity: 0.05,
                transition: 'opacity 0.3s'
              }} />
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: action.gradient,
                marginBottom: '16px',
                boxShadow: `0 8px 16px ${action.color}40`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                zIndex: 1
              }}>
                <Icon name={action.icon} size={32} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div className="card-title" style={{ 
                margin: 0,
                position: 'relative',
                zIndex: 1,
                fontWeight: 600
              }}>
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Почему Садака-Пасс?</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px' 
        }}>
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="feature-card"
              style={{ 
                textAlign: 'center',
                padding: '24px 16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(36, 129, 204, 0.1) 0%, rgba(36, 129, 204, 0.05) 100%)',
                marginBottom: '12px',
                transition: 'all 0.3s'
              }}>
                <Icon name={feature.icon} size={28} color="var(--primary)" strokeWidth={2.5} />
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '6px',
                color: 'var(--text-primary)'
              }}>
                {feature.title}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="card-title">О проекте</div>
        <div className="card-description">
          Садака-Пасс — это универсальная платформа для совершения благотворительных 
          пожертвований (садака, закят), управления регулярными подписками (садака-джария) 
          и организации целевых кампаний. Мы обеспечиваем прозрачность, безопасность 
          и удобство для доноров и получателей помощи.
        </div>
      </div>
    </div>
  )
}

export default HomePage

