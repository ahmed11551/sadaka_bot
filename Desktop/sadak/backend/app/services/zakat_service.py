"""
Сервис для расчета и выплаты закята
"""
from sqlalchemy.orm import Session
from decimal import Decimal
from typing import Dict, Any
from app.models import ZakatCalc, Donation
from app.schemas.zakat import ZakatCalcCreate, ZakatPay
from app.services.donation_service import init_donation
from app.schemas.donation import DonationInit
from app.models.donation import DonationStatus


# Порог нисаба (минимальный размер облагаемого имущества)
# Примерная стоимость 612.36 грамм серебра или 85 грамм золота
NISAB_SILVER = Decimal("25000")  # Примерная стоимость в RUB
NISAB_GOLD = Decimal("450000")  # Примерная стоимость в RUB


def calculate_total_wealth(calc_data: ZakatCalcCreate) -> Decimal:
    """Рассчитать общее имущество"""
    total = Decimal("0")
    
    if calc_data.cash:
        total += calc_data.cash
    
    if calc_data.gold:
        weight = Decimal(str(calc_data.gold.get("weight", 0)))
        rate = Decimal(str(calc_data.gold.get("rate", 0)))
        total += weight * rate
    
    if calc_data.silver:
        weight = Decimal(str(calc_data.silver.get("weight", 0)))
        rate = Decimal(str(calc_data.silver.get("rate", 0)))
        total += weight * rate
    
    if calc_data.goods:
        total += calc_data.goods
    
    if calc_data.debts:
        total += calc_data.debts  # Полученные долги увеличивают имущество
    
    return total


def calculate_zakat(
    db: Session,
    user_id: int,
    calc_data: ZakatCalcCreate
) -> ZakatCalc:
    """
    Рассчитать закят
    Закят = 2.5% от имущества сверх нисаба
    """
    total_wealth = calculate_total_wealth(calc_data)
    nisab_value = NISAB_GOLD  # Используем золотой нисаб
    
    zakat_due = Decimal("0")
    if total_wealth >= nisab_value:
        # 2.5% = 0.025
        zakat_due = (total_wealth - nisab_value) * Decimal("0.025")
    
    # Сохраняем payload для истории
    payload = {
        "cash": str(calc_data.cash or 0),
        "gold": calc_data.gold,
        "silver": calc_data.silver,
        "goods": str(calc_data.goods or 0),
        "debts": str(calc_data.debts or 0),
    }
    
    calculation = ZakatCalc(
        user_id=user_id,
        payload_json=payload,
        total_wealth=total_wealth,
        nisab_value=nisab_value,
        zakat_due=zakat_due
    )
    
    db.add(calculation)
    db.commit()
    db.refresh(calculation)
    
    return calculation


def pay_zakat(
    db: Session,
    user_id: int,
    calculation_id: int,
    return_url: str = None
) -> Donation:
    """
    Выплатить закят
    Создает пожертвование на рассчитанную сумму
    """
    calculation = db.query(ZakatCalc).filter(
        ZakatCalc.id == calculation_id,
        ZakatCalc.user_id == user_id
    ).first()
    
    if not calculation:
        raise ValueError("Calculation not found")
    
    if calculation.zakat_due <= 0:
        raise ValueError("Zakat amount is zero or negative")
    
    # Создаем пожертвование типа "zakat"
    donation_data = DonationInit(
        amount_value=calculation.zakat_due,
        currency="RUB",
        donation_type="zakat",
        return_url=return_url
    )
    
    donation = init_donation(
        db=db,
        user_id=user_id,
        donation_data=donation_data,
        return_url=return_url
    )
    
    # Связываем расчет с пожертвованием
    calculation.donation_id = donation.id
    db.commit()
    
    return donation

