"""
Фоновые задачи для периодического выполнения
"""
from app.core.database import SessionLocal
from app.services import campaign_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def check_expired_campaigns_task():
    """
    Задача для проверки и завершения истекших кампаний
    Вызывается периодически (через cron или планировщик задач)
    """
    db = SessionLocal()
    try:
        expired = campaign_service.check_and_expire_campaigns(db=db)
        if expired:
            logger.info(f"Expired {len(expired)} campaigns: {[c.id for c in expired]}")
        return expired
    except Exception as e:
        logger.error(f"Error checking expired campaigns: {e}")
        raise
    finally:
        db.close()

