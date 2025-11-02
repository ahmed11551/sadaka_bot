"""
Сервис для работы с кампаниями
"""
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from app.models import Campaign
from app.models.fund import Fund
from app.schemas.campaign import CampaignCreate
from app.models.campaign import CampaignStatus
import logging

logger = logging.getLogger(__name__)


def get_campaigns(
    db: Session,
    country_code: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    sort: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Campaign]:
    """Получить список кампаний с фильтрацией и сортировкой"""
    query = db.query(Campaign)
    
    # Фильтрация по статусу (по умолчанию только активные)
    if status:
        query = query.filter(Campaign.status == CampaignStatus(status))
    else:
        query = query.filter(Campaign.status == CampaignStatus.ACTIVE)
    
    # Фильтрация по стране (используем прямое поле country_code или через fund)
    if country_code:
        from sqlalchemy import or_, and_
        # Фильтруем по country_code в Campaign или через fund.country_code
        query = query.outerjoin(Fund).filter(
            or_(
                Campaign.country_code == country_code,
                and_(
                    (Campaign.country_code.is_(None)),
                    (Fund.country_code == country_code)
                )
            )
        )
    
    if category:
        query = query.filter(Campaign.category == category)
    
    # Сортировка
    if sort == "popularity":
        # По популярности (количество участников)
        query = query.order_by(Campaign.participants_count.desc(), Campaign.created_at.desc())
    elif sort == "progress":
        # По прогрессу (% сбора) - вычисляем через (collected_amount / goal_amount)
        # Для этого используем CASE WHEN или вычисляем процент
        from sqlalchemy import case, cast, Float
        progress = case(
            (Campaign.goal_amount > 0, cast(Campaign.collected_amount, Float) / cast(Campaign.goal_amount, Float)),
            else_=0
        )
        query = query.order_by(progress.desc(), Campaign.created_at.desc())
    elif sort == "newest":
        # По дате создания (новые сначала)
        query = query.order_by(Campaign.created_at.desc())
    elif sort == "oldest":
        # По дате создания (старые сначала)
        query = query.order_by(Campaign.created_at.asc())
    else:
        # По умолчанию - по дате создания (новые сначала)
        query = query.order_by(Campaign.created_at.desc())
    
    return query.offset(skip).limit(limit).all()


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
    # Получаем country_code из fund, если не указан напрямую
    fund = db.query(Fund).filter(Fund.id == campaign_data.fund_id).first()
    country_code = None
    if fund and fund.country_code:
        country_code = fund.country_code
    
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
        country_code=country_code,
        status=CampaignStatus.PENDING  # Требуется модерация
    )
    
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    
    # Синхронизация с e-replika.ru будет вызвана из API эндпоинта через BackgroundTasks
    
    return campaign


def update_campaign_progress(
    db: Session,
    campaign_id: int,
    amount: float,
    send_notification: bool = True
) -> Campaign:
    """
    Обновить прогресс кампании (вызывается при успешном донате)
    
    Args:
        send_notification: Отправлять ли уведомление организатору
    """
    from datetime import datetime
    from app.models import User
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if campaign:
        old_amount = float(campaign.collected_amount)
        campaign.collected_amount += amount
        campaign.participants_count += 1
        
        # Проверка достижения цели
        goal_reached = False
        if campaign.collected_amount >= campaign.goal_amount and campaign.status == CampaignStatus.ACTIVE:
            campaign.status = CampaignStatus.COMPLETED
            goal_reached = True
        
        db.commit()
        db.refresh(campaign)
        
        # Отправка уведомления организатору (в фоне, не блокируя ответ)
        if send_notification:
            try:
                owner = db.query(User).filter(User.id == campaign.owner_id).first()
                if owner and owner.tg_id:
                    from app.services import notification_service
                    import threading
                    
                    # Отправляем уведомление в отдельном потоке (не блокируя основной поток)
                    def send_notification_thread():
                        try:
                            notification_service.notify_campaign_donation_sync(
                                owner_tg_id=int(owner.tg_id),
                                campaign_title=campaign.title,
                                donation_amount=amount,
                                currency=campaign.currency or "RUB",
                                total_collected=float(campaign.collected_amount),
                                goal_amount=float(campaign.goal_amount)
                            )
                        except Exception as e:
                            logger.warning(f"Не удалось отправить уведомление организатору: {e}")
                    
                    # Запускаем в отдельном потоке
                    thread = threading.Thread(target=send_notification_thread, daemon=True)
                    thread.start()
                        
            except Exception as e:
                logger.warning(f"Ошибка при подготовке уведомления организатору: {e}")
            
            # Если цель достигнута, отправляем уведомление о завершении
            if goal_reached:
                try:
                    owner = db.query(User).filter(User.id == campaign.owner_id).first()
                    if owner and owner.tg_id:
                        from app.services import notification_service
                        import threading
                        
                        def send_completion_notification_thread():
                            try:
                                # Используем асинхронную версию для завершения
                                message = f"""✅ <b>Кампания успешно завершена!</b>

📋 <b>Кампания:</b> {campaign.title}

💰 <b>Собрано:</b> {campaign.collected_amount:,.0f} {campaign.currency or 'RUB'}
🎯 <b>Цель:</b> {campaign.goal_amount:,.0f} {campaign.currency or 'RUB'}
👥 <b>Участников:</b> {campaign.participants_count}

Отчёт о расходовании средств будет опубликован фондом-получателем.

Благодарим вас за инициативу! 🙏"""
                                
                                notification_service.send_telegram_message_sync(
                                    chat_id=int(owner.tg_id),
                                    text=message
                                )
                            except Exception as e:
                                logger.warning(f"Не удалось отправить уведомление о завершении: {e}")
                        
                        thread = threading.Thread(target=send_completion_notification_thread, daemon=True)
                        thread.start()
                except Exception as e:
                    logger.warning(f"Ошибка при подготовке уведомления о завершении: {e}")
        
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

