"""
Схемы для закята
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from decimal import Decimal


class ZakatCalcCreate(BaseModel):
    """Данные для расчета закята"""
    cash: Optional[Decimal] = 0
    gold: Optional[Dict[str, Any]] = None  # {"weight": 100, "rate": 6000}
    silver: Optional[Dict[str, Any]] = None
    goods: Optional[Decimal] = 0
    debts: Optional[Decimal] = 0  # Полученные долги (положительные)


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

