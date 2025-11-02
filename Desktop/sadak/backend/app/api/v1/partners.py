"""
API роутер для партнёрства фондов
"""
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app.core.config import settings
from app import schemas
from app.services import partner_service
from app.services import donation_service
from app.models.partner_application import PartnerApplicationStatus

router = APIRouter()


def get_current_user(
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """Получение текущего пользователя из Telegram initData"""
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


def check_admin(user_data: dict):
    """Проверка прав администратора"""
    admin_ids = [int(id.strip()) for id in settings.ADMIN_TELEGRAM_IDS.split(",") if id.strip()] if settings.ADMIN_TELEGRAM_IDS else []
    if admin_ids and user_data.get("id") not in admin_ids:
        raise HTTPException(status_code=403, detail="Access denied. Admin rights required.")


@router.post("/applications", response_model=schemas.PartnerApplication)
async def create_partner_application(
    application_data: schemas.PartnerApplicationCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Создать заявку на партнёрство
    """
    application = partner_service.create_partner_application(
        db=db,
        application_data=application_data
    )
    return application


@router.get("/applications", response_model=List[schemas.PartnerApplication])
async def get_partner_applications(
    status: Optional[str] = Query(None, description="Фильтр по статусу (pending, approved, rejected)"),
    country_code: Optional[str] = Query(None, description="Фильтр по стране"),
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """
    Получить список заявок на партнёрство
    Только администраторы могут просматривать все заявки
    """
    user_data = get_user_from_init_data(x_telegram_init_data)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid Telegram initData")
    
    # Проверка прав администратора
    check_admin(user_data)
    
    # Преобразуем строку статуса в enum
    status_enum = None
    if status:
        try:
            status_enum = PartnerApplicationStatus(status)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")
    
    applications = partner_service.get_partner_applications(
        db=db,
        status=status_enum,
        country_code=country_code
    )
    return applications


@router.get("/applications/{application_id}", response_model=schemas.PartnerApplication)
async def get_partner_application(
    application_id: int,
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """
    Получить заявку по ID
    Только администраторы
    """
    user_data = get_user_from_init_data(x_telegram_init_data)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid Telegram initData")
    
    # Проверка прав администратора
    check_admin(user_data)
    
    application = partner_service.get_partner_application(
        db=db,
        application_id=application_id
    )
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application


@router.patch("/applications/{application_id}/status", response_model=schemas.PartnerApplication)
async def update_partner_application_status(
    application_id: int,
    status_data: schemas.PartnerApplicationStatusUpdate,
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """
    Обновить статус заявки (одобрить/отклонить)
    Только администраторы
    """
    user_data = get_user_from_init_data(x_telegram_init_data)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid Telegram initData")
    
    # Проверка прав администратора
    check_admin(user_data)
    
    user = donation_service.get_or_create_user(
        db=db,
        tg_id=user_data.get("id"),
        first_name=user_data.get("first_name"),
        last_name=user_data.get("last_name"),
        username=user_data.get("username")
    )
    
    application = partner_service.update_partner_application_status(
        db=db,
        application_id=application_id,
        reviewer_id=user.id,
        status_update=status_data
    )
    
    return application


@router.get("/funds", response_model=List[schemas.Fund])
async def get_partner_funds(
    country_code: Optional[str] = Query(None, description="Фильтр по стране"),
    category: Optional[str] = Query(None, description="Фильтр по категории"),
    db: Session = Depends(get_db)
):
    """
    Получить список фондов-партнёров
    Алиас для GET /funds?verified=true
    """
    from app.services import fund_service
    funds = fund_service.get_funds(
        db=db,
        country_code=country_code,
        category=category,
        verified=True  # Только проверенные фонды
    )
    return funds

