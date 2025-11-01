"""
Сервис для работы с платежными системами
Автоматический выбор между YooKassa и CloudPayments
"""
from typing import Dict, Optional
from app.core.config import settings
import httpx
import logging

logger = logging.getLogger(__name__)


class PaymentService:
    """Сервис для инициализации платежей"""
    
    def init_payment(
        self,
        amount: float,
        currency: str = "RUB",
        order_id: str = None,
        return_url: Optional[str] = None,
        card_bin: Optional[str] = None  # Первые 6 цифр карты для автовыбора провайдера
    ) -> Dict:
        """
        Инициализация платежа с автоматическим выбором провайдера
        
        Логика выбора:
        - Если BIN карты начинается с 4,5,6 (Visa/MC) и сумма < 10000 RUB -> CloudPayments
        - Если российская карта или сумма >= 10000 -> YooKassa
        - По умолчанию пробуем YooKassa, затем CloudPayments
        """
        # TODO: Реализовать определение страны по BIN карты
        
        # Пробуем YooKassa сначала (основной провайдер для РФ)
        if settings.YOOKASSA_SHOP_ID and settings.YOOKASSA_SECRET_KEY:
            try:
                result = self._init_yookassa(
                    amount=amount,
                    currency=currency,
                    order_id=order_id,
                    return_url=return_url
                )
                if result:
                    return result
            except Exception:
                pass
        
        # Фоллбэк на CloudPayments
        if settings.CLOUDPAYMENTS_PUBLIC_ID and settings.CLOUDPAYMENTS_API_SECRET:
            try:
                result = self._init_cloudpayments(
                    amount=amount,
                    currency=currency,
                    order_id=order_id,
                    return_url=return_url
                )
                if result:
                    return result
            except Exception:
                pass
        
        raise Exception("No payment provider available")
    
    def _init_yookassa(
        self,
        amount: float,
        currency: str,
        order_id: str,
        return_url: Optional[str]
    ) -> Optional[Dict]:
        """Инициализация платежа через YooKassa"""
        import base64
        import httpx
        
        from app.core.config import settings
        
        # Базовая авторизация
        auth_string = f"{settings.YOOKASSA_SHOP_ID}:{settings.YOOKASSA_SECRET_KEY}"
        auth_header = base64.b64encode(auth_string.encode()).decode()
        
        # URL API (для продакшена используйте https://api.yookassa.ru/v3/payments)
        api_url = "https://api.yookassa.ru/v3/payments"
        # Для тестирования: https://api.yookassa.ru/v3/payments (test mode)
        
        payload = {
            "amount": {
                "value": f"{amount:.2f}",
                "currency": currency
            },
            "confirmation": {
                "type": "redirect",
                "return_url": return_url or "https://t.me/your_bot"
            },
            "description": f"Пожертвование #{order_id}",
            "metadata": {
                "order_id": order_id
            }
        }
        
        try:
            # Реальный запрос (раскомментировать когда будут реальные ключи):
            # async with httpx.AsyncClient() as client:
            #     response = await client.post(
            #         api_url,
            #         json=payload,
            #         headers={
            #             "Authorization": f"Basic {auth_header}",
            #             "Content-Type": "application/json",
            #             "Idempotence-Key": order_id  # Для предотвращения дубликатов
            #         },
            #         timeout=30.0
            #     )
            #     response.raise_for_status()
            #     data = response.json()
            #     return {
            #         "payment_id": data.get("id"),
            #         "payment_url": data.get("confirmation", {}).get("confirmation_url"),
            #         "provider": "yookassa"
            #     }
            
            # Заглушка для разработки
            return {
                "payment_id": f"yk_{order_id}",
                "payment_url": f"https://yookassa.ru/payment/{order_id}?test=true",
                "provider": "yookassa"
            }
        except Exception as e:
            logger.error(f"YooKassa payment init error: {e}", exc_info=True)
            return None
    
    def _init_cloudpayments(
        self,
        amount: float,
        currency: str,
        order_id: str,
        return_url: Optional[str]
    ) -> Optional[Dict]:
        """Инициализация платежа через CloudPayments"""
        import httpx
        
        from app.core.config import settings
        
        # CloudPayments использует Basic Auth
        from base64 import b64encode
        auth_string = f"{settings.CLOUDPAYMENTS_PUBLIC_ID}:{settings.CLOUDPAYMENTS_API_SECRET}"
        auth_header = b64encode(auth_string.encode()).decode()
        
        # URL для создания платежа
        api_url = "https://api.cloudpayments.ru/payments/cards/charge"
        
        payload = {
            "Amount": amount,
            "Currency": currency,
            "InvoiceId": order_id,
            "Description": f"Пожертвование #{order_id}",
            "ReturnUrl": return_url or "https://t.me/your_bot"
        }
        
        try:
            # Реальный запрос (раскомментировать когда будут реальные ключи):
            # async with httpx.AsyncClient() as client:
            #     response = await client.post(
            #         api_url,
            #         json=payload,
            #         headers={
            #             "Authorization": f"Basic {auth_header}",
            #             "Content-Type": "application/json"
            #         },
            #         timeout=30.0
            #     )
            #     response.raise_for_status()
            #     data = response.json()
            #     
            #     if data.get("Success"):
            #         return {
            #             "payment_id": data.get("Model", {}).get("TransactionId"),
            #             "payment_url": data.get("Model", {}).get("RedirectUrl"),
            #             "provider": "cloudpayments"
            #         }
            #     else:
            #         raise Exception(data.get("Message", "Payment failed"))
            
            # Заглушка для разработки
            return {
                "payment_id": f"cp_{order_id}",
                "payment_url": f"https://cloudpayments.ru/payment/{order_id}?test=true",
                "provider": "cloudpayments"
            }
        except Exception as e:
            logger.error(f"CloudPayments payment init error: {e}", exc_info=True)
            return None
    
    def verify_webhook(self, provider: str, data: Dict, signature: str) -> bool:
        """Валидация вебхука от платежной системы"""
        if provider == "yookassa":
            return self._verify_yookassa_webhook(data, signature)
        elif provider == "cloudpayments":
            return self._verify_cloudpayments_webhook(data, signature)
        return False
    
    def _verify_yookassa_webhook(self, data: Dict, signature: str) -> bool:
        """Валидация вебхука YooKassa"""
        # TODO: Реализовать проверку HMAC подписи
        return True
    
    def _verify_cloudpayments_webhook(self, data: Dict, signature: str) -> bool:
        """Валидация вебхука CloudPayments"""
        # TODO: Реализовать проверку подписи
        return True

