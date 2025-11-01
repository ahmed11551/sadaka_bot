"""
Модель пожертвования
"""
from sqlalchemy import Column, BigInteger, String, Numeric, DateTime, ForeignKey, func, Enum
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class DonationStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class PaymentProvider(str, enum.Enum):
    YOOKASSA = "yookassa"
    CLOUDPAYMENTS = "cloudpayments"


class Donation(Base):
    __tablename__ = "donations"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    fund_id = Column(BigInteger, ForeignKey("funds.id"))
    campaign_id = Column(BigInteger, ForeignKey("campaigns.id"))
    
    amount_value = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="RUB")
    
    status = Column(Enum(DonationStatus), default=DonationStatus.PENDING)
    provider = Column(Enum(PaymentProvider))
    
    # Платежные данные
    payment_id = Column(String(255))  # ID платежа от провайдера
    payment_url = Column(String(512))  # URL для редиректа на оплату
    
    # Метаданные
    donation_type = Column(String(50))  # 'sadaqa', 'zakat', 'campaign', 'quick'
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", backref="donations")
    fund = relationship("Fund", backref="donations")
    campaign = relationship("Campaign", backref="donations")

