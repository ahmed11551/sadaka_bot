"""
Схемы для кампаний
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from app.models.campaign import CampaignStatus


class CampaignBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    goal_amount: Decimal
    currency: str = "RUB"
    banner_url: Optional[str] = None
    end_date: datetime


class CampaignCreate(CampaignBase):
    fund_id: int


class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    goal_amount: Optional[Decimal] = None
    banner_url: Optional[str] = None
    end_date: Optional[datetime] = None


class CampaignStatusUpdate(BaseModel):
    """Схема для обновления статуса кампании"""
    status: str  # "approved" | "rejected"
    rejection_reason: Optional[str] = None


class Campaign(CampaignBase):
    id: int
    owner_id: int
    fund_id: int
    collected_amount: Decimal
    status: CampaignStatus
    start_date: datetime
    participants_count: int
    country_code: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CampaignReport(BaseModel):
    """Отчёт о завершённой кампании"""
    campaign_id: int
    total_collected: Decimal
    total_participants: int
    fund_name: str
    fund_report_url: Optional[str] = None
    transferred_at: Optional[datetime] = None
    report_documents: Optional[List[str]] = None  # URLs to PDF/images

    class Config:
        from_attributes = True
