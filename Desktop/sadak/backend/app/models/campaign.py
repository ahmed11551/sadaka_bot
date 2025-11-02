"""
Модель целевой кампании
"""
from sqlalchemy import Column, BigInteger, String, Numeric, DateTime, ForeignKey, Boolean, Text, Enum, func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"  # На модерации
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(BigInteger, primary_key=True, index=True)
    owner_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    fund_id = Column(BigInteger, ForeignKey("funds.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100))  # Категория цели
    
    goal_amount = Column(Numeric(10, 2), nullable=False)
    collected_amount = Column(Numeric(10, 2), default=0)
    currency = Column(String(3), default="RUB")
    
    # Страна (берётся из fund, но можно указать напрямую)
    country_code = Column(String(2))  # ISO 3166-1 alpha-2
    
    # Медиа
    banner_url = Column(String(512))
    
    # Даты
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=False)
    
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    
    # Модерация
    moderated_by = Column(BigInteger, ForeignKey("users.id"))  # ID модератора
    moderated_at = Column(DateTime(timezone=True))
    rejection_reason = Column(Text)
    
    # Статистика
    participants_count = Column(BigInteger, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", foreign_keys=[owner_id], backref="owned_campaigns")
    fund = relationship("Fund", backref="campaigns")
    moderator = relationship("User", foreign_keys=[moderated_by])

