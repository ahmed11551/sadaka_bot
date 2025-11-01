"""
Сервис для истории транзакций
"""
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models import Donation, Subscription
from datetime import datetime


def get_user_history(
    db: Session,
    user_id: int,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Получить полную историю транзакций пользователя
    """
    history = []
    
    # Пожертвования
    donations = db.query(Donation).filter(
        Donation.user_id == user_id
    ).order_by(Donation.created_at.desc()).limit(limit).all()
    
    for donation in donations:
        history.append({
            "type": "donation",
            "id": donation.id,
            "amount": float(donation.amount_value),
            "currency": donation.currency,
            "status": donation.status.value,
            "donation_type": donation.donation_type,
            "fund_id": donation.fund_id,
            "campaign_id": donation.campaign_id,
            "created_at": donation.created_at.isoformat(),
            "completed_at": donation.completed_at.isoformat() if donation.completed_at else None,
        })
    
    # Подписки
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).order_by(Subscription.created_at.desc()).limit(limit).all()
    
    for subscription in subscriptions:
        history.append({
            "type": "subscription",
            "id": subscription.id,
            "amount": float(subscription.amount_value),
            "currency": subscription.currency,
            "plan": subscription.plan.value,
            "period": subscription.period.value,
            "status": subscription.status.value,
            "charity_percent": float(subscription.charity_percent),
            "created_at": subscription.created_at.isoformat(),
            "next_charge_at": subscription.next_charge_at.isoformat() if subscription.next_charge_at else None,
        })
    
    # Сортировка по дате
    history.sort(key=lambda x: x["created_at"], reverse=True)
    
    return history[:limit]

