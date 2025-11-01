"""
Схемы для фондов
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class FundBase(BaseModel):
    name: str
    description: Optional[str] = None
    country_code: Optional[str] = None
    categories: List[str] = []
    logo_url: Optional[str] = None
    website_url: Optional[str] = None


class FundCreate(FundBase):
    pass


class Fund(FundBase):
    id: int
    verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

