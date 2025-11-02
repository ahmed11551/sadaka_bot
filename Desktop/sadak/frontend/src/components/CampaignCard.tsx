import { useNavigate } from 'react-router-dom'
import { Campaign } from '../services/campaignsService'
import ShareButton from './ShareButton'
import Icon from './Icon'
import { haptic } from '../utils/haptic'
import './CampaignCard.css'

interface CampaignCardProps {
  campaign: Campaign
  onDonate: (campaignId: number) => void
}

const CampaignCard = ({ campaign, onDonate }: CampaignCardProps) => {
  const navigate = useNavigate()
  
  const progress = Math.min(
    (parseFloat(campaign.collected_amount) / parseFloat(campaign.goal_amount)) * 100,
    100
  )

  const daysLeft = campaign.end_date 
    ? Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  const handleCardClick = () => {
    haptic.impactOccurred('light')
    navigate(`/campaigns/${campaign.id}`)
  }

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptic.impactOccurred('medium')
    onDonate(campaign.id)
  }

  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'active':
        return <span className="status-badge status-active">Активная кампания</span>
      case 'completed':
        return <span className="status-badge status-completed">Завершённая кампания</span>
      case 'pending':
        return <span className="status-badge status-pending">Ожидает модерации</span>
      default:
        return null
    }
  }

  return (
    <div className="campaign-card interactive-card" onClick={handleCardClick}>
      {campaign.banner_url && (
        <div className="campaign-image">
          <img 
            src={campaign.banner_url} 
            alt={campaign.title}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="campaign-overlay">
            {getStatusBadge()}
            {daysLeft > 0 && campaign.status === 'active' && (
              <span className="days-badge">
                {daysLeft} {daysLeft === 1 ? 'день осталось' : daysLeft < 5 ? 'дня осталось' : 'дней осталось'}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="campaign-content">
        <div className="campaign-header">
          <h3 className="campaign-title">{campaign.title}</h3>
          {campaign.category && (
            <span className="category-badge">{campaign.category}</span>
          )}
        </div>

        <p className="campaign-description">
          {campaign.description.length > 150 
            ? `${campaign.description.substring(0, 150)}...`
            : campaign.description
          }
        </p>

        <div className="campaign-stats">
          <div className="stat-item">
            <div className="stat-value" style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '19px' }}>
              {parseFloat(campaign.collected_amount).toLocaleString('ru-RU')} ₽
            </div>
            <div className="stat-label" style={{ fontWeight: '500', fontSize: '13px' }}>Собранная сумма</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ fontWeight: '700', fontSize: '19px' }}>
              {parseFloat(campaign.goal_amount).toLocaleString('ru-RU')} ₽
            </div>
            <div className="stat-label" style={{ fontWeight: '500', fontSize: '13px' }}>Целевая сумма</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '19px' }}>
              <Icon name="users" size={16} />
              {campaign.participants_count}
            </div>
            <div className="stat-label" style={{ fontWeight: '500', fontSize: '13px' }}>Участников кампании</div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text" style={{ fontWeight: '600', fontSize: '13px' }}>
            {progress.toFixed(1)}% от целевой суммы
          </div>
        </div>

        <div className="campaign-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn-primary campaign-donate-btn"
            onClick={handleDonateClick}
            disabled={campaign.status !== 'active'}
          >
            <Icon name="heart" size={18} />
            Поддержать кампанию
          </button>
          <ShareButton
            url={`${window.location.origin}/campaigns/${campaign.id}`}
            title={campaign.title}
            text={`Поддержите кампанию: ${campaign.title}. Прогресс: ${progress.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  )
}

export default CampaignCard

