import { useState, useEffect } from 'react'
import { historyService, HistoryItem } from '../services/historyService'
import { useToast } from '../hooks/useToast'
import LoadingSpinner from '../components/LoadingSpinner'
import Icon from '../components/Icon'
import '../App.css'

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { error } = useToast()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory()
      setHistory(data)
    } catch (err: any) {
      console.error('Error loading history:', err)
      error(err.message || 'Ошибка при загрузке истории')
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (item: HistoryItem) => {
    if (item.type === 'donation') {
      return 'heart'
    } else if (item.type === 'subscription') {
      return 'repeat'
    }
    return 'coins'
  }

  const getTransactionIconBg = (item: HistoryItem) => {
    if (item.type === 'donation') {
      return 'var(--success)'
    } else if (item.type === 'subscription') {
      return 'var(--primary)'
    }
    return 'var(--warning)'
  }

  const getTransactionTitle = (item: HistoryItem) => {
    if (item.type === 'donation') {
      if (item.campaign_id) {
        return 'Пожертвование в кампанию'
      } else if (item.fund_id) {
        return 'Пожертвование в фонд'
      }
      return 'Пожертвование'
    } else if (item.type === 'subscription') {
      return `Подписка ${item.plan || ''}`
    }
    return 'Транзакция'
  }

  const getAmountColor = (status: string) => {
    if (status === 'completed') {
      return '#41d4a8'
    } else if (status === 'failed') {
      return '#ff4b4a'
    }
    return '#f59e0b'
  }

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '24px', letterSpacing: '-0.03em' }}>
        История пожертвований
      </h1>

      {history.length === 0 ? (
        <div 
          className="card"
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            borderRadius: '16px',
            background: 'var(--tg-theme-secondary-bg-color, var(--bg-primary))',
            boxShadow: 'none',
          }}
        >
          <Icon name="inbox" size={48} color="#718ebf" />
          <p style={{ marginTop: '16px', color: '#718ebf', fontSize: '15px' }}>
            Пока нет транзакций
          </p>
        </div>
      ) : (
        history.map((item) => (
          <div 
            key={item.id} 
            className="card"
            style={{
              marginBottom: '16px',
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--tg-theme-secondary-bg-color, var(--bg-primary))',
              boxShadow: 'none',
              border: 'none',
              transition: 'background-color var(--transition-base)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Иконка с градиентным фоном */}
              <div
                style={{
                  width: '55px',
                  height: '55px',
                  borderRadius: '12px',
                  background: getTransactionIconBg(item),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'none',
                }}
              >
                <Icon 
                  name={getTransactionIcon(item)} 
                  size={28} 
                  color="#ffffff" 
                  strokeWidth={2.5}
                />
              </div>

              {/* Информация о транзакции */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#232323',
                    marginBottom: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  {getTransactionTitle(item)}
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    color: '#718ebf',
                    lineHeight: 1.4,
                  }}
                >
                  {new Date(item.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Сумма и статус */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: getAmountColor(item.status),
                    marginBottom: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  {item.status === 'completed' ? '+' : item.status === 'failed' ? '-' : ''}
                  {item.amount.toLocaleString('ru-RU')} {item.currency}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#718ebf',
                    lineHeight: 1.4,
                  }}
                >
                  {item.status === 'completed'
                    ? 'Завершено'
                    : item.status === 'failed'
                    ? 'Ошибка'
                    : 'В процессе'}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default HistoryPage

