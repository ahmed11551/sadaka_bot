"""
Модель подписки (садака-джария)
"""
from sqlalchemy import Column, BigInteger, String, Numeric, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class SubscriptionPlan(str, enum.Enum):
    BASIC = "basic"
    PRO = "pro"
    PREMIUM = "premium"


class SubscriptionPeriod(str, enum.Enum):
    P1M = "P1M"  # 1 месяц
    P3M = "P3M"  # 3 месяца
    P6M = "P6M"  # 6 месяцев
    P12M = "P12M"  # 12 месяцев


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    fund_id = Column(BigInteger, ForeignKey("funds.id"))  # Опционально, если подписка общая
    
    plan = Column(Enum(SubscriptionPlan), nullable=False)
    period = Column(Enum(SubscriptionPeriod), nullable=False)
    
    amount_value = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="RUB")
    
    # Процент от суммы, идущий на благотворительность (для Pro/Premium)
    charity_percent = Column(Numeric(5, 2), default=0)
    
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE)
    
    # Рекуррентные платежи
    payment_token = Column(String(255))  # Токен карты для рекуррентных списаний
    payment_provider = Column(String(50))
    
    # Даты
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    next_charge_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    cancelled_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="subscriptions")
    fund = relationship("Fund", backref="subscriptions")

