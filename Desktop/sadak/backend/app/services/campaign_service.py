"""
Сервис для работы с кампаниями
"""
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from app.models import Campaign
from app.schemas.campaign import CampaignCreate
from app.models.campaign import CampaignStatus


def get_campaigns(
    db: Session,
    country_code: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Campaign]:
    """Получить список кампаний с фильтрацией"""
    query = db.query(Campaign)
    
    # Фильтрация по статусу (по умолчанию только активные)
    if status:
        query = query.filter(Campaign.status == CampaignStatus(status))
    else:
        query = query.filter(Campaign.status == CampaignStatus.ACTIVE)
    
    # TODO: Добавить фильтрацию по стране через fund
    
    if category:
        query = query.filter(Campaign.category == category)
    
    return query.order_by(Campaign.created_at.desc()).offset(skip).limit(limit).all()


def get_campaign(db: Session, campaign_id: int) -> Optional[Campaign]:
    """Получить кампанию по ID"""
    return db.query(Campaign).filter(Campaign.id == campaign_id).first()


def create_campaign(
    db: Session,
    user_id: int,
    campaign_data: CampaignCreate
) -> Campaign:
    """
    Создать новую кампанию
    Статус автоматически устанавливается в PENDING (на модерации)
    """
    campaign = Campaign(
        owner_id=user_id,
        fund_id=campaign_data.fund_id,
        title=campaign_data.title,
        description=campaign_data.description,
        category=campaign_data.category,
        goal_amount=campaign_data.goal_amount,
        currency=campaign_data.currency,
        banner_url=campaign_data.banner_url,
        end_date=campaign_data.end_date,
        status=CampaignStatus.PENDING  # Требуется модерация
    )
    
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    
    return campaign


def update_campaign_progress(
    db: Session,
    campaign_id: int,
    amount: float
) -> Campaign:
    """Обновить прогресс кампании (вызывается при успешном донате)"""
    from datetime import datetime
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if campaign:
        campaign.collected_amount += amount
        campaign.participants_count += 1
        
        # Проверка достижения цели
        if campaign.collected_amount >= campaign.goal_amount:
            campaign.status = CampaignStatus.COMPLETED
        
        db.commit()
        db.refresh(campaign)
    return campaign


def moderate_campaign(
    db: Session,
    campaign_id: int,
    moderator_id: int,
    action: str,
    rejection_reason: Optional[str] = None
) -> Campaign:
    """
    Модерировать кампанию
    
    Args:
        action: 'approve' или 'reject'
    """
    from datetime import datetime
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise ValueError("Campaign not found")
    
    if campaign.status != CampaignStatus.PENDING:
        raise ValueError("Campaign is not pending moderation")
    
    if action == "approve":
        campaign.status = CampaignStatus.ACTIVE
        campaign.moderated_by = moderator_id
        campaign.moderated_at = datetime.utcnow()
    elif action == "reject":
        campaign.status = CampaignStatus.REJECTED
        campaign.moderated_by = moderator_id
        campaign.moderated_at = datetime.utcnow()
        if rejection_reason:
            campaign.rejection_reason = rejection_reason
    else:
        raise ValueError("Invalid action")
    
    db.commit()
    db.refresh(campaign)
    
    return campaign


def check_and_expire_campaigns(db: Session) -> List[Campaign]:
    """
    Проверить и завершить истекшие кампании
    Вызывается периодически (через cron или задачу)
    """
    from datetime import datetime
    
    expired_campaigns = db.query(Campaign).filter(
        Campaign.status == CampaignStatus.ACTIVE,
        Campaign.end_date < datetime.utcnow()
    ).all()
    
    for campaign in expired_campaigns:
        campaign.status = CampaignStatus.EXPIRED
    
    db.commit()
    
    return expired_campaigns

