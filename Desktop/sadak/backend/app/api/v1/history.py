"""
API роутер для истории транзакций и статистики пользователя
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app.services import donation_service
from app.models import Donation, Subscription

router = APIRouter()


def get_current_user(
    x_telegram_init_data: Optional[str] = Header(None, alias="X-Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """Получение текущего пользователя из Telegram initData"""
    if not x_telegram_init_data:
        raise HTTPException(status_code=401, detail="Telegram initData required")
    
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


@router.get("/history")
async def get_history(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить историю всех транзакций пользователя
    (пожертвования, подписки, закят)
    """
    from app.services import history_service
    history = history_service.get_user_history(db=db, user_id=user.id)
    return history


class UserStatsResponse(BaseModel):
    """Статистика пользователя"""
    total_donations_month: float
    total_donations_year: float
    total_count_month: int
    total_count_year: int
    active_subscriptions: int
    currency: str = "RUB"


@router.get("/stats", response_model=UserStatsResponse)
async def get_user_stats(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить статистику пользователя:
    - Общая сумма пожертвований за месяц
    - Общая сумма пожертвований за год
    - Количество транзакций
    - Количество активных подписок
    """
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Пожертвования за месяц
    donations_month = db.query(
        func.sum(Donation.amount_value).label('total'),
        func.count(Donation.id).label('count')
    ).filter(
        Donation.user_id == user.id,
        Donation.status == 'completed',
        Donation.completed_at >= month_start
    ).first()
    
    # Пожертвования за год
    donations_year = db.query(
        func.sum(Donation.amount_value).label('total'),
        func.count(Donation.id).label('count')
    ).filter(
        Donation.user_id == user.id,
        Donation.status == 'completed',
        Donation.completed_at >= year_start
    ).first()
    
    # Активные подписки
    active_subs = db.query(func.count(Subscription.id)).filter(
        Subscription.user_id == user.id,
        Subscription.status == 'active'
    ).scalar() or 0
    
    return UserStatsResponse(
        total_donations_month=float(donations_month.total or 0),
        total_donations_year=float(donations_year.total or 0),
        total_count_month=int(donations_month.count or 0),
        total_count_year=int(donations_year.count or 0),
        active_subscriptions=int(active_subs),
        currency="RUB"
    )

