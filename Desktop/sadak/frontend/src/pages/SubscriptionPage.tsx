import { useState } from 'react'
import '../App.css'

type SubscriptionPlan = 'basic' | 'pro' | 'premium'
type SubscriptionPeriod = 'P1M' | 'P3M' | 'P6M' | 'P12M'

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('basic')
  const [selectedPeriod, setSelectedPeriod] = useState<SubscriptionPeriod>('P1M')

  const plans = [
    { id: 'basic' as SubscriptionPlan, name: 'Базовый', price: 500 },
    { id: 'pro' as SubscriptionPlan, name: 'Pro', price: 1000, charity: '5%' },
    { id: 'premium' as SubscriptionPlan, name: 'Premium', price: 2500, charity: '10%' },
  ]

  const periods = [
    { id: 'P1M' as SubscriptionPeriod, label: '1 месяц', bonus: '' },
    { id: 'P3M' as SubscriptionPeriod, label: '3 месяца', bonus: '-10%' },
    { id: 'P6M' as SubscriptionPeriod, label: '6 месяцев', bonus: '+2 мес. в подарок' },
    { id: 'P12M' as SubscriptionPeriod, label: '12 месяцев', bonus: '+4 мес. в подарок' },
  ]

  const handleSubscribe = () => {
    // TODO: Инициализация подписки через API
    console.log('Subscribe:', { selectedPlan, selectedPeriod })
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Садака-подписка</h1>
      <p style={{ marginBottom: '24px', color: 'var(--tg-theme-hint-color)' }}>
        Регулярные пожертвования для постоянной поддержки благотворительности
      </p>

      {/* Выбор тарифа */}
      <h3 style={{ marginBottom: '12px' }}>Выберите тариф</h3>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className="card-title">{plan.name}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
              {plan.price} ₽/мес
            </div>
            {plan.charity && (
              <div style={{ fontSize: '12px', color: 'var(--tg-theme-link-color)' }}>
                {plan.charity} на благотворительность
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Выбор периода */}
      <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Период подписки</h3>
      <div className="periods-list">
        {periods.map((period) => (
          <div
            key={period.id}
            className={`card ${selectedPeriod === period.id ? 'selected' : ''}`}
            onClick={() => setSelectedPeriod(period.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-title">{period.label}</span>
              {period.bonus && (
                <span className="badge" style={{ backgroundColor: 'var(--tg-theme-button-color)' }}>
                  {period.bonus}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handleSubscribe} style={{ marginTop: '24px' }}>
        Оформить подписку
      </button>
    </div>
  )
}

export default SubscriptionPage

