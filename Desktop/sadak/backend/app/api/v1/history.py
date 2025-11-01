"""
API роутер для истории транзакций
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app.services import donation_service

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

