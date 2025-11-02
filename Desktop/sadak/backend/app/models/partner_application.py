"""
Модель заявки на партнёрство фонда
"""
from sqlalchemy import Column, BigInteger, String, Text, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class PartnerApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class PartnerApplication(Base):
    __tablename__ = "partner_applications"

    id = Column(BigInteger, primary_key=True, index=True)
    
    # Информация об организации
    organization_name = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50))
    category = Column(String(100), nullable=False)
    country_code = Column(String(2), nullable=False)  # ISO 3166-1 alpha-2
    description = Column(Text, nullable=False)
    website_url = Column(String(500))
    
    # Статус заявки
    status = Column(Enum(PartnerApplicationStatus), default=PartnerApplicationStatus.PENDING)
    
    # Модерация
    reviewed_by = Column(BigInteger, ForeignKey("users.id"))
    reviewed_at = Column(DateTime(timezone=True))
    rejection_reason = Column(Text)  # Причина отклонения
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reviewer = relationship("User", foreign_keys=[reviewed_by])

