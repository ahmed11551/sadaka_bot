# Интеграция с платежными системами

## YooKassa

### Настройка

1. Зарегистрируйтесь на [YooKassa](https://yookassa.ru/)
2. Создайте магазин и получите:
   - `YOOKASSA_SHOP_ID` - ID магазина
   - `YOOKASSA_SECRET_KEY` - Секретный ключ

3. Добавьте в `.env`:
```env
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key
```

### API Документация

- Официальная документация: https://yookassa.ru/developers/api
- API v3: https://api.yookassa.ru/v3/payments

### Структура запроса

```python
POST https://api.yookassa.ru/v3/payments
Authorization: Basic <base64(shop_id:secret_key)>
Idempotence-Key: <unique_key>

{
  "amount": {
    "value": "500.00",
    "currency": "RUB"
  },
  "confirmation": {
    "type": "redirect",
    "return_url": "https://t.me/your_bot"
  },
  "description": "Пожертвование #123",
  "metadata": {
    "order_id": "123"
  }
}
```

### Обработка вебхуков

YooKassa отправляет уведомления на URL, указанный в настройках магазина:
```
POST https://your-domain.com/api/v1/payments/webhook/yookassa
X-Yookassa-Signature: <signature>
```

## CloudPayments

### Настройка

1. Зарегистрируйтесь на [CloudPayments](https://cloudpayments.ru/)
2. Получите в личном кабинете:
   - `CLOUDPAYMENTS_PUBLIC_ID` - Public ID
   - `CLOUDPAYMENTS_API_SECRET` - API Secret

3. Добавьте в `.env`:
```env
CLOUDPAYMENTS_PUBLIC_ID=your_public_id
CLOUDPAYMENTS_API_SECRET=your_api_secret
```

### API Документация

- Официальная документация: https://developers.cloudpayments.ru/
- API: https://api.cloudpayments.ru/

### Структура запроса

```python
POST https://api.cloudpayments.ru/payments/cards/charge
Authorization: Basic <base64(public_id:api_secret)>

{
  "Amount": 500.00,
  "Currency": "RUB",
  "InvoiceId": "123",
  "Description": "Пожертвование #123",
  "ReturnUrl": "https://t.me/your_bot"
}
```

### Обработка вебхуков

CloudPayments отправляет уведомления на URL, указанный в настройках:
```
POST https://your-domain.com/api/v1/payments/webhook/cloudpayments
Content-HMAC: <hmac_signature>
```

## Тестирование

### YooKassa Test Mode

Для тестирования используйте тестовые карты:
- Успешный платеж: `5555 5555 5555 4444`
- Отклоненный платеж: `5555 5555 5555 4477`

### CloudPayments Test Mode

В настройках включите тестовый режим и используйте тестовые карты из документации.

## Валидация вебхуков

Обе системы требуют проверки подписи для безопасности:

1. **YooKassa**: Используйте HMAC-SHA256 с секретным ключом
2. **CloudPayments**: Используйте HMAC-SHA256 с API Secret

Пример валидации реализован в `payment_service.py`.

## Обработка ошибок

Все ошибки платежей должны логироваться и обрабатываться:
- Неудачная инициализация → вернуть ошибку пользователю
- Неудачный платеж → обновить статус donation на `failed`
- Успешный платеж → обновить статус на `completed` и обновить прогресс кампании (если применимо)

## Следующие шаги

1. Получите тестовые ключи от обеих систем
2. Раскомментируйте реальные запросы в `payment_service.py`
3. Настройте вебхуки в панелях управления
4. Протестируйте полный цикл платежа
5. Переключитесь на продакшн-режим после тестирования

