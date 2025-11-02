"""
Сервис для работы с пожертвованиями
"""
from sqlalchemy.orm import Session
from typing import Optional
from app.models import User, Donation
from app.schemas.donation import DonationInit
from app.services.payment import payment_service
from datetime import datetime
from app.models.donation import DonationStatus
import logging

logger = logging.getLogger(__name__)


def get_or_create_user(
    db: Session,
    tg_id: int,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    username: Optional[str] = None
) -> User:
    """Получить или создать пользователя"""
    user = db.query(User).filter(User.tg_id == tg_id).first()
    is_new = False
    if not user:
        user = User(
            tg_id=tg_id,
            first_name=first_name,
            last_name=last_name,
            username=username
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new = True
    
    # Синхронизация нового пользователя с e-replika.ru будет вызвана из API эндпоинта через BackgroundTasks
    
    return user


def init_donation(
    db: Session,
    user_id: int,
    donation_data: DonationInit,
    return_url: Optional[str] = None
) -> Donation:
    """
    Инициализировать пожертвование
    Создает запись и генерирует платежную ссылку
    """
    donation = Donation(
        user_id=user_id,
        fund_id=donation_data.fund_id,
        campaign_id=donation_data.campaign_id,
        amount_value=donation_data.amount_value,
        currency=donation_data.currency,
        donation_type=donation_data.donation_type,
        status=DonationStatus.PENDING
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    
    # Инициализация платежа через платежный сервис
    payment_result = payment_service.init_payment(
        amount=float(donation_data.amount_value),
        currency=donation_data.currency,
        order_id=str(donation.id),
        return_url=return_url
    )
    
    # Обновляем donation с данными платежа
    donation.payment_id = payment_result.get("payment_id")
    donation.payment_url = payment_result.get("payment_url")
    donation.provider = payment_result.get("provider")
    donation.status = DonationStatus.PROCESSING
    
    db.commit()
    db.refresh(donation)
    
    # Синхронизация с e-replika.ru будет вызвана из API эндпоинта через BackgroundTasks
    # Это позволяет не блокировать ответ и корректно обрабатывать async
    
    return donation


def get_donation(db: Session, donation_id: int, user_id: int) -> Optional[Donation]:
    """Получить пожертвование по ID"""
    return db.query(Donation).filter(
        Donation.id == donation_id,
        Donation.user_id == user_id
    ).first()


def update_donation_status(
    db: Session,
    donation_id: int,
    status: DonationStatus,
    payment_id: Optional[str] = None
) -> Donation:
    """Обновить статус пожертвования (для вебхуков)"""
    from app.services import campaign_service
    
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if donation:
        donation.status = status
        if payment_id:
            donation.payment_id = payment_id
        if status == DonationStatus.COMPLETED:
            donation.completed_at = datetime.utcnow()
            
            # Обновляем прогресс кампании, если пожертвование связано с кампанией
            if donation.campaign_id:
                campaign_service.update_campaign_progress(
                    db=db,
                    campaign_id=donation.campaign_id,
                    amount=float(donation.amount_value)
                )
        
        db.commit()
        db.refresh(donation)
    return donation

