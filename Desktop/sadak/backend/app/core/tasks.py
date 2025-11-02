"""
Фоновые задачи для периодического выполнения
"""
from app.core.database import SessionLocal
from app.services import campaign_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


async def check_expired_campaigns_task():
    """
    Задача для проверки и завершения истекших кампаний
    Вызывается периодически (через APScheduler)
    """
    from app.models import User
    
    db = SessionLocal()
    try:
        expired = campaign_service.check_and_expire_campaigns(db=db)
        if expired:
            logger.info(f"⏰ Завершено {len(expired)} истекших кампаний: {[c.id for c in expired]}")
            
            # Отправляем уведомления организаторам
            from app.services import notification_service
            
            for campaign in expired:
                try:
                    owner = db.query(User).filter(User.id == campaign.owner_id).first()
                    if owner and owner.tg_id:
                        await notification_service.notify_campaign_expired(
                            owner_tg_id=int(owner.tg_id),
                            campaign_title=campaign.title,
                            total_collected=float(campaign.collected_amount),
                            goal_amount=float(campaign.goal_amount),
                            participants_count=int(campaign.participants_count),
                            currency=campaign.currency or "RUB"
                        )
                except Exception as e:
                    logger.warning(f"Не удалось отправить уведомление организатору кампании {campaign.id}: {e}")
        else:
            logger.debug("Проверка кампаний: истекших не найдено")
        return expired
    except Exception as e:
        logger.error(f"❌ Ошибка при проверке истекших кампаний: {e}", exc_info=True)
        return []
    finally:
        db.close()

