import { useState, useEffect } from 'react'
import { historyService, HistoryItem } from '../services/historyService'
import { useToast } from '../hooks/useToast'
import LoadingSpinner from '../components/LoadingSpinner'
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

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">История транзакций</h1>

      {history.length === 0 ? (
        <div className="card">
          <p>Пока нет транзакций</p>
        </div>
      ) : (
        history.map((item) => (
          <div key={item.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="card-title">
                  {item.type === 'donation' ? 'Пожертвование' : 'Подписка'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
                  {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {item.amount.toLocaleString()} {item.currency}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color:
                      item.status === 'completed'
                        ? 'green'
                        : item.status === 'failed'
                        ? 'red'
                        : 'orange',
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

