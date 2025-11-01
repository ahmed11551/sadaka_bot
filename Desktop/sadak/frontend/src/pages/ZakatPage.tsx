import { useState } from 'react'
import { zakatService, ZakatCalc } from '../services/zakatService'
import Icon from '../components/Icon'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'
import '../App.css'

const ZakatPage = () => {
  const [cash, setCash] = useState<string>('')
  const [goldWeight, setGoldWeight] = useState<string>('')
  const [goldRate, setGoldRate] = useState<string>('')
  const [goods, setGoods] = useState<string>('')
  const [debts, setDebts] = useState<string>('')
  const [result, setResult] = useState<ZakatCalc | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [paying, setPaying] = useState(false)
  const { success, error, warning } = useToast()

  const handleCalculate = async () => {
    setCalculating(true)
    try {
      const calculation = {
        cash: parseFloat(cash) || 0,
        gold: goldWeight && goldRate ? {
          weight: parseFloat(goldWeight),
          rate: parseFloat(goldRate),
        } : undefined,
        goods: parseFloat(goods) || 0,
        debts: parseFloat(debts) || 0,
      }

      const calcResult = await zakatService.calculate(calculation)
      setResult(calcResult)
      if (parseFloat(calcResult.zakat_due) > 0) {
        success(`Закят рассчитан: ${parseFloat(calcResult.zakat_due).toLocaleString('ru-RU')} ₽`)
      } else {
        warning('Ваше имущество меньше нисаба, закят не требуется')
      }
    } catch (err: any) {
      console.error('Error calculating zakat:', err)
      error(err.response?.data?.detail || 'Ошибка при расчете закята')
    } finally {
      setCalculating(false)
    }
  }

  const handlePay = async () => {
    if (!result || parseFloat(result.zakat_due) <= 0) {
      warning('Сначала рассчитайте закят')
      return
    }

    setPaying(true)
    try {
      const donation = await zakatService.pay(result.id)
      if (donation.payment_url) {
        success('Переход на оплату...')
        window.open(donation.payment_url, '_blank')
      }
    } catch (err: any) {
      console.error('Error paying zakat:', err)
      error(err.response?.data?.detail || 'Ошибка при создании пожертвования')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">
        <Icon name="handHeart" size={28} />
        Калькулятор закята
      </h1>
      <p className="page-subtitle">
        Рассчитайте размер обязательного закята (2.5% от имущества сверх нисаба)
      </p>

      <div 
        className="card"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <Icon name="handHeart" size={48} color="#ffffff" />
        </div>
        <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>Закят</h3>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
          Обязательное пожертвование с имущества мусульманина
        </p>
      </div>

      <div className="zakat-form" style={{ marginTop: '24px' }}>
        <div className="form-group">
          <label className="form-label" style={{ 
            fontSize: '15px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            display: 'block'
          }}>
            💰 Денежные средства (₽)
          </label>
          <input
            type="number"
            className="form-input"
            placeholder="Введите сумму"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ 
            fontSize: '15px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            display: 'block'
          }}>
            🏅 Золото
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Вес (г)"
              value={goldWeight}
              onChange={(e) => setGoldWeight(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Цена за грамм (₽)"
              value={goldRate}
              onChange={(e) => setGoldRate(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ 
            fontSize: '15px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            display: 'block'
          }}>
            📦 Товары для продажи (₽)
          </label>
          <input
            type="number"
            className="form-input"
            placeholder="Введите сумму"
            value={goods}
            onChange={(e) => setGoods(e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ 
            fontSize: '15px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            display: 'block'
          }}>
            💳 Полученные долги (₽)
          </label>
          <input
            type="number"
            className="form-input"
            placeholder="Введите сумму"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            min="0"
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleCalculate}
          disabled={calculating}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)',
            fontSize: '18px',
            fontWeight: '700',
            padding: '18px 32px',
            marginTop: '32px',
            minHeight: '56px',
            letterSpacing: '-0.01em'
          }}
        >
          {calculating ? (
            <>
              <LoadingSpinner size="sm" />
              Рассчитываем...
            </>
          ) : (
            <>
              <Icon name="zap" size={20} />
              Рассчитать закят
            </>
          )}
        </button>

        {result && (
          <div className="card" style={{ 
            marginTop: '32px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
          }}>
            <div className="card-title" style={{ 
              fontSize: '22px', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Icon name="checkCircle" size={24} color="#10b981" />
              Результат расчета
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ 
                marginBottom: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Общее имущество:</span>
                <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  {parseFloat(result.total_wealth).toLocaleString('ru-RU')} ₽
                </strong>
              </div>
              <div style={{ 
                marginBottom: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Нисаб:</span>
                <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  {parseFloat(result.nisab_value).toLocaleString('ru-RU')} ₽
                </strong>
              </div>
              <div style={{ 
                marginBottom: '24px',
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
                  Закят к уплате
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff' }}>
                  {parseFloat(result.zakat_due).toLocaleString('ru-RU')} ₽
                </div>
              </div>
              {parseFloat(result.zakat_due) > 0 && (
                <button 
                  className="btn btn-primary" 
                  onClick={handlePay}
                  disabled={paying}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)',
                    fontSize: '18px',
                    fontWeight: '700',
                    padding: '18px 32px',
                    marginTop: '24px',
                    minHeight: '56px'
                  }}
                >
                  {paying ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Icon name="handHeart" size={20} />
                      Выплатить закят {parseFloat(result.zakat_due).toLocaleString('ru-RU')} ₽
                    </>
                  )}
                </button>
              )}
              {parseFloat(result.zakat_due) === 0 && (
                <div style={{ color: 'var(--tg-theme-hint-color)', fontStyle: 'italic' }}>
                  Ваше имущество меньше порога нисаба. Закят не обязателен.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ZakatPage

