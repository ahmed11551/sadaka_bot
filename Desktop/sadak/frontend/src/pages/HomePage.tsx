import { Link } from 'react-router-dom'
import '../App.css'

const HomePage = () => {
  const quickActions = [
    { path: '/donate', icon: '💰', label: 'Пожертвовать', color: '#3b82f6' },
    { path: '/support', icon: '💝', label: 'Поддержать', color: '#10b981' },
    { path: '/campaigns', icon: '🎯', label: 'Кампании', color: '#f59e0b' },
    { path: '/zakat', icon: '📿', label: 'Закят', color: '#8b5cf6' },
  ]

  const features = [
    { icon: '🔒', title: 'Безопасно', desc: 'Защищенные платежи' },
    { icon: '✓', title: 'Прозрачно', desc: 'Отчеты по каждому проекту' },
    { icon: '⚡', title: 'Быстро', desc: 'Пожертвование за минуту' },
    { icon: '🌍', title: 'Универсально', desc: 'Поддержка разных фондов' },
  ]

  return (
    <div className="page-container fade-in">
      {/* Hero Section */}
      <div 
        className="gradient-primary"
        style={{ 
          borderRadius: '24px', 
          padding: '40px 24px', 
          marginBottom: '32px',
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤲</div>
        <h1 style={{ fontSize: '32px', marginBottom: '12px', color: '#ffffff' }}>
          Садака-Пасс
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.95, marginBottom: 0 }}>
          Современная платформа для благотворительных пожертвований
        </p>
      </div>

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
              className="card"
              style={{ 
                textDecoration: 'none', 
                textAlign: 'center',
                padding: '24px 16px',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '12px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>
                {action.icon}
              </div>
              <div className="card-title" style={{ margin: 0 }}>
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
              className="card"
              style={{ 
                textAlign: 'center',
                padding: '20px 16px'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {feature.icon}
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '4px' 
              }}>
                {feature.title}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-muted)' 
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

