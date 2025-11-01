import { useState, useEffect } from 'react'
import { fundsService, Fund } from '../services/fundsService'
import { donationsService } from '../services/donationsService'
import LoadingSpinner from '../components/LoadingSpinner'
import Skeleton from '../components/Skeleton'
import FilterBar from '../components/FilterBar'
import Icon from '../components/Icon'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/useToast'
import '../App.css'

const DonatePage = () => {
  const [funds, setFunds] = useState<Fund[]>([])
  const [filteredFunds, setFilteredFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const { success, error, warning } = useToast()
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  const presetAmounts = [100, 250, 500, 1000, 2500]
  
  // Получаем уникальные категории из фондов
  const categories = Array.from(new Set(funds.flatMap(f => f.categories || [])))

  useEffect(() => {
    loadFunds()
  }, [])

  useEffect(() => {
    let filtered = funds

    // Фильтр по поисковому запросу
    if (debouncedSearch) {
      filtered = filtered.filter(fund =>
        fund.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        fund.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter(fund =>
        fund.categories.includes(selectedCategory)
      )
    }

    setFilteredFunds(filtered)
  }, [funds, debouncedSearch, selectedCategory])

  const loadFunds = async () => {
    try {
      const data = await fundsService.getFunds({ verified: true })
      setFunds(data)
      setFilteredFunds(data) // Устанавливаем начальное значение
    } catch (error) {
      console.error('Error loading funds:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAmountSelect = (value: number) => {
    setAmount(value)
    setCustomAmount('')
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue)
    }
  }

  const handleDonate = async () => {
    if (!selectedFund || amount <= 0) {
      warning('Выберите фонд и укажите сумму')
      return
    }

    setDonating(true)
    try {
      const donation = await donationsService.initDonation({
        fund_id: selectedFund.id,
        amount_value: amount,
        currency: 'RUB',
        donation_type: 'sadaqa',
      })

      if (donation.payment_url) {
        success('Переход на оплату...')
        window.open(donation.payment_url, '_blank')
      }
    } catch (err: any) {
      console.error('Error initiating donation:', err)
      error(err.response?.data?.detail || 'Ошибка при создании пожертвования')
    } finally {
      setDonating(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <Skeleton height="32px" width="200px" className="page-title" />
        <div className="funds-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <Skeleton className="skeleton-avatar" />
              <Skeleton height="24px" width="60%" className="skeleton-title" />
              <Skeleton height="16px" className="skeleton-text" />
              <Skeleton height="16px" width="80%" className="skeleton-text short" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">
        <Icon name="coins" size={28} />
        Пожертвовать
      </h1>
      <p className="page-subtitle">
        Выберите фонд и поддержите благотворительный проект
      </p>

      {/* Поиск и фильтры */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Поиск фондов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        {categories.length > 0 && (
          <FilterBar
            filters={[
              {
                label: 'Категория',
                options: categories.map(cat => ({ value: cat, label: cat })),
                value: selectedCategory,
                onChange: setSelectedCategory,
              },
            ]}
          />
        )}
      </div>

      {/* Выбор фонда */}
      <div className="funds-list">
        {filteredFunds.length === 0 && funds.length > 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Фонды не найдены по заданным критериям
            </p>
          </div>
        ) : funds.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Фонды пока не добавлены
            </p>
          </div>
        ) : (
          filteredFunds.map((fund) => (
            <div
              key={fund.id}
              className={`card ${selectedFund?.id === fund.id ? 'selected' : ''}`}
              onClick={() => setSelectedFund(fund)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                {fund.logo_url ? (
                  <img src={fund.logo_url} alt={fund.name} className="fund-logo" />
                ) : (
                  <div 
                    className="fund-logo" 
                    style={{ 
                      background: 'var(--gradient-primary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    🏛️
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div className="card-title">{fund.name}</div>
                    {fund.verified && (
                      <span className="badge">
                        <Icon name="checkCircle" size={14} />
                        Проверено
                      </span>
                    )}
                  </div>
                  {fund.description && (
                    <div className="card-description">{fund.description}</div>
                  )}
                  {fund.categories && fund.categories.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {fund.categories.map((cat) => (
                        <span key={cat} className="badge badge-secondary">{cat}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Выбор суммы */}
      {selectedFund && (
        <div className="amount-selection fade-in" style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>Выберите сумму пожертвования</h3>
          <div className="preset-amounts">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                className={`btn-preset ${amount === preset ? 'active' : ''}`}
                onClick={() => handleAmountSelect(preset)}
              >
                <span>{preset.toLocaleString('ru-RU')} ₽</span>
              </button>
            ))}
          </div>
          <div className="form-group" style={{ marginTop: '24px' }}>
            <label className="form-label">Или укажите свою сумму</label>
            <input
              type="number"
              className="form-input"
              placeholder="Введите сумму"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              min="1"
              step="1"
            />
          </div>

          {amount > 0 && (
            <div 
              style={{ 
                background: 'var(--bg-primary)', 
                padding: '16px', 
                borderRadius: '12px',
                marginBottom: '16px',
                textAlign: 'center',
                border: '2px solid var(--accent)'
              }}
            >
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Сумма пожертвования
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent)' }}>
                {amount.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={handleDonate}
            disabled={amount <= 0 || donating}
          >
            {donating ? (
              <>
                <LoadingSpinner size="sm" />
                Обработка...
              </>
            ) : (
              <>
                <Icon name="heart" size={20} />
                <span className="btn-text-responsive">
                  Пожертвовать {amount.toLocaleString('ru-RU')} ₽
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default DonatePage

