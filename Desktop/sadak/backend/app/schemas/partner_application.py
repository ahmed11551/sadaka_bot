"""
Схемы для заявок на партнёрство фондов
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.partner_application import PartnerApplicationStatus


class PartnerApplicationCreate(BaseModel):
    """Схема для создания заявки на партнёрство"""
    organization_name: str
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    category: str
    country_code: str  # ISO 3166-1 alpha-2
    description: str
    website_url: Optional[str] = None


class PartnerApplication(BaseModel):
    """Схема заявки на партнёрство"""
    id: int
    organization_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    category: str
    country_code: str
    description: str
    website_url: Optional[str] = None
    status: PartnerApplicationStatus
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PartnerApplicationStatusUpdate(BaseModel):
    """Схема для обновления статуса заявки (админ)"""
    status: PartnerApplicationStatus
    rejection_reason: Optional[str] = None

