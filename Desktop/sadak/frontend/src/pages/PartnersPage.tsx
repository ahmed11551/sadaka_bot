import { useState, useEffect } from 'react'
import { fundsService, Fund } from '../services/fundsService'
import Icon from '../components/Icon'
import { useToast } from '../hooks/useToast'
import LoadingSpinner from '../components/LoadingSpinner'
import '../App.css'

const PartnersPage = () => {
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(true)
  const { error } = useToast()

  useEffect(() => {
    loadFunds()
  }, [])

  const loadFunds = async () => {
    try {
      const data = await fundsService.getFunds()
      setFunds(data)
    } catch (err: any) {
      console.error('Error loading funds:', err)
      error(err.message || 'Ошибка при загрузке фондов')
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
      <h1 className="page-title">Фонды-партнёры</h1>
      <p style={{ marginBottom: '24px', color: 'var(--tg-theme-hint-color)' }}>
        Проверенные благотворительные организации
      </p>

      <button className="btn btn-secondary" style={{ marginBottom: '16px' }}>
        Подать заявку на партнёрство
      </button>

      {funds.length === 0 ? (
        <div className="card">
          <p>Пока нет зарегистрированных фондов</p>
        </div>
      ) : (
        funds.map((fund) => (
          <div key={fund.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              {fund.logo_url && (
                <img
                  src={fund.logo_url}
                  alt={fund.name}
                  style={{ width: '60px', height: '60px', borderRadius: '8px', marginRight: '12px' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div className="card-title">{fund.name}</div>
                {fund.verified && (
                  <span className="badge" style={{ marginTop: '4px' }}>
                    <Icon name="checkCircle" size={14} />
                    Проверено
                  </span>
                )}
              </div>
            </div>
            
            {fund.description && (
              <div className="card-description">{fund.description}</div>
            )}
            
            {fund.categories.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {fund.categories.map((cat) => (
                  <span key={cat} className="badge" style={{ marginRight: '4px' }}>
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <button className="btn btn-primary" style={{ marginTop: '12px' }}>
              Помочь
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default PartnersPage

