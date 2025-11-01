"""
Модель отчетности фонда
"""
from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(BigInteger, primary_key=True, index=True)
    fund_id = Column(BigInteger, ForeignKey("funds.id"), nullable=False)
    
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    
    # Метаданные
    title = Column(String(255))
    description = Column(String(1000))
    
    # Файл отчета
    file_url = Column(String(512))  # URL к PDF/документу
    
    # Верификация
    verified = Column(Boolean, default=False)
    verified_by = Column(BigInteger, ForeignKey("users.id"))
    verified_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    fund = relationship("Fund", backref="reports")
    verifier = relationship("User", foreign_keys=[verified_by])

