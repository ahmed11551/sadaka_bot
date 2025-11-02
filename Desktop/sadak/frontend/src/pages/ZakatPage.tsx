import { useState, useEffect } from 'react'
import { zakatService, ZakatCalc } from '../services/zakatService'
import Icon from '../components/Icon'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'
import { haptic } from '../utils/haptic'
import '../App.css'

// Информация о закяте
const ZAKAT_INFO = {
  title: "Что такое закят?",
  description: "Закят — это обязательное ежегодное пожертвование в пользу бедных, один из пяти столпов Ислама.",
  nisab: "Нисаб — минимальный размер облагаемого имущества (примерно 450,000 ₽ или 85 грамм золота).",
  rate: "Ставка закята составляет 2.5% от всего имущества, превышающего нисаб.",
  types: [
    "💰 Деньги, серебро, золото",
    "📦 Товары для продажи",
    "🏭 Бизнес и активы",
    "🐄 Скот",
    "💎 Клады и рудники",
    "💳 Полученные долги"
  ]
}

const ZAKAT_RECIPIENTS = [
  "Бедные и нуждающиеся",
  "Новообращенные мусульмане",
  "Несостоятельные должники",
  "Путники и путешественники",
  "Работники по сбору закята"
]

const ZakatPage = () => {
  // Активы
  const [cash, setCash] = useState<string>('')  // Наличные деньги
  const [bankCash, setBankCash] = useState<string>('')  // Деньги на счету в банке
  const [goldWeight, setGoldWeight] = useState<string>('')
  const [goldRate, setGoldRate] = useState<string>('')
  const [silverWeight, setSilverWeight] = useState<string>('')
  const [silverRate, setSilverRate] = useState<string>('')
  const [goods, setGoods] = useState<string>('')  // Товары и доходы
  const [investments, setInvestments] = useState<string>('')  // Инвестиции в имущество
  const [otherIncome, setOtherIncome] = useState<string>('')  // Другие доходы
  
  // Обязательства (вычитаются)
  const [expenses, setExpenses] = useState<string>('')  // Расходы
  const [debts, setDebts] = useState<string>('')  // Долги
  
  const [result, setResult] = useState<ZakatCalc | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [paying, setPaying] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [goldRateLoading, setGoldRateLoading] = useState(false)
  const [silverRateLoading, setSilverRateLoading] = useState(false)
  const { success, error, warning } = useToast()
  
  // Расчет нисаба на основе курсов
  const calculateNisab = () => {
    let nisabGold = 0
    let nisabSilver = 0
    
    if (goldRate) {
      // 85 грамм золота
      nisabGold = 85 * parseFloat(goldRate || '0')
    }
    
    if (silverRate) {
      // 612.36 грамм серебра
      nisabSilver = 612.36 * parseFloat(silverRate || '0')
    }
    
    // Возвращаем большее значение (золотой нисаб обычно выше)
    if (nisabGold > 0 && nisabSilver > 0) {
      return Math.max(nisabGold, nisabSilver)
    } else if (nisabGold > 0) {
      return nisabGold
    } else if (nisabSilver > 0) {
      return nisabSilver
    }
    
    // Fallback если курсы не указаны
    return 450000
  }
  
  const calculatedNisab = calculateNisab()
  
  // Расчет общей облагаемой суммы (в реальном времени)
  const calculateTotalWealth = () => {
    let total = 0
    
    // Активы (только положительные значения)
    const cashValue = Math.max(0, parseFloat(cash || '0') || 0)
    const bankCashValue = Math.max(0, parseFloat(bankCash || '0') || 0)
    
    total += cashValue
    total += bankCashValue
    
    if (goldWeight && goldRate) {
      const goldW = Math.max(0, parseFloat(goldWeight || '0') || 0)
      const goldR = Math.max(0, parseFloat(goldRate || '0') || 0)
      total += goldW * goldR
    }
    
    if (silverWeight && silverRate) {
      const silverW = Math.max(0, parseFloat(silverWeight || '0') || 0)
      const silverR = Math.max(0, parseFloat(silverRate || '0') || 0)
      total += silverW * silverR
    }
    
    total += Math.max(0, parseFloat(goods || '0') || 0)
    total += Math.max(0, parseFloat(investments || '0') || 0)
    total += Math.max(0, parseFloat(otherIncome || '0') || 0)
    
    // Вычитаем обязательства (только положительные значения)
    total -= Math.max(0, parseFloat(expenses || '0') || 0)
    total -= Math.max(0, parseFloat(debts || '0') || 0)
    
    // Защита от отрицательных и слишком больших значений
    return Math.max(0, Math.min(total, Number.MAX_SAFE_INTEGER))
  }
  
  const totalWealth = calculateTotalWealth()

  // Автозаполнение курса золота
  const fetchGoldRate = async () => {
    haptic.impactOccurred('light')
    setGoldRateLoading(true)
    try {
      // В реальном проекте можно использовать API курса золота
      const estimatedRate = 6500 // Примерная стоимость за грамм в рублях
      setGoldRate(estimatedRate.toString())
      success('Курс золота обновлен')
    } catch (err) {
      console.error('Error fetching gold rate:', err)
      warning('Не удалось получить курс золота')
    } finally {
      setGoldRateLoading(false)
    }
  }
  
  // Автозаполнение курса серебра
  const fetchSilverRate = async () => {
    haptic.impactOccurred('light')
    setSilverRateLoading(true)
    try {
      // Примерная стоимость серебра за грамм (обычно ~80-100₽)
      const estimatedRate = 85
      setSilverRate(estimatedRate.toString())
      success('Курс серебра обновлен')
    } catch (err) {
      console.error('Error fetching silver rate:', err)
      warning('Не удалось получить курс серебра')
    } finally {
      setSilverRateLoading(false)
    }
  }

  useEffect(() => {
    // Автоматически заполнить курсы при загрузке
    fetchGoldRate()
    fetchSilverRate()
  }, [])

  const handleCalculate = async () => {
    if (!cash && !bankCash && !goldWeight && !silverWeight && !goods && !investments && !otherIncome) {
      warning('Заполните хотя бы одно поле с активами')
      return
    }

    setCalculating(true)
    try {
      // Формируем данные для API согласно новой структуре
      const calculation = {
        cash: parseFloat(cash) || 0,
        bank_cash: parseFloat(bankCash) || 0,
        gold: goldWeight && goldRate ? {
          weight: parseFloat(goldWeight),
          rate: parseFloat(goldRate),
        } : undefined,
        silver: silverWeight && silverRate ? {
          weight: parseFloat(silverWeight),
          rate: parseFloat(silverRate),
        } : undefined,
        goods: parseFloat(goods) || 0,
        investments: parseFloat(investments) || 0,
        other_income: parseFloat(otherIncome) || 0,
        expenses: parseFloat(expenses) || 0,
        debts: parseFloat(debts) || 0,
      }

      console.log('Sending calculation:', calculation)

      const calcResult = await zakatService.calculate(calculation)
      console.log('Calculation result:', calcResult)
      
      setResult(calcResult)
      if (parseFloat(calcResult.zakat_due) > 0) {
        haptic.notificationOccurred('success')
        success(`Закят рассчитан: ${parseFloat(calcResult.zakat_due).toLocaleString('ru-RU')} ₽`)
      } else {
        haptic.notificationOccurred('warning')
        warning('Ваше имущество меньше нисаба, закят не требуется')
      }
    } catch (err: any) {
      console.error('Error calculating zakat:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Ошибка при расчете закята'
      error(errorMessage)
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
        haptic.notificationOccurred('success')
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
        Рассчитайте обязательную выплату закята на основе ваших материальных активов и финансовых средств (2.5% от имущества сверх нисаба)
      </p>

      {/* Информационная карточка о закяте */}
      <div 
        className="card"
        style={{ 
          marginBottom: '24px',
          background: 'var(--tg-theme-button-color, var(--primary))',
          color: '#ffffff',
          border: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ color: '#ffffff', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              {ZAKAT_INFO.title}
            </h3>
            <button
              onClick={() => {
                haptic.impactOccurred('light')
                setShowInfo(!showInfo)
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
            >
              {showInfo ? 'Скрыть' : 'Подробнее'}
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
            {ZAKAT_INFO.description}
          </p>
          {showInfo && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '12px' }}>
                {ZAKAT_INFO.nisab}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '12px' }}>
                {ZAKAT_INFO.rate}
              </p>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontWeight: '600' }}>
                  Кому выплачивается закят:
                </div>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                  {ZAKAT_RECIPIENTS.map((recipient, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{recipient}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div 
          style={{ 
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'transparent',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Блок с расчетом нисаба и общей суммой */}
      <div className="card" style={{ 
        marginBottom: '24px',
        background: 'var(--tg-theme-secondary-bg-color, var(--bg-primary))',
        backdropFilter: 'none',
        border: '2px solid var(--border-color)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div style={{ 
            padding: '16px',
            background: 'var(--bg-glass)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Общая сумма облагаемых закятом
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {totalWealth.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div style={{ 
            padding: '16px',
            background: 'var(--tg-theme-button-color, var(--primary))',
            borderRadius: '12px',
            color: '#ffffff'
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '6px' }}>
              Итоговый размер вашего нисаба
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {calculatedNisab.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>
        
        {totalWealth > 0 && (
          <div style={{ 
            padding: '12px',
            background: totalWealth >= calculatedNisab 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            border: `2px solid ${totalWealth >= calculatedNisab ? '#10b981' : '#f59e0b'}`,
            textAlign: 'center'
          }}>
            {totalWealth >= calculatedNisab ? (
              <div style={{ color: '#10b981', fontWeight: '600' }}>
                ✅ Ваше имущество превышает нисаб. Закят обязателен.
              </div>
            ) : (
              <div style={{ color: '#f59e0b', fontWeight: '600' }}>
                ⚠️ Ваше имущество меньше нисаба на {Math.abs(totalWealth - calculatedNisab).toLocaleString('ru-RU')} ₽
              </div>
            )}
          </div>
        )}
        
        {totalWealth >= calculatedNisab && totalWealth > 0 && (
          <div style={{ 
            marginTop: '12px',
            padding: '16px',
            background: 'var(--bg-glass)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Размер закята для выплаты
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>
              {(totalWealth * 0.025).toLocaleString('ru-RU')} ₽
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Формула: 0.025 × {totalWealth.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        )}
      </div>

      <div className="zakat-form" style={{ marginTop: '24px' }}>
        {/* Наличные деньги */}
        <div className="form-group">
          <label className="form-label">
            💰 Наличные деньги (₽)
          </label>
            <input
              type="number"
              className="form-input"
              placeholder="Введите сумму наличных"
              value={cash}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setCash(value)
                }
              }}
              min="0"
              step="0.01"
            />
        </div>

        {/* Деньги на счету в банке */}
        <div className="form-group">
          <label className="form-label">
            🏦 Деньги на счету в банке (₽)
          </label>
            <input
              type="number"
              className="form-input"
              placeholder="Остаток на банковских счетах"
              value={bankCash}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setBankCash(value)
                }
              }}
              min="0"
              step="0.01"
            />
        </div>

        {/* Золото */}
        <div className="form-group">
          <label className="form-label">
            🏅 Золото
            <button
              onClick={fetchGoldRate}
              disabled={goldRateLoading}
              style={{
                marginLeft: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                background: 'var(--warning)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: goldRateLoading ? 0.7 : 1
              }}
            >
              {goldRateLoading ? '...' : 'Обновить курс'}
            </button>
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Вес (г)"
              value={goldWeight}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setGoldWeight(value)
                }
              }}
              style={{ flex: 1 }}
              min="0"
              step="0.01"
            />
            <input
              type="number"
              className="form-input"
              placeholder="Цена за грамм (₽)"
              value={goldRate}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setGoldRate(value)
                }
              }}
              style={{ flex: 1 }}
              min="0"
              step="0.01"
            />
          </div>
          {goldRate && (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Стоимость: {goldWeight ? (parseFloat(goldWeight || '0') * parseFloat(goldRate || '0')).toLocaleString('ru-RU') : '0'} ₽
            </div>
          )}
        </div>

        {/* Серебро */}
        <div className="form-group">
          <label className="form-label">
            💍 Серебро
            <button
              onClick={fetchSilverRate}
              disabled={silverRateLoading}
              style={{
                marginLeft: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                background: 'var(--warning)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: silverRateLoading ? 0.7 : 1
              }}
            >
              {silverRateLoading ? '...' : 'Обновить курс'}
            </button>
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Вес (г)"
              value={silverWeight}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setSilverWeight(value)
                }
              }}
              style={{ flex: 1 }}
              min="0"
              step="0.01"
            />
            <input
              type="number"
              className="form-input"
              placeholder="Цена за грамм (₽)"
              value={silverRate}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setSilverRate(value)
                }
              }}
              style={{ flex: 1 }}
              min="0"
              step="0.01"
            />
          </div>
          {silverRate && (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Стоимость: {silverWeight ? (parseFloat(silverWeight || '0') * parseFloat(silverRate || '0')).toLocaleString('ru-RU') : '0'} ₽
            </div>
          )}
        </div>

        {/* Товары и доходы */}
        <div className="form-group">
          <label className="form-label">
            🛒 Товары и доходы (₽)
          </label>
            <input
              type="number"
              className="form-input"
              placeholder="Стоимость акций при перепродаже, товары и прибыль"
              value={goods}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setGoods(value)
                }
              }}
              min="0"
              step="0.01"
            />
        </div>

        {/* Инвестиции в имущество */}
        <div className="form-group">
          <label className="form-label">
            🏢 Инвестиции в имущество (₽)
          </label>
            <input
              type="number"
              className="form-input"
              placeholder="Имущество, удерживаемое в качестве инвестиций"
              value={investments}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setInvestments(value)
                }
              }}
              min="0"
              step="0.01"
            />
        </div>

        {/* Другие доходы */}
        <div className="form-group">
          <label className="form-label">
            ➕ Другие доходы (₽)
          </label>
            <input
              type="number"
              className="form-input"
              placeholder="Прочие доходы и активы"
              value={otherIncome}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setOtherIncome(value)
                }
              }}
              min="0"
              step="0.01"
            />
        </div>

        {/* Вычесть расходы */}
        <div className="form-group">
          <label className="form-label" style={{ color: '#ef4444' }}>
            ➖ Вычесть расходы (₽)
          </label>
            <input
              type="number"
              className="form-input"
              placeholder="Расходы, которые вычитаются из активов"
              value={expenses}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setExpenses(value)
                }
              }}
              min="0"
              step="0.01"
            />
        </div>

        {/* Вычесть долги */}
        <div className="form-group">
          <label className="form-label" style={{ color: '#ef4444' }}>
            ➖ Вычесть долги (₽)
          </label>
            <input
              type="number"
              className="form-input"
              placeholder="Долги, которые вычитаются из активов"
              value={debts}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setDebts(value)
                }
              }}
              min="0"
              step="0.01"
            />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => {
            haptic.impactOccurred('medium')
            handleCalculate()
          }}
          disabled={calculating}
        >
          {calculating ? (
            <>
              <LoadingSpinner size="sm" />
              Рассчитываем...
            </>
          ) : (
            <>
              <Icon name="zap" size={20} color="#ffffff" />
              Рассчитать закят
            </>
          )}
        </button>

        {result && (
          <div className="card" style={{ 
            marginTop: '32px',
            animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '2px solid var(--primary)'
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
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Общее имущество:</span>
                <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  {parseFloat(result.total_wealth).toLocaleString('ru-RU')} ₽
                </strong>
              </div>
              <div style={{ 
                marginBottom: '16px',
                padding: '16px',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Нисаб:</span>
                <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  {parseFloat(result.nisab_value).toLocaleString('ru-RU')} ₽
                </strong>
              </div>
              <div style={{ 
                marginBottom: '24px',
                padding: '24px',
                background: 'var(--tg-theme-button-color, var(--primary))',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: 'none',
                border: 'none'
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                  Закят к уплате
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {parseFloat(result.zakat_due).toLocaleString('ru-RU')} ₽
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '8px' }}>
                  2.5% от имущества
                </div>
              </div>
              {parseFloat(result.zakat_due) > 0 && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    haptic.impactOccurred('heavy')
                    handlePay()
                  }}
                  disabled={paying}
                >
                  {paying ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Icon name="handHeart" size={22} color="#ffffff" />
                      <span style={{ marginLeft: '8px' }}>
                        Выплатить закят {parseFloat(result.zakat_due).toLocaleString('ru-RU')} ₽
                      </span>
                    </>
                  )}
                </button>
              )}
              {parseFloat(result.zakat_due) === 0 && (
                <div style={{ 
                  padding: '16px',
                  background: 'var(--bg-glass)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  ✨ Ваше имущество меньше порога нисаба. Закят не обязателен.
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
