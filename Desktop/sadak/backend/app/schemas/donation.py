"""
Схемы для пожертвований
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from decimal import Decimal
from app.models.donation import DonationStatus, PaymentProvider


class DonationBase(BaseModel):
    fund_id: Optional[int] = None
    campaign_id: Optional[int] = None
    amount_value: Decimal
    currency: str = "RUB"
    donation_type: str = "sadaqa"


class DonationInit(DonationBase):
    """Схема для инициализации платежа"""
    return_url: Optional[str] = None


class DonationCreate(DonationBase):
    pass


class Donation(DonationBase):
    id: int
    user_id: int
    status: DonationStatus
    provider: Optional[PaymentProvider] = None
    payment_id: Optional[str] = None
    payment_url: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

