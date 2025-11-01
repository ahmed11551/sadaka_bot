"""
API роутер для статистики (интеграция с e-replika.ru)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.core.database import get_db
from app.services.e_replika_service import e_replika_service
from app.services.donation_service import get_or_create_user
from app.core.telegram import get_user_from_init_data
from fastapi import Header

router = APIRouter(prefix="/statistics", tags=["statistics"])


def get_authorized_user(
    x_telegram_init_data: Optional[str] = Header(None, alias="X-Telegram-Init-Data"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Получение авторизованного пользователя для статистики"""
    # Приоритет: Telegram initData, затем Bearer токен
    if x_telegram_init_data:
        user_data = get_user_from_init_data(x_telegram_init_data)
        if user_data:
            user = get_or_create_user(
                db=db,
                tg_id=user_data.get("id"),
                first_name=user_data.get("first_name"),
                last_name=user_data.get("last_name"),
                username=user_data.get("username")
            )
            return user
    
    # TODO: Добавить JWT валидацию для Bearer токена
    # Пока возвращаем заглушку
    if authorization and authorization.startswith("Bearer "):
        # В будущем здесь будет валидация JWT токена
        pass
    
    # Для разработки: если нет авторизации, возвращаем None
    # В продакшене здесь должно быть исключение
    return None


class StatisticsResponse(BaseModel):
    """Базовая модель ответа статистики"""
    total_donations: Optional[float] = None
    total_amount: Optional[float] = None
    total_users: Optional[int] = None
    total_campaigns: Optional[int] = None
    period_start: Optional[str] = None
    period_end: Optional[str] = None
    data: Optional[dict] = None


@router.get("/", response_model=StatisticsResponse)
async def get_statistics(
    start_date: Optional[str] = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    group_by: Optional[str] = Query(None, description="Группировка: day, week, month"),
    user = Depends(get_authorized_user),
    db: Session = Depends(get_db)
):
    """
    Получить общую статистику из e-replika.ru
    
    Примеры запросов:
    - GET /api/v1/statistics/
    - GET /api/v1/statistics/?start_date=2025-01-01&end_date=2025-01-31
    - GET /api/v1/statistics/?group_by=day
    """
    try:
        # Если даты не указаны, берем последние 30 дней
        if not start_date:
            end_date_obj = datetime.now()
            start_date_obj = end_date_obj - timedelta(days=30)
            start_date = start_date_obj.strftime("%Y-%m-%d")
        
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")
        
        # Получаем статистику из e-replika API
        stats = await e_replika_service.get_statistics(
            start_date=start_date,
            end_date=end_date,
            group_by=group_by
        )
        
        return StatisticsResponse(
            period_start=start_date,
            period_end=end_date,
            data=stats
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении статистики: {str(e)}"
        )


@router.get("/donations", response_model=StatisticsResponse)
async def get_donations_statistics(
    start_date: Optional[str] = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    user = Depends(get_authorized_user),
    db: Session = Depends(get_db)
):
    """
    Получить статистику по пожертвованиям из e-replika.ru
    """
    try:
        if not start_date:
            end_date_obj = datetime.now()
            start_date_obj = end_date_obj - timedelta(days=30)
            start_date = start_date_obj.strftime("%Y-%m-%d")
        
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")
        
        stats = await e_replika_service.get_donations_statistics(
            start_date=start_date,
            end_date=end_date
        )
        
        return StatisticsResponse(
            period_start=start_date,
            period_end=end_date,
            data=stats
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении статистики пожертвований: {str(e)}"
        )


@router.get("/campaigns", response_model=StatisticsResponse)
async def get_campaigns_statistics(
    start_date: Optional[str] = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    user = Depends(get_authorized_user),
    db: Session = Depends(get_db)
):
    """
    Получить статистику по кампаниям из e-replika.ru
    """
    try:
        if not start_date:
            end_date_obj = datetime.now()
            start_date_obj = end_date_obj - timedelta(days=30)
            start_date = start_date_obj.strftime("%Y-%m-%d")
        
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")
        
        stats = await e_replika_service.get_campaigns_statistics(
            start_date=start_date,
            end_date=end_date
        )
        
        return StatisticsResponse(
            period_start=start_date,
            period_end=end_date,
            data=stats
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении статистики кампаний: {str(e)}"
        )


@router.get("/users", response_model=StatisticsResponse)
async def get_users_statistics(
    start_date: Optional[str] = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    user = Depends(get_authorized_user),
    db: Session = Depends(get_db)
):
    """
    Получить статистику по пользователям из e-replika.ru
    """
    try:
        if not start_date:
            end_date_obj = datetime.now()
            start_date_obj = end_date_obj - timedelta(days=30)
            start_date = start_date_obj.strftime("%Y-%m-%d")
        
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")
        
        stats = await e_replika_service.get_users_statistics(
            start_date=start_date,
            end_date=end_date
        )
        
        return StatisticsResponse(
            period_start=start_date,
            period_end=end_date,
            data=stats
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении статистики пользователей: {str(e)}"
        )

