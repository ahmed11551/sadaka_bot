import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { campaignsService, Campaign, CampaignDonation, CampaignReport } from '../services/campaignsService'
import LoadingSpinner from '../components/LoadingSpinner'
import Skeleton from '../components/Skeleton'
import ShareButton from '../components/ShareButton'
import Icon from '../components/Icon'
import { useToast } from '../hooks/useToast'
import '../App.css'

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [donationAmount, setDonationAmount] = useState<string>('')
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [campaignDonations, setCampaignDonations] = useState<CampaignDonation[]>([])
  const [loadingDonations, setLoadingDonations] = useState(false)
  const [campaignReport, setCampaignReport] = useState<CampaignReport | null>(null)
  const [loadingReport, setLoadingReport] = useState(false)
  const { success, error, warning } = useToast()

  useEffect(() => {
    if (id) {
      loadCampaign()
    }
  }, [id])

  useEffect(() => {
    if (campaign && campaign.status === 'active') {
      loadDonations()
    }
  }, [campaign])

  useEffect(() => {
    if (campaign && (campaign.status === 'completed' || campaign.status === 'expired')) {
      loadReport()
    }
  }, [campaign])

  const loadCampaign = async () => {
    try {
      const data = await campaignsService.getCampaign(parseInt(id!))
      setCampaign(data)
    } catch (err: any) {
      console.error('Error loading campaign:', err)
      error(err.message || 'Ошибка при загрузке кампании')
      // Перенаправление на страницу кампаний через 2 секунды
      setTimeout(() => {
        navigate('/campaigns')
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const loadDonations = async () => {
    if (!id) return
    setLoadingDonations(true)
    try {
      const donations = await campaignsService.getCampaignDonations(parseInt(id), 10)
      setCampaignDonations(donations)
    } catch (err: any) {
      console.error('Error loading donations:', err)
      // Не показываем ошибку, просто не загружаем историю
    } finally {
      setLoadingDonations(false)
    }
  }

  const loadReport = async () => {
    if (!id) return
    setLoadingReport(true)
    try {
      const report = await campaignsService.getCampaignReport(parseInt(id))
      setCampaignReport(report)
    } catch (err: any) {
      console.error('Error loading report:', err)
      // Не показываем ошибку, если отчёт недоступен
    } finally {
      setLoadingReport(false)
    }
  }

  const handleDonate = async () => {
    if (!campaign || !donationAmount || parseFloat(donationAmount) <= 0) {
      warning('Укажите сумму пожертвования')
      return
    }

    setDonating(true)
    try {
      const donation = await campaignsService.donateToCampaign(
        campaign.id,
        parseFloat(donationAmount)
      )
      if (donation.payment_url) {
        success('Переход на оплату...')
        window.open(donation.payment_url, '_blank')
      }
      setShowDonationForm(false)
      setDonationAmount('')
    } catch (err: any) {
      console.error('Error donating:', err)
      error(err.response?.data?.detail || 'Ошибка при создании пожертвования')
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
          <h1 className="page-title" style={{ margin: 0, fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em' }}>
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
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Icon name="users" size={20} />
                {campaign.participants_count}
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
              <Icon name="heart" size={18} />
              <span className="btn-text-responsive">Поддержать кампанию</span>
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
                    <Icon name="heart" size={18} />
                    Поддержать кампанию
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* История пожертвований (для активных кампаний) */}
      {campaign.status === 'active' && campaignDonations.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="history" size={20} />
            История пожертвований
          </h3>
          {loadingDonations ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaignDonations.slice(0, 10).map((donation) => (
                <div
                  key={donation.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {parseFloat(donation.amount_value).toLocaleString('ru-RU')} {donation.currency}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {donation.completed_at
                        ? new Date(donation.completed_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'В обработке'}
                    </div>
                  </div>
                  <div>
                    <span className="badge badge-success">Завершено</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Отчеты (если кампания завершена) */}
      {(campaign.status === 'completed' || campaign.status === 'expired') && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="file-text" size={20} />
            Отчет о завершении кампании
          </h3>
          {loadingReport ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <LoadingSpinner size="sm" />
            </div>
          ) : campaignReport ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Собрано средств
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                      {parseFloat(campaignReport.total_collected).toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Участников
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {campaignReport.total_participants}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Фонд-получатель
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  {campaignReport.fund_name}
                </div>
                {campaignReport.transferred_at && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Средства перечислены:{' '}
                    {new Date(campaignReport.transferred_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                )}
              </div>

              {campaignReport.fund_report_url && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Отчёт фонда
                  </div>
                  <a
                    href={campaignReport.fund_report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                  >
                    <Icon name="external-link" size={16} />
                    Открыть отчёт
                  </a>
                </div>
              )}

              {campaignReport.report_documents && campaignReport.report_documents.length > 0 && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Документы
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {campaignReport.report_documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'var(--primary)',
                          textDecoration: 'none',
                        }}
                      >
                        <Icon name="file" size={16} />
                        Документ {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              Отчёт пока не доступен. Фонд-получатель опубликует его в ближайшее время.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default CampaignDetailPage

