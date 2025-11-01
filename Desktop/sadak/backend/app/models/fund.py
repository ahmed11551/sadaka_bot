"""
Модель благотворительного фонда
"""
from sqlalchemy import Column, BigInteger, String, Boolean, ARRAY, DateTime, func, Text
from app.core.database import Base


class Fund(Base):
    __tablename__ = "funds"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    country_code = Column(String(2))  # ISO 3166-1 alpha-2
    categories = Column(ARRAY(String))  # ['мечеть', 'сироты', 'медицина', ...]
    verified = Column(Boolean, default=False)
    logo_url = Column(String(512))
    website_url = Column(String(512))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

