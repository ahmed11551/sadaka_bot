"""
Схемы для закята
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from decimal import Decimal


class ZakatCalcCreate(BaseModel):
    """Данные для расчета закята"""
    cash: Optional[Decimal] = 0  # Наличные деньги
    bank_cash: Optional[Decimal] = 0  # Деньги на счету в банке
    gold: Optional[Dict[str, Any]] = None  # {"weight": 100, "rate": 6000}
    silver: Optional[Dict[str, Any]] = None  # {"weight": 612.36, "rate": 80}
    goods: Optional[Decimal] = 0  # Товары и доходы
    investments: Optional[Decimal] = 0  # Инвестиции в имущество
    other_income: Optional[Decimal] = 0  # Другие доходы
    expenses: Optional[Decimal] = 0  # Расходы (вычитаются)
    debts: Optional[Decimal] = 0  # Долги (вычитаются)


class ZakatCalc(BaseModel):
    id: int
    user_id: int
    total_wealth: Decimal
    nisab_value: Decimal
    zakat_due: Decimal
    donation_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ZakatPay(BaseModel):
    """Запрос на выплату закята"""
    calculation_id: int
    return_url: Optional[str] = None

