"""
API роутер для пожертвований
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app import schemas
from app.services import donation_service

router = APIRouter()


def get_current_user(
    x_telegram_init_data: Optional[str] = Header(None, alias="X-Telegram-Init-Data"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Получение текущего пользователя из Telegram initData или веб-авторизации"""
    from app.models import User
    
    # Приоритет 1: Telegram WebApp
    if x_telegram_init_data:
        user_data = get_user_from_init_data(x_telegram_init_data)
        if user_data:
            user = donation_service.get_or_create_user(
                db=db,
                tg_id=user_data.get("id"),
                first_name=user_data.get("first_name"),
                last_name=user_data.get("last_name"),
                username=user_data.get("username")
            )
            return user
    
    # Приоритет 2: Веб-авторизация (Bearer token)
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        # TODO: Валидация JWT токена для веб-версии
        # Пока создаем или находим пользователя по сессии
        # Для веб-версии можно использовать session_id или анонимного пользователя
        pass
    
    # Приоритет 3: Анонимный режим для веб (временный пользователь для тестирования)
    # Для веб-версии создаем пользователя с временным ID
    # В продакшене нужно будет реализовать полноценную авторизацию
    from app.models import User
    import uuid
    
    # Проверяем заголовок для веб-версии
    web_user_id = None
    # TODO: Реализовать сессию или JWT токен для веб-пользователей
    
    # Временное решение: создаем пользователя для веб-версии
    # Используем отрицательный tg_id для веб-пользователей
    web_user = db.query(User).filter(User.tg_id == -1).first()
    if not web_user:
        web_user = User(
            tg_id=-1,  # Временное решение для веб-версии
            first_name="Web",
            last_name="User",
            username="web_user"
        )
        db.add(web_user)
        db.commit()
        db.refresh(web_user)
    return web_user


@router.post("/init", response_model=schemas.Donation)
async def init_donation(
    donation_data: schemas.DonationInit,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Инициализация пожертвования
    Создает запись и возвращает URL для оплаты
    """
    donation = donation_service.init_donation(
        db=db,
        user_id=user.id,
        donation_data=donation_data,
        return_url=donation_data.return_url
    )
    return donation


@router.get("/{donation_id}", response_model=schemas.Donation)
async def get_donation(
    donation_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить информацию о пожертвовании"""
    donation = donation_service.get_donation(db=db, donation_id=donation_id, user_id=user.id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation

