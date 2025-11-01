import { useState } from 'react'
import { donationsService } from '../services/donationsService'
import LoadingSpinner from '../components/LoadingSpinner'
import '../App.css'

const SupportPage = () => {
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [donating, setDonating] = useState(false)

  const presetAmounts = [500, 1000, 2500, 5000]

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
    if (amount <= 0) {
      alert('Укажите сумму')
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
        window.open(donation.payment_url, '_blank')
      }
    } catch (error) {
      console.error('Error initiating donation:', error)
      alert('Ошибка при создании пожертвования')
    } finally {
      setDonating(false)
    }
  }

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">
        <span>💝</span>
        Поддержать проект
      </h1>
      <p className="page-subtitle">
        Быстрое пожертвование на общие цели благотворительности
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤲</div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#ffffff' }}>
          Ваше пожертвование помогает
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.95 }}>
          Каждая копейка идет на благое дело
        </p>
      </div>

      <div className="amount-selection">
        <h3 style={{ marginBottom: '20px' }}>Выберите сумму</h3>
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
          style={{ fontSize: '18px', padding: '16px' }}
        >
          {donating ? (
            <>
              <LoadingSpinner size="sm" />
              Обработка...
            </>
          ) : (
            <>
              <span>💝</span>
              Поддержать проект
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SupportPage

