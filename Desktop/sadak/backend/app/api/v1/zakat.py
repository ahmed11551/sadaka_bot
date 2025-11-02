"""
API роутер для закята
"""
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.telegram import get_user_from_init_data
from app import schemas
from app.services import zakat_service

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


@router.post("/calc", response_model=schemas.ZakatCalc)
async def calculate_zakat(
    calc_data: schemas.ZakatCalcCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Рассчитать закят
    Возвращает расчетную сумму закята (2.5% от суммы сверх нисаба)
    """
    calculation = zakat_service.calculate_zakat(
        db=db,
        user_id=user.id,
        calc_data=calc_data
    )
    return calculation


@router.post("/pay", response_model=schemas.Donation)
async def pay_zakat(
    pay_data: schemas.ZakatPay,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Выплатить закят
    Создает пожертвование на рассчитанную сумму
    """
    donation = zakat_service.pay_zakat(
        db=db,
        user_id=user.id,
        calculation_id=pay_data.calculation_id,
        return_url=pay_data.return_url
    )
    return donation


@router.get("/history", response_model=list[schemas.ZakatCalc])
async def get_zakat_history(
    limit: int = Query(50, ge=1, le=100, description="Максимальное количество записей"),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить историю расчётов закята пользователя
    """
    calculations = zakat_service.get_zakat_history(
        db=db,
        user_id=user.id,
        limit=limit
    )
    return calculations
