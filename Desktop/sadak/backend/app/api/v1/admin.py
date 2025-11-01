"""
API роутер для администраторов (модерация кампаний)
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app import schemas
from app.services import campaign_service
from app.models.campaign import CampaignStatus

router = APIRouter(prefix="/admin", tags=["admin"])


def get_admin_user(
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """Получение администратора с проверкой прав"""
    from app.services import donation_service
    from app.core.config import settings
    
    user_data = get_user_from_init_data(x_telegram_init_data)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid Telegram initData")
    
    user = donation_service.get_or_create_user(
        db=db,
        tg_id=user_data.get("id"),
        first_name=user_data.get("first_name"),
        last_name=user_data.get("last_name"),
        username=user_data.get("username")
    )
    
    # Проверка прав администратора
    tg_id = user_data.get("id")
    admin_ids = [int(id.strip()) for id in settings.ADMIN_TELEGRAM_IDS.split(",") if id.strip()] if settings.ADMIN_TELEGRAM_IDS else []
    
    if admin_ids and tg_id not in admin_ids:
        raise HTTPException(status_code=403, detail="Access denied. Admin rights required.")
    
    # Если ADMIN_TELEGRAM_IDS не настроен, разрешаем всем (для разработки)
    return user


@router.get("/campaigns/pending", response_model=List[schemas.Campaign])
async def get_pending_campaigns(
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Получить список кампаний на модерации"""
    campaigns = campaign_service.get_campaigns(
        db=db,
        status="pending"
    )
    return campaigns


@router.post("/campaigns/{campaign_id}/approve", response_model=schemas.Campaign)
async def approve_campaign(
    campaign_id: int,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Одобрить кампанию"""
    campaign = campaign_service.moderate_campaign(
        db=db,
        campaign_id=campaign_id,
        moderator_id=admin.id,
        action="approve"
    )
    return campaign


class CampaignRejectRequest(BaseModel):
    reason: str


@router.post("/campaigns/{campaign_id}/reject", response_model=schemas.Campaign)
async def reject_campaign(
    campaign_id: int,
    request: CampaignRejectRequest,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Отклонить кампанию"""
    campaign = campaign_service.moderate_campaign(
        db=db,
        campaign_id=campaign_id,
        moderator_id=admin.id,
        action="reject",
        rejection_reason=request.reason
    )
    return campaign


@router.post("/campaigns/check-expired")
async def check_expired_campaigns(
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Проверить и завершить истекшие кампании"""
    expired = campaign_service.check_and_expire_campaigns(db=db)
    return {
        "message": f"Expired {len(expired)} campaigns",
        "expired_campaigns": len(expired)
    }

