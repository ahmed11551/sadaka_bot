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
# 85 грамм золота (nisab gold) или 612.36 грамм серебра (nisab silver)
NISAB_GOLD_GRAMS = Decimal("85")  # 85 грамм золота
NISAB_SILVER_GRAMS = Decimal("612.36")  # 612.36 грамм серебра

def calculate_nisab(gold_rate: Decimal = None, silver_rate: Decimal = None) -> Decimal:
    """
    Рассчитать нисаб на основе текущих цен на золото или серебро
    Используется большее значение (для безопасности)
    
    Args:
        gold_rate: Цена золота за грамм в RUB
        silver_rate: Цена серебра за грамм в RUB
    
    Returns:
        Значение нисаба в RUB
    """
    nisab_gold = Decimal("0")
    nisab_silver = Decimal("0")
    
    if gold_rate and gold_rate > 0:
        nisab_gold = NISAB_GOLD_GRAMS * gold_rate
    
    if silver_rate and silver_rate > 0:
        nisab_silver = NISAB_SILVER_GRAMS * silver_rate
    
    # Используем большее значение из двух (золотой нисаб обычно выше)
    if nisab_gold > 0 and nisab_silver > 0:
        return max(nisab_gold, nisab_silver)
    elif nisab_gold > 0:
        return nisab_gold
    elif nisab_silver > 0:
        return nisab_silver
    else:
        # Fallback: примерная стоимость если курсы не указаны
        return Decimal("450000")  # Примерная стоимость 85г золота


def calculate_total_wealth(calc_data: ZakatCalcCreate) -> Decimal:
    """
    Рассчитать общее имущество (активы)
    Долги и расходы вычитаются!
    """
    total = Decimal("0")
    
    # Активы (добавляем)
    if calc_data.cash:
        total += calc_data.cash
    
    if calc_data.bank_cash:
        total += calc_data.bank_cash
    
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
    
    if calc_data.investments:
        total += calc_data.investments
    
    if calc_data.other_income:
        total += calc_data.other_income
    
    # Вычитаем долги и расходы (они уменьшают облагаемую сумму)
    if calc_data.debts:
        total -= calc_data.debts  # Долги вычитаются!
    
    if calc_data.expenses:
        total -= calc_data.expenses  # Расходы вычитаются!
    
    # Итог не может быть отрицательным
    return max(total, Decimal("0"))


def calculate_zakat(
    db: Session,
    user_id: int,
    calc_data: ZakatCalcCreate
) -> ZakatCalc:
    """
    Рассчитать закят
    Закят = 2.5% от имущества сверх нисаба
    
    Нисаб рассчитывается на основе текущих цен на золото/серебро
    """
    # Получаем курсы золота и серебра для расчета нисаба
    gold_rate = None
    silver_rate = None
    
    if calc_data.gold and calc_data.gold.get("rate"):
        gold_rate = Decimal(str(calc_data.gold.get("rate", 0)))
    
    if calc_data.silver and calc_data.silver.get("rate"):
        silver_rate = Decimal(str(calc_data.silver.get("rate", 0)))
    
    # Рассчитываем нисаб на основе текущих курсов
    nisab_value = calculate_nisab(gold_rate, silver_rate)
    
    # Рассчитываем общее имущество (активы - долги - расходы)
    total_wealth = calculate_total_wealth(calc_data)
    
    # Закят рассчитывается только если имущество превышает нисаб
    zakat_due = Decimal("0")
    if total_wealth >= nisab_value:
        # 2.5% = 0.025 от всего облагаемого имущества
        zakat_due = total_wealth * Decimal("0.025")
    
    # Сохраняем payload для истории
    payload = {
        "cash": str(calc_data.cash or 0),
        "bank_cash": str(calc_data.bank_cash or 0),
        "gold": calc_data.gold,
        "silver": calc_data.silver,
        "goods": str(calc_data.goods or 0),
        "investments": str(calc_data.investments or 0),
        "other_income": str(calc_data.other_income or 0),
        "debts": str(calc_data.debts or 0),
        "expenses": str(calc_data.expenses or 0),
        "nisab_gold_rate": str(gold_rate) if gold_rate else None,
        "nisab_silver_rate": str(silver_rate) if silver_rate else None,
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


def get_zakat_history(
    db: Session,
    user_id: int,
    limit: int = 50
) -> list[ZakatCalc]:
    """
    Получить историю расчётов закята пользователя
    """
    calculations = db.query(ZakatCalc).filter(
        ZakatCalc.user_id == user_id
    ).order_by(
        ZakatCalc.created_at.desc()
    ).limit(limit).all()
    
    return calculations
