import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { campaignsService, Campaign } from '../services/campaignsService'
import LoadingSpinner from '../components/LoadingSpinner'
import Skeleton from '../components/Skeleton'
import ShareButton from '../components/ShareButton'
import '../App.css'

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [donationAmount, setDonationAmount] = useState<string>('')
  const [showDonationForm, setShowDonationForm] = useState(false)

  useEffect(() => {
    if (id) {
      loadCampaign()
    }
  }, [id])

  const loadCampaign = async () => {
    try {
      const data = await campaignsService.getCampaign(parseInt(id!))
      setCampaign(data)
    } catch (error) {
      console.error('Error loading campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async () => {
    if (!campaign || !donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Укажите сумму пожертвования')
      return
    }

    setDonating(true)
    try {
      const donation = await campaignsService.donateToCampaign(
        campaign.id,
        parseFloat(donationAmount)
      )
      if (donation.payment_url) {
        window.open(donation.payment_url, '_blank')
      }
      setShowDonationForm(false)
      setDonationAmount('')
    } catch (error) {
      console.error('Error donating:', error)
      alert('Ошибка при создании пожертвования')
    } finally {
      setDonating(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <Skeleton height="32px" width="200px" className="page-title" />
        <div style={{ marginBottom: '24px' }}>
          <Skeleton height="300px" width="100%" />
        </div>
        <Skeleton height="24px" width="80%" className="skeleton-title" />
        <Skeleton height="16px" className="skeleton-text" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <h2>Кампания не найдена</h2>
          <button className="btn btn-primary" onClick={() => navigate('/campaigns')}>
            Вернуться к кампаниям
          </button>
        </div>
      </div>
    )
  }

  const progress = Math.min(
    (parseFloat(campaign.collected_amount) / parseFloat(campaign.goal_amount)) * 100,
    100
  )

  const daysLeft = campaign.end_date
    ? Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="page-container fade-in">
      <button
        className="btn btn-secondary"
        onClick={() => navigate('/campaigns')}
        style={{ marginBottom: '20px', width: 'auto', padding: '10px 16px' }}
      >
        ← Назад
      </button>

      {campaign.banner_url && (
        <div style={{ marginBottom: '24px', borderRadius: '16px', overflow: 'hidden' }}>
          <img
            src={campaign.banner_url}
            alt={campaign.title}
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h1 className="page-title" style={{ margin: 0, fontSize: '28px' }}>
            {campaign.title}
          </h1>
          {campaign.category && (
            <span className="badge badge-secondary">{campaign.category}</span>
          )}
        </div>

        <p className="card-description" style={{ fontSize: '16px', marginBottom: '24px' }}>
          {campaign.description}
        </p>

        <div style={{ 
          padding: '20px', 
          background: 'var(--gradient-primary)', 
          borderRadius: '16px',
          color: '#ffffff',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                {parseFloat(campaign.collected_amount).toLocaleString('ru-RU')} ₽
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Собрано</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '600', marginBottom: '4px' }}>
                {parseFloat(campaign.goal_amount).toLocaleString('ru-RU')} ₽
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Цель</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
                👥 {campaign.participants_count}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Участников</div>
            </div>
          </div>

          <div className="progress-bar" style={{ marginBottom: '12px', background: 'rgba(255,255,255,0.3)' }}>
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: '#ffffff',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', fontSize: '14px', opacity: 0.95 }}>
            {progress.toFixed(1)}% от цели • {daysLeft > 0 ? `Осталось ${daysLeft} дней` : 'Сбор завершен'}
          </div>
        </div>

        {!showDonationForm ? (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowDonationForm(true)}
              disabled={campaign.status !== 'active'}
              style={{ flex: 1 }}
            >
              <span>💝</span>
              Поддержать кампанию
            </button>
            <ShareButton
              url={window.location.href}
              title={campaign.title}
              text={`Поддержите кампанию: ${campaign.title}. Прогресс: ${progress.toFixed(1)}%`}
            />
          </div>
        ) : (
          <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>Выберите сумму</h3>
            <div className="preset-amounts" style={{ marginBottom: '16px' }}>
              {[500, 1000, 2500, 5000].map((preset) => (
                <button
                  key={preset}
                  className={`btn-preset ${donationAmount === preset.toString() ? 'active' : ''}`}
                  onClick={() => setDonationAmount(preset.toString())}
                >
                  <span>{preset.toLocaleString('ru-RU')} ₽</span>
                </button>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Или укажите свою сумму</label>
              <input
                type="number"
                className="form-input"
                placeholder="Введите сумму"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                min="100"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowDonationForm(false)
                  setDonationAmount('')
                }}
                disabled={donating}
              >
                Отмена
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDonate}
                disabled={donating || !donationAmount || parseFloat(donationAmount) <= 0}
                style={{ flex: 1 }}
              >
                {donating ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <span>💝</span>
                    Пожертвовать
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Отчеты (если кампания завершена) */}
      {campaign.status === 'completed' && (
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>📊 Отчет о сборе</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Кампания успешно завершена. Отчет о расходовании средств будет опубликован фондом-получателем.
          </p>
        </div>
      )}
    </div>
  )
}

export default CampaignDetailPage

