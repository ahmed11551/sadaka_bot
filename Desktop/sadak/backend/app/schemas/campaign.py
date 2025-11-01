"""
Схемы для кампаний
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
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


class Campaign(CampaignBase):
    id: int
    owner_id: int
    fund_id: int
    collected_amount: Decimal
    status: CampaignStatus
    start_date: datetime
    participants_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

