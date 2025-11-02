"""
API роутер для кампаний
"""
from fastapi import APIRouter, Depends, HTTPException, Header, Query, BackgroundTasks
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
    country_code: Optional[str] = Query(None, description="Фильтр по стране (ISO 3166-1 alpha-2)"),
    category: Optional[str] = Query(None, description="Фильтр по категории"),
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    sort: Optional[str] = Query(None, description="Сортировка: popularity, progress, newest, oldest"),
    db: Session = Depends(get_db)
):
    """
    Получить список активных кампаний
    
    Сортировка:
    - popularity: по популярности (количество участников)
    - progress: по прогрессу (% сбора)
    - newest: по дате создания (новые сначала)
    - oldest: по дате создания (старые сначала)
    """
    campaigns = campaign_service.get_campaigns(
        db=db,
        country_code=country_code,
        category=category,
        status=status,
        sort=sort
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


async def sync_campaign_to_replika(campaign_id: int):
    """Фоновая задача для синхронизации кампании с e-replika"""
    from sqlalchemy.orm import Session
    from app.core.database import SessionLocal
    from app.services.e_replika_service import e_replika_service
    
    db: Session = SessionLocal()
    try:
        from app.models import Campaign
        campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
        if campaign:
            campaign_data = {
                "id": campaign.id,
                "owner_id": campaign.owner_id,
                "fund_id": campaign.fund_id,
                "title": campaign.title,
                "description": campaign.description,
                "category": campaign.category,
                "goal_amount": float(campaign.goal_amount),
                "collected_amount": float(campaign.collected_amount),
                "currency": campaign.currency,
                "status": campaign.status.value,
                "banner_url": campaign.banner_url,
                "end_date": campaign.end_date.isoformat() if campaign.end_date else None,
                "created_at": campaign.created_at.isoformat() if campaign.created_at else None,
            }
            await e_replika_service.sync_campaign(campaign_data)
            import logging
            logger = logging.getLogger(__name__)
            logger.info(f"Successfully synced campaign {campaign_id} to e-replika")
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error syncing campaign {campaign_id} to e-replika: {e}")
    finally:
        db.close()


@router.post("", response_model=schemas.Campaign)
async def create_campaign(
    campaign_data: schemas.CampaignCreate,
    background_tasks: BackgroundTasks,
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
    
    # Синхронизация с e-replika.ru в фоне
    background_tasks.add_task(sync_campaign_to_replika, campaign.id)
    
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


@router.get("/{campaign_id}/donations", response_model=List[schemas.Donation])
async def get_campaign_donations(
    campaign_id: int,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Получить историю пожертвований кампании (последние N)
    """
    from app.models import Donation
    from app.models.donation import DonationStatus
    
    # Проверяем существование кампании
    campaign = campaign_service.get_campaign(db=db, campaign_id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Получаем завершённые пожертвования для этой кампании
    donations = db.query(Donation).filter(
        Donation.campaign_id == campaign_id,
        Donation.status == DonationStatus.COMPLETED
    ).order_by(
        Donation.completed_at.desc()
    ).limit(limit).all()
    
    return donations


@router.patch("/{campaign_id}/status", response_model=schemas.Campaign)
async def update_campaign_status(
    campaign_id: int,
    status_data: schemas.CampaignStatusUpdate,
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """
    Обновить статус кампании (модерация)
    
    Body:
    {
        "status": "approved" | "rejected",
        "rejection_reason": "string" (optional, для rejected)
    }
    
    Только администраторы могут изменять статус
    """
    from app.core.config import settings
    from app.core.telegram import get_user_from_init_data
    from app.services import donation_service
    
    # Проверка прав администратора
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
    
    admin_ids = [int(id.strip()) for id in settings.ADMIN_TELEGRAM_IDS.split(",") if id.strip()] if settings.ADMIN_TELEGRAM_IDS else []
    
    if admin_ids and user_data.get("id") not in admin_ids:
        raise HTTPException(status_code=403, detail="Access denied. Admin rights required.")
    
    if status_data.status == "approved":
        # Одобрить кампанию
        campaign = campaign_service.moderate_campaign(
            db=db,
            campaign_id=campaign_id,
            moderator_id=user.id,
            action="approve"
        )
    elif status_data.status == "rejected":
        # Отклонить кампанию
        campaign = campaign_service.moderate_campaign(
            db=db,
            campaign_id=campaign_id,
            moderator_id=user.id,
            action="reject",
            rejection_reason=status_data.rejection_reason
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid status. Use 'approved' or 'rejected'"
        )
    
    return campaign


@router.get("/{campaign_id}/report", response_model=schemas.CampaignReport)
async def get_campaign_report(
    campaign_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить отчёт о завершённой кампании
    """
    from app.models import Fund
    from app.models.campaign import CampaignStatus
    
    # Получаем кампанию
    campaign = campaign_service.get_campaign(db=db, campaign_id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Проверяем, что кампания завершена
    if campaign.status not in [CampaignStatus.COMPLETED, CampaignStatus.EXPIRED]:
        raise HTTPException(
            status_code=400, 
            detail="Campaign is not completed. Report available only for completed campaigns."
        )
    
    # Получаем информацию о фонде
    fund = db.query(Fund).filter(Fund.id == campaign.fund_id).first()
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    
    # Получаем дату перечисления (последнее завершённое пожертвование)
    from app.models import Donation
    from app.models.donation import DonationStatus
    
    last_donation = db.query(Donation).filter(
        Donation.campaign_id == campaign_id,
        Donation.status == DonationStatus.COMPLETED
    ).order_by(
        Donation.completed_at.desc()
    ).first()
    
    # Получаем отчёт фонда, если есть
    from app.models.report import Report
    fund_report = db.query(Report).filter(
        Report.fund_id == campaign.fund_id,
        Report.verified == True
    ).order_by(
        Report.created_at.desc()
    ).first()
    
    # Формируем отчёт
    report = schemas.CampaignReport(
        campaign_id=campaign.id,
        total_collected=campaign.collected_amount,
        total_participants=campaign.participants_count,
        fund_name=fund.name,
        fund_report_url=fund_report.file_url if fund_report else None,
        transferred_at=last_donation.completed_at if last_donation else campaign.updated_at,
        report_documents=None  # Пока нет системы хранения документов для кампаний
    )
    
    return report