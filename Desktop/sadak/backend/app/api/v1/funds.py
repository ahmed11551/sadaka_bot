"""
API роутер для фондов
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app import schemas
from app.services import fund_service

router = APIRouter()


@router.get("", response_model=List[schemas.Fund])
async def get_funds(
    country_code: Optional[str] = Query(None, description="Фильтр по стране"),
    category: Optional[str] = Query(None, description="Фильтр по категории"),
    verified: Optional[bool] = Query(None, description="Только проверенные"),
    db: Session = Depends(get_db)
):
    """
    Получить список фондов с фильтрацией
    """
    funds = fund_service.get_funds(
        db=db,
        country_code=country_code,
        category=category,
        verified=verified
    )
    return funds


@router.get("/{fund_id}", response_model=schemas.Fund)
async def get_fund(
    fund_id: int,
    db: Session = Depends(get_db)
):
    """Получить информацию о фонде"""
    fund = fund_service.get_fund(db=db, fund_id=fund_id)
    return fund

