import { useState } from 'react'
import { subscriptionsService } from '../services/subscriptionsService'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'
import Icon from '../components/Icon'
import '../App.css'

type SubscriptionPlan = 'basic' | 'pro' | 'premium'
type SubscriptionPeriod = 'P1M' | 'P3M' | 'P6M' | 'P12M'

const SubscriptionPage = () => {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('basic')
  const [selectedPeriod, setSelectedPeriod] = useState<SubscriptionPeriod>('P1M')
  
  // Простой режим (как в DAYIM)
  const [simpleAmount, setSimpleAmount] = useState<number>(100)
  const [simpleFrequency, setSimpleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()

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

  // Расчет месячной суммы для простого режима
  const calculateMonthlyAmount = () => {
    switch (simpleFrequency) {
      case 'daily':
        return simpleAmount * 30
      case 'weekly':
        return simpleAmount * 4
      case 'monthly':
        return simpleAmount
      default:
        return simpleAmount
    }
  }

  const monthlyAmount = calculateMonthlyAmount()

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      let subscriptionData
      
      if (mode === 'simple') {
        // Простой режим - используем базовый план с рассчитанной суммой
        subscriptionData = await subscriptionsService.initSubscription({
          plan: 'basic',
          period: 'P1M',
          amount: monthlyAmount,
        })
      } else {
        // Расширенный режим - используем выбранный тариф
        const selectedPlanData = plans.find(p => p.id === selectedPlan)
        if (!selectedPlanData) {
          error('Выберите тариф')
          return
        }
        subscriptionData = await subscriptionsService.initSubscription({
          plan: selectedPlan,
          period: selectedPeriod,
          amount: selectedPlanData.price,
        })
      }

      if (subscriptionData.payment_url) {
        success('Подписка создана! Перенаправляем на оплату...')
        setTimeout(() => {
          window.open(subscriptionData.payment_url, '_blank')
        }, 1000)
      } else {
        success('Подписка успешно оформлена!')
      }
    } catch (err: any) {
      console.error('Error subscribing:', err)
      error(err.response?.data?.detail || 'Ошибка при оформлении подписки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Садака-подписка</h1>
      <p style={{ marginBottom: '24px', color: 'var(--tg-theme-hint-color)' }}>
        Регулярные пожертвования для постоянной поддержки благотворительности
      </p>

      {/* Переключатель режима */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        padding: '4px',
        background: 'var(--tg-theme-bg-color)',
        borderRadius: '12px',
        border: '1px solid var(--tg-theme-button-color)'
      }}>
        <button
          onClick={() => setMode('simple')}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: mode === 'simple' ? 'var(--tg-theme-button-color)' : 'transparent',
            color: mode === 'simple' ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-text-color)',
            fontSize: '14px',
            fontWeight: mode === 'simple' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
            <Icon name="zap" size={16} />
          </span>
          Простой режим
        </button>
        <button
          onClick={() => setMode('advanced')}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: mode === 'advanced' ? 'var(--tg-theme-button-color)' : 'transparent',
            color: mode === 'advanced' ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-text-color)',
            fontSize: '14px',
            fontWeight: mode === 'advanced' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
            <Icon name="settings" size={16} />
          </span>
          Тарифы
        </button>
      </div>

      {/* Простой режим (вдохновлено DAYIM) */}
      {mode === 'simple' && (
        <div>
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ 
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
                Небольшая сумма регулярно — большое влияние
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>
                {simpleAmount.toLocaleString('ru-RU')} ₽
              </div>
              <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
                {simpleFrequency === 'daily' && 'в день'}
                {simpleFrequency === 'weekly' && 'в неделю'}
                {simpleFrequency === 'monthly' && 'в месяц'}
              </div>
            </div>

            {/* Пресеты сумм */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '8px',
              marginBottom: '20px'
            }}>
              {[50, 100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSimpleAmount(amount)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: simpleAmount === amount 
                      ? '2px solid var(--tg-theme-button-color)' 
                      : '1px solid var(--tg-theme-hint-color)',
                    background: simpleAmount === amount 
                      ? 'var(--tg-theme-button-color)' + '20' 
                      : 'transparent',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '14px',
                    fontWeight: simpleAmount === amount ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {amount} ₽
                </button>
              ))}
            </div>

            {/* Выбор частоты */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--tg-theme-hint-color)' }}>
                Частота пожертвований
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'daily' as const, label: 'Ежедневно', icon: 'sun' as const },
                  { id: 'weekly' as const, label: 'Еженедельно', icon: 'calendar' as const },
                  { id: 'monthly' as const, label: 'Ежемесячно', icon: 'clock' as const }
                ].map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setSimpleFrequency(freq.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: simpleFrequency === freq.id 
                        ? '2px solid var(--tg-theme-button-color)' 
                        : '1px solid var(--tg-theme-hint-color)',
                      background: simpleFrequency === freq.id 
                        ? 'var(--tg-theme-button-color)' + '20' 
                        : 'transparent',
                      color: 'var(--tg-theme-text-color)',
                      fontSize: '12px',
                      fontWeight: simpleFrequency === freq.id ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icon name={freq.icon} size={20} />
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Информация о месячной сумме */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '4px' }}>
                Примерно в месяц:
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {monthlyAmount.toLocaleString('ru-RU')} ₽
              </div>
              <div style={{ fontSize: '11px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
                {monthlyAmount < 1000 && 'Небольшая сумма, но регулярно!'}
                {monthlyAmount >= 1000 && monthlyAmount < 3000 && 'Отличный вклад в добрые дела!'}
                {monthlyAmount >= 3000 && 'Великолепно! Ваша помощь очень важна!'}
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleSubscribe} 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Обработка...
              </>
            ) : (
              `Оформить подписку ${monthlyAmount.toLocaleString('ru-RU')} ₽/мес`
            )}
          </button>
        </div>
      )}

      {/* Расширенный режим (тарифы) */}
      {mode === 'advanced' && (
        <div>
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

          <button 
            className="btn btn-primary" 
            onClick={handleSubscribe} 
            disabled={loading}
            style={{ marginTop: '24px', width: '100%' }}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Обработка...
              </>
            ) : (
              'Оформить подписку'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default SubscriptionPage

