import { useState } from 'react'
import { donationsService } from '../services/donationsService'
import LoadingSpinner from '../components/LoadingSpinner'
import Icon from '../components/Icon'
import { useToast } from '../hooks/useToast'
import '../App.css'

const SupportPage = () => {
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [donating, setDonating] = useState(false)
  const { success, error, warning } = useToast()

  const presetAmounts = [500, 1000, 2500, 5000]

  const handleAmountSelect = (value: number) => {
    setAmount(value)
    setCustomAmount('')
  }

  const handleCustomAmount = (value: string) => {
    const numValue = parseFloat(value)
    // Валидация: только положительные числа, максимум разумная сумма
    if (value === '' || (!isNaN(numValue) && numValue > 0 && numValue <= 100000000)) {
      setCustomAmount(value)
      if (!isNaN(numValue) && numValue > 0) {
        setAmount(numValue)
      } else {
        setAmount(0)
      }
    }
  }

  const handleDonate = async () => {
    if (amount <= 0) {
      warning('Укажите сумму')
      return
    }

    setDonating(true)
    try {
      const donation = await donationsService.initDonation({
        amount_value: amount,
        currency: 'RUB',
        donation_type: 'quick',
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

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">
        <Icon name="heart" size={28} />
        Поддержка проекта
      </h1>
      <p className="page-subtitle">
        Быстрое благотворительное пожертвование для поддержки развития проекта MubarakWay
      </p>

      <div 
        className="gradient-accent"
        style={{ 
          borderRadius: '24px', 
          padding: '32px 24px', 
          marginBottom: '32px',
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Icon name="handHeart" size={48} color="#ffffff" />
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#ffffff' }}>
          Ваше пожертвование помогает
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.95 }}>
          Каждая копейка идет на благое дело
        </p>
      </div>

      <div className="amount-selection">
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>Выберите сумму</h3>
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
            max="100000000"
          />
        </div>

        {amount > 0 && (
          <div 
            style={{ 
              background: 'var(--bg-primary)', 
              padding: '20px', 
              borderRadius: '16px',
              marginBottom: '20px',
              textAlign: 'center',
              border: '2px solid var(--accent)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Сумма пожертвования
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--accent)' }}>
              {amount.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        )}

        <button 
          className="btn btn-primary" 
          onClick={handleDonate}
          disabled={amount <= 0 || donating}
          style={{ 
            fontSize: '20px', 
            padding: '20px 32px',
            minHeight: '64px',
            background: amount > 0 && !donating 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' 
              : undefined,
            boxShadow: amount > 0 && !donating
              ? '0 8px 24px rgba(16, 185, 129, 0.5), 0 4px 12px rgba(16, 185, 129, 0.3)'
              : undefined
          }}
        >
          {donating ? (
            <>
              <LoadingSpinner size="sm" />
              Обработка...
            </>
          ) : (
            <>
              <Icon name="heart" size={22} color="#ffffff" />
              <span style={{ marginLeft: '8px', fontWeight: '700' }}>
                Перейти к оплате
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SupportPage

