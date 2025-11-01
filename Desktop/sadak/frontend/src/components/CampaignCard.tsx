import { Campaign } from '../services/campaignsService'
import ShareButton from './ShareButton'
import './CampaignCard.css'

interface CampaignCardProps {
  campaign: Campaign
  onDonate: (campaignId: number) => void
}

const CampaignCard = ({ campaign, onDonate }: CampaignCardProps) => {
  const progress = Math.min(
    (parseFloat(campaign.collected_amount) / parseFloat(campaign.goal_amount)) * 100,
    100
  )

  const daysLeft = campaign.end_date 
    ? Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'active':
        return <span className="status-badge status-active">Активна</span>
      case 'completed':
        return <span className="status-badge status-completed">Завершена</span>
      case 'pending':
        return <span className="status-badge status-pending">На модерации</span>
      default:
        return null
    }
  }

  return (
    <div className="campaign-card">
      {campaign.banner_url && (
        <div className="campaign-image">
          <img 
            src={campaign.banner_url} 
            alt={campaign.title}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="campaign-overlay">
            {getStatusBadge()}
            {daysLeft > 0 && campaign.status === 'active' && (
              <span className="days-badge">
                {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}
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
            <div className="stat-value" style={{ color: 'var(--accent)' }}>
              {parseFloat(campaign.collected_amount).toLocaleString('ru-RU')} ₽
            </div>
            <div className="stat-label">Собрано</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {parseFloat(campaign.goal_amount).toLocaleString('ru-RU')} ₽
            </div>
            <div className="stat-label">Цель</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">👥 {campaign.participants_count}</div>
            <div className="stat-label">Участников</div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            {progress.toFixed(1)}% от цели
          </div>
        </div>

        <div className="campaign-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn-primary campaign-donate-btn"
            onClick={() => onDonate(campaign.id)}
            disabled={campaign.status !== 'active'}
          >
            <span>💝</span>
            Поддержать
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

