"""
Сервис для работы с фондами
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from app.models import Fund


def get_funds(
    db: Session,
    country_code: Optional[str] = None,
    category: Optional[str] = None,
    verified: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Fund]:
    """Получить список фондов с фильтрацией"""
    query = db.query(Fund)
    
    if country_code:
        query = query.filter(Fund.country_code == country_code)
    
    if category:
        query = query.filter(Fund.categories.contains([category]))
    
    if verified is not None:
        query = query.filter(Fund.verified == verified)
    
    return query.offset(skip).limit(limit).all()


def get_fund(db: Session, fund_id: int) -> Fund:
    """Получить фонд по ID"""
    return db.query(Fund).filter(Fund.id == fund_id).first()

