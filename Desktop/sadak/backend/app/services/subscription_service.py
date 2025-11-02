"""
Сервис для работы с подписками
"""
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import Optional
from app.models import Subscription
from app.schemas.subscription import SubscriptionInit
from app.models.subscription import SubscriptionStatus, SubscriptionPlan, SubscriptionPeriod
from decimal import Decimal


# Тарифы подписок
SUBSCRIPTION_PRICES = {
    SubscriptionPlan.BASIC: {
        SubscriptionPeriod.P1M: Decimal("500"),
        SubscriptionPeriod.P3M: Decimal("1350"),  # -10%
        SubscriptionPeriod.P6M: Decimal("2400"),  # -20% + 2 мес в подарок
        SubscriptionPeriod.P12M: Decimal("4200"),  # -30% + 4 мес в подарок
    },
    SubscriptionPlan.PRO: {
        SubscriptionPeriod.P1M: Decimal("1000"),
        SubscriptionPeriod.P3M: Decimal("2700"),
        SubscriptionPeriod.P6M: Decimal("4800"),
        SubscriptionPeriod.P12M: Decimal("8400"),
    },
    SubscriptionPlan.PREMIUM: {
        SubscriptionPeriod.P1M: Decimal("2500"),
        SubscriptionPeriod.P3M: Decimal("6750"),
        SubscriptionPeriod.P6M: Decimal("12000"),
        SubscriptionPeriod.P12M: Decimal("21000"),
    },
}

CHARITY_PERCENT = {
    SubscriptionPlan.BASIC: Decimal("0"),
    SubscriptionPlan.PRO: Decimal("5"),
    SubscriptionPlan.PREMIUM: Decimal("10"),
}


def get_subscription_price(plan: SubscriptionPlan, period: SubscriptionPeriod) -> Decimal:
    """Получить цену подписки"""
    return SUBSCRIPTION_PRICES[plan][period]


def get_period_months(period: SubscriptionPeriod) -> int:
    """Получить количество месяцев из периода"""
    period_map = {
        SubscriptionPeriod.P1M: 1,
        SubscriptionPeriod.P3M: 3,
        SubscriptionPeriod.P6M: 6 + 2,  # +2 месяца в подарок
        SubscriptionPeriod.P12M: 12 + 4,  # +4 месяца в подарок
    }
    return period_map[period]


def init_subscription(
    db: Session,
    user_id: int,
    subscription_data: SubscriptionInit,
    return_url: Optional[str] = None
) -> Subscription:
    """
    Инициализировать подписку
    """
    amount = get_subscription_price(subscription_data.plan, subscription_data.period)
    charity_percent = CHARITY_PERCENT[subscription_data.plan]
    
    months = get_period_months(subscription_data.period)
    expires_at = datetime.utcnow() + timedelta(days=months * 30)
    
    subscription = Subscription(
        user_id=user_id,
        fund_id=subscription_data.fund_id,
        plan=subscription_data.plan,
        period=subscription_data.period,
        amount_value=amount,
        currency="RUB",
        charity_percent=charity_percent,
        status=SubscriptionStatus.ACTIVE,
        expires_at=expires_at,
        next_charge_at=datetime.utcnow() + timedelta(days=30)  # Первое списание через месяц
    )
    
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    
    # TODO: Инициализация рекуррентного платежа через платежный сервис
    
    return subscription


def get_user_subscriptions(
    db: Session,
    user_id: int,
    status: Optional[SubscriptionStatus] = None
) -> list[Subscription]:
    """Получить подписки пользователя"""
    query = db.query(Subscription).filter(Subscription.user_id == user_id)
    if status:
        query = query.filter(Subscription.status == status)
    return query.all()


def cancel_subscription(
    db: Session,
    subscription_id: int,
    user_id: int
) -> Subscription:
    """Отменить подписку"""
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user_id
    ).first()
    
    if not subscription:
        raise ValueError("Subscription not found")
    
    subscription.status = SubscriptionStatus.CANCELLED
    subscription.cancelled_at = datetime.utcnow()
    
    db.commit()
    db.refresh(subscription)
    
    return subscription


def pause_subscription(
    db: Session,
    subscription_id: int,
    user_id: int
) -> Subscription:
    """Приостановить подписку"""
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user_id
    ).first()
    
    if not subscription:
        raise ValueError("Subscription not found")
    
    if subscription.status != SubscriptionStatus.ACTIVE:
        raise ValueError("Only active subscriptions can be paused")
    
    subscription.status = SubscriptionStatus.PAUSED
    subscription.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(subscription)
    
    return subscription


def resume_subscription(
    db: Session,
    subscription_id: int,
    user_id: int
) -> Subscription:
    """Возобновить подписку"""
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user_id
    ).first()
    
    if not subscription:
        raise ValueError("Subscription not found")
    
    if subscription.status != SubscriptionStatus.PAUSED:
        raise ValueError("Only paused subscriptions can be resumed")
    
    # Проверяем, не истекла ли подписка
    if subscription.expires_at and subscription.expires_at < datetime.utcnow():
        raise ValueError("Subscription has expired and cannot be resumed")
    
    subscription.status = SubscriptionStatus.ACTIVE
    subscription.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(subscription)
    
    return subscription
