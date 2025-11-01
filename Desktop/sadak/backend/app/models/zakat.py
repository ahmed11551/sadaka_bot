"""
Модель расчета закята
"""
from sqlalchemy import Column, BigInteger, Numeric, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class ZakatCalc(Base):
    __tablename__ = "zakat_calculations"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    
    # Данные расчета в JSON
    # {
    #   "cash": 100000,
    #   "gold": {"weight": 100, "rate": 6000},
    #   "silver": {...},
    #   "goods": {...},
    #   "debts": {...}
    # }
    payload_json = Column(JSON)
    
    total_wealth = Column(Numeric(10, 2))
    nisab_value = Column(Numeric(10, 2))  # Порог нисаба
    zakat_due = Column(Numeric(10, 2))  # Сумма закята (2.5%)
    
    # Связь с выплатой
    donation_id = Column(BigInteger, ForeignKey("donations.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", backref="zakat_calculations")
    donation = relationship("Donation", foreign_keys=[donation_id])

