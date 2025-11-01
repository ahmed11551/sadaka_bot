"""
API роутер для подписок
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app import schemas
from app.services import subscription_service

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


@router.post("/init", response_model=schemas.Subscription)
async def init_subscription(
    subscription_data: schemas.SubscriptionInit,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Инициализация подписки
    """
    subscription = subscription_service.init_subscription(
        db=db,
        user_id=user.id,
        subscription_data=subscription_data,
        return_url=subscription_data.return_url
    )
    return subscription


@router.get("", response_model=list[schemas.Subscription])
async def get_my_subscriptions(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить мои подписки"""
    subscriptions = subscription_service.get_user_subscriptions(db=db, user_id=user.id)
    return subscriptions


@router.post("/{subscription_id}/cancel")
async def cancel_subscription(
    subscription_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Отменить подписку"""
    subscription = subscription_service.cancel_subscription(
        db=db,
        subscription_id=subscription_id,
        user_id=user.id
    )
    return {"status": "cancelled", "subscription_id": subscription.id}

