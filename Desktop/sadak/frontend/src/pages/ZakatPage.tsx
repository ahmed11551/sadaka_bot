import { useState } from 'react'
import { zakatService, ZakatCalc } from '../services/zakatService'
import Icon from '../components/Icon'
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
    } catch (error) {
      console.error('Error calculating zakat:', error)
      alert('Ошибка при расчете закята')
    } finally {
      setCalculating(false)
    }
  }

  const handlePay = async () => {
    if (!result || parseFloat(result.zakat_due) <= 0) {
      alert('Сначала рассчитайте закят')
      return
    }

    setPaying(true)
    try {
      const donation = await zakatService.pay(result.id)
      if (donation.payment_url) {
        window.open(donation.payment_url, '_blank')
      }
    } catch (error) {
      console.error('Error paying zakat:', error)
      alert('Ошибка при создании пожертвования')
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

      <div className="zakat-form">
        <div className="form-group">
          <label className="form-label">Денежные средства (₽)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Золото</label>
          <div style={{ display: 'flex', gap: '8px' }}>
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
          <label className="form-label">Товары для продажи (₽)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={goods}
            onChange={(e) => setGoods(e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Полученные долги (₽)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            min="0"
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleCalculate}
          disabled={calculating}
        >
          {calculating ? 'Рассчитываем...' : 'Рассчитать'}
        </button>

        {result && (
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-title">Результат расчета</div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ marginBottom: '8px' }}>
                Общее имущество: <strong>{parseFloat(result.total_wealth).toLocaleString('ru-RU')} ₽</strong>
              </div>
              <div style={{ marginBottom: '8px' }}>
                Нисаб: <strong>{parseFloat(result.nisab_value).toLocaleString('ru-RU')} ₽</strong>
              </div>
              <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                Закят к уплате: <strong>{parseFloat(result.zakat_due).toLocaleString('ru-RU')} ₽</strong>
              </div>
              {parseFloat(result.zakat_due) > 0 && (
                <button 
                  className="btn btn-primary" 
                  onClick={handlePay}
                  disabled={paying}
                >
                  {paying ? 'Обработка...' : 'Выплатить закят'}
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

