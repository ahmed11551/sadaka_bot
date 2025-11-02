"""
Сервис для работы с заявками на партнёрство фондов
"""
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List
from app.models import PartnerApplication
from app.models.partner_application import PartnerApplicationStatus
from app.schemas.partner_application import PartnerApplicationCreate, PartnerApplicationStatusUpdate
import logging

logger = logging.getLogger(__name__)


def create_partner_application(
    db: Session,
    application_data: PartnerApplicationCreate
) -> PartnerApplication:
    """
    Создать заявку на партнёрство
    """
    application = PartnerApplication(
        organization_name=application_data.organization_name,
        contact_email=application_data.contact_email,
        contact_phone=application_data.contact_phone,
        category=application_data.category,
        country_code=application_data.country_code,
        description=application_data.description,
        website_url=application_data.website_url,
        status=PartnerApplicationStatus.PENDING
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    logger.info(f"Создана заявка на партнёрство: {application.id} - {application.organization_name}")
    
    return application


def get_partner_applications(
    db: Session,
    status: Optional[PartnerApplicationStatus] = None,
    country_code: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[PartnerApplication]:
    """
    Получить список заявок на партнёрство с фильтрацией
    """
    query = db.query(PartnerApplication)
    
    if status:
        query = query.filter(PartnerApplication.status == status)
    
    if country_code:
        query = query.filter(PartnerApplication.country_code == country_code)
    
    return query.order_by(PartnerApplication.created_at.desc()).offset(skip).limit(limit).all()


def get_partner_application(
    db: Session,
    application_id: int
) -> Optional[PartnerApplication]:
    """
    Получить заявку по ID
    """
    return db.query(PartnerApplication).filter(
        PartnerApplication.id == application_id
    ).first()


def update_partner_application_status(
    db: Session,
    application_id: int,
    reviewer_id: int,
    status_update: PartnerApplicationStatusUpdate
) -> PartnerApplication:
    """
    Обновить статус заявки (одобрить/отклонить)
    Только администратор может изменять статус
    """
    application = db.query(PartnerApplication).filter(
        PartnerApplication.id == application_id
    ).first()
    
    if not application:
        raise ValueError("Application not found")
    
    if application.status != PartnerApplicationStatus.PENDING:
        raise ValueError("Application has already been reviewed")
    
    application.status = status_update.status
    application.reviewed_by = reviewer_id
    application.reviewed_at = datetime.utcnow()
    
    if status_update.status == PartnerApplicationStatus.REJECTED:
        application.rejection_reason = status_update.rejection_reason
    
    db.commit()
    db.refresh(application)
    
    logger.info(f"Заявка {application_id} обновлена: {status_update.status} пользователем {reviewer_id}")
    
    return application

