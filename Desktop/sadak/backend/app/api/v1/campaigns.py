"""
API роутер для кампаний
"""
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app import schemas
from app.services import campaign_service

router = APIRouter()


def get_current_user(
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """Получение текущего пользователя из Telegram initData"""
    from app.services import donation_service
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
    return user


@router.get("", response_model=List[schemas.Campaign])
async def get_campaigns(
    country_code: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Получить список активных кампаний"""
    campaigns = campaign_service.get_campaigns(
        db=db,
        country_code=country_code,
        category=category,
        status=status
    )
    return campaigns


@router.get("/{campaign_id}", response_model=schemas.Campaign)
async def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db)
):
    """Получить информацию о кампании"""
    campaign = campaign_service.get_campaign(db=db, campaign_id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.post("", response_model=schemas.Campaign)
async def create_campaign(
    campaign_data: schemas.CampaignCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Создать новую кампанию
    Статус автоматически устанавливается в PENDING (на модерации)
    """
    campaign = campaign_service.create_campaign(
        db=db,
        user_id=user.id,
        campaign_data=campaign_data
    )
    return campaign


@router.post("/{campaign_id}/donate", response_model=schemas.Donation)
async def donate_to_campaign(
    campaign_id: int,
    donation_data: schemas.DonationInit,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Пожертвовать в кампанию
    """
    from app.services import donation_service
    
    # Проверяем существование кампании и что она активна
    campaign = campaign_service.get_campaign(db=db, campaign_id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    from app.models.campaign import CampaignStatus
    if campaign.status != CampaignStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Campaign is not active")
    
    # Создаем пожертвование с привязкой к кампании
    donation_data.campaign_id = campaign_id
    donation_data.donation_type = "campaign"
    
    donation = donation_service.init_donation(
        db=db,
        user_id=user.id,
        donation_data=donation_data
    )
    
    return donation

