"""
Утилиты для работы с Telegram WebApp
"""
import hmac
import hashlib
import json
from urllib.parse import parse_qsl
from typing import Optional, Dict
from app.core.config import settings


def validate_telegram_init_data(init_data: str) -> Optional[Dict]:
    """
    Валидация initData от Telegram WebApp
    
    Args:
        init_data: Строка initData от Telegram
        
    Returns:
        Dict с данными пользователя или None если невалидно
    """
    try:
        # Если SECRET_KEY не настроен, пропускаем валидацию (для разработки)
        if not settings.TELEGRAM_SECRET_KEY:
            # В режиме разработки просто парсим данные без валидации
            parsed_data = dict(parse_qsl(init_data))
            if 'user' in parsed_data:
                user_data = json.loads(parsed_data['user'])
                return {
                    'user': user_data,
                    'auth_date': parsed_data.get('auth_date'),
                    'query_id': parsed_data.get('query_id'),
                }
            return None
        
        # Парсинг параметров
        parsed_data = dict(parse_qsl(init_data))
        
        # Извлечение hash и остальных данных
        received_hash = parsed_data.pop('hash', None)
        if not received_hash:
            return None
        
        # Создание строки для проверки
        data_check_string = '\n'.join(
            f"{k}={v}" for k, v in sorted(parsed_data.items())
        )
        
        # Генерация секретного ключа
        secret_key = hmac.new(
            b"WebAppData",
            settings.TELEGRAM_SECRET_KEY.encode(),
            hashlib.sha256
        ).digest()
        
        # Вычисление hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Проверка
        if calculated_hash != received_hash:
            return None
        
        # Парсинг user данных
        if 'user' in parsed_data:
            user_data = json.loads(parsed_data['user'])
            return {
                'user': user_data,
                'auth_date': parsed_data.get('auth_date'),
                'query_id': parsed_data.get('query_id'),
            }
        
        return None
        
    except Exception:
        return None


def get_user_from_init_data(init_data: str) -> Optional[Dict]:
    """Извлечение данных пользователя из initData"""
    validated = validate_telegram_init_data(init_data)
    if validated:
        return validated.get('user')
    return None

