"""
Сервис для отправки уведомлений через Telegram Bot API
"""
import httpx
import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


def send_telegram_message_sync(
    chat_id: int,
    text: str,
    parse_mode: str = "HTML",
    disable_notification: bool = False
) -> bool:
    """
    Отправить сообщение пользователю через Telegram Bot API (синхронная версия)
    
    Args:
        chat_id: ID чата (Telegram user ID)
        text: Текст сообщения
        parse_mode: Режим парсинга (HTML или Markdown)
        disable_notification: Отключить уведомление
        
    Returns:
        True если успешно, False если ошибка
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN не настроен, уведомление не отправлено")
        return False
    
    bot_api_url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(
                bot_api_url,
                json={
                    "chat_id": chat_id,
                    "text": text,
                    "parse_mode": parse_mode,
                    "disable_notification": disable_notification,
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("ok"):
                    logger.info(f"Уведомление отправлено пользователю {chat_id}")
                    return True
                else:
                    logger.error(f"Ошибка отправки уведомления: {result.get('description')}")
                    return False
            else:
                logger.error(f"HTTP ошибка при отправке уведомления: {response.status_code}")
                return False
                
    except Exception as e:
        logger.error(f"Ошибка при отправке уведомления пользователю {chat_id}: {e}", exc_info=True)
        return False


async def send_telegram_message(
    chat_id: int,
    text: str,
    parse_mode: str = "HTML",
    disable_notification: bool = False
) -> bool:
    """
    Отправить сообщение пользователю через Telegram Bot API
    
    Args:
        chat_id: ID чата (Telegram user ID)
        text: Текст сообщения
        parse_mode: Режим парсинга (HTML или Markdown)
        disable_notification: Отключить уведомление
        
    Returns:
        True если успешно, False если ошибка
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN не настроен, уведомление не отправлено")
        return False
    
    bot_api_url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                bot_api_url,
                json={
                    "chat_id": chat_id,
                    "text": text,
                    "parse_mode": parse_mode,
                    "disable_notification": disable_notification,
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("ok"):
                    logger.info(f"Уведомление отправлено пользователю {chat_id}")
                    return True
                else:
                    logger.error(f"Ошибка отправки уведомления: {result.get('description')}")
                    return False
            else:
                logger.error(f"HTTP ошибка при отправке уведомления: {response.status_code}")
                return False
                
    except Exception as e:
        logger.error(f"Ошибка при отправке уведомления пользователю {chat_id}: {e}", exc_info=True)
        return False


def notify_campaign_donation_sync(
    owner_tg_id: int,
    campaign_title: str,
    donation_amount: float,
    currency: str = "RUB",
    total_collected: float = 0,
    goal_amount: float = 0
) -> bool:
    """
    Уведомить организатора кампании о новом пожертвовании (синхронная версия)
    """
    progress = (total_collected / goal_amount * 100) if goal_amount > 0 else 0
    
    message = f"""🎉 <b>Новое пожертвование в вашу кампанию!</b>

📋 <b>Кампания:</b> {campaign_title}
💰 <b>Сумма:</b> {donation_amount:,.0f} {currency}

📊 <b>Прогресс:</b> {total_collected:,.0f} / {goal_amount:,.0f} {currency}
📈 {progress:.1f}% от цели

Спасибо за вашу инициативу! 🙏"""
    
    return send_telegram_message_sync(owner_tg_id, message)


async def notify_campaign_donation(
    owner_tg_id: int,
    campaign_title: str,
    donation_amount: float,
    currency: str = "RUB",
    total_collected: float = 0,
    goal_amount: float = 0
) -> bool:
    """
    Уведомить организатора кампании о новом пожертвовании
    
    Args:
        owner_tg_id: Telegram ID организатора
        campaign_title: Название кампании
        donation_amount: Сумма пожертвования
        currency: Валюта
        total_collected: Общая собранная сумма
        goal_amount: Целевая сумма
        
    Returns:
        True если успешно
    """
    progress = (total_collected / goal_amount * 100) if goal_amount > 0 else 0
    
    message = f"""🎉 <b>Новое пожертвование в вашу кампанию!</b>

📋 <b>Кампания:</b> {campaign_title}
💰 <b>Сумма:</b> {donation_amount:,.0f} {currency}

📊 <b>Прогресс:</b> {total_collected:,.0f} / {goal_amount:,.0f} {currency}
📈 {progress:.1f}% от цели

Спасибо за вашу инициативу! 🙏"""
    
    return await send_telegram_message(owner_tg_id, message)


async def notify_campaign_completed(
    owner_tg_id: int,
    campaign_title: str,
    total_collected: float,
    goal_amount: float,
    participants_count: int,
    currency: str = "RUB"
) -> bool:
    """
    Уведомить организатора о завершении кампании
    
    Args:
        owner_tg_id: Telegram ID организатора
        campaign_title: Название кампании
        total_collected: Собранная сумма
        goal_amount: Целевая сумма
        participants_count: Количество участников
        currency: Валюта
        
    Returns:
        True если успешно
    """
    message = f"""✅ <b>Кампания успешно завершена!</b>

📋 <b>Кампания:</b> {campaign_title}

💰 <b>Собрано:</b> {total_collected:,.0f} {currency}
🎯 <b>Цель:</b> {goal_amount:,.0f} {currency}
👥 <b>Участников:</b> {participants_count}

Отчёт о расходовании средств будет опубликован фондом-получателем.

Благодарим вас за инициативу! 🙏"""
    
    return await send_telegram_message(owner_tg_id, message)


async def notify_campaign_expired(
    owner_tg_id: int,
    campaign_title: str,
    total_collected: float,
    goal_amount: float,
    participants_count: int,
    currency: str = "RUB"
) -> bool:
    """
    Уведомить организатора об истечении срока кампании
    
    Args:
        owner_tg_id: Telegram ID организатора
        campaign_title: Название кампании
        total_collected: Собранная сумма
        goal_amount: Целевая сумма
        participants_count: Количество участников
        currency: Валюта
        
    Returns:
        True если успешно
    """
    message = f"""⏰ <b>Срок кампании истёк</b>

📋 <b>Кампания:</b> {campaign_title}

💰 <b>Собрано:</b> {total_collected:,.0f} {currency}
🎯 <b>Цель:</b> {goal_amount:,.0f} {currency}
👥 <b>Участников:</b> {participants_count}

Средства будут перечислены фонду-получателю. Отчёт будет опубликован в ближайшее время.

Спасибо за вашу инициативу! 🙏"""
    
    return await send_telegram_message(owner_tg_id, message)

