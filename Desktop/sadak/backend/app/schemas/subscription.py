"""
Схемы для подписок
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from decimal import Decimal
from app.models.subscription import SubscriptionPlan, SubscriptionPeriod, SubscriptionStatus


class SubscriptionBase(BaseModel):
    fund_id: Optional[int] = None
    plan: SubscriptionPlan
    period: SubscriptionPeriod


class SubscriptionInit(SubscriptionBase):
    """Схема для инициализации подписки"""
    return_url: Optional[str] = None


class SubscriptionCreate(SubscriptionBase):
    amount_value: Decimal
    currency: str = "RUB"
    charity_percent: Decimal = 0


class Subscription(SubscriptionBase):
    id: int
    user_id: int
    amount_value: Decimal
    currency: str
    charity_percent: Decimal
    status: SubscriptionStatus
    payment_token: Optional[str] = None
    payment_provider: Optional[str] = None
    started_at: datetime
    next_charge_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

