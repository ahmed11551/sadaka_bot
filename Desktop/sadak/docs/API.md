# API Документация

## Базовый URL
```
http://localhost:8000/api/v1
```

## Аутентификация

Все запросы (кроме вебхуков) требуют заголовок:
```
X-Telegram-Init-Data: <telegram_init_data>
```

## Эндпоинты

### Фонды

#### GET /funds
Получить список фондов с фильтрацией

**Query параметры:**
- `country_code` (optional) - Код страны (ISO 3166-1 alpha-2)
- `category` (optional) - Категория
- `verified` (optional) - Только проверенные (true/false)

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "Фонд помощи",
    "description": "Описание",
    "country_code": "RU",
    "categories": ["мечеть", "сироты"],
    "verified": true,
    "logo_url": "https://...",
    "website_url": "https://...",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### Пожертвования

#### POST /donations/init
Инициализировать пожертвование

**Тело запроса:**
```json
{
  "fund_id": 1,
  "campaign_id": null,
  "amount_value": 500.00,
  "currency": "RUB",
  "donation_type": "sadaqa",
  "return_url": "https://..."
}
```

**Ответ:**
```json
{
  "id": 1,
  "user_id": 123,
  "fund_id": 1,
  "amount_value": "500.00",
  "currency": "RUB",
  "status": "processing",
  "provider": "yookassa",
  "payment_id": "yk_123",
  "payment_url": "https://yookassa.ru/payment/...",
  "donation_type": "sadaqa",
  "created_at": "2024-01-01T00:00:00"
}
```

### Подписки

#### POST /subscriptions/init
Инициализировать подписку

**Тело запроса:**
```json
{
  "fund_id": null,
  "plan": "pro",
  "period": "P6M",
  "return_url": "https://..."
}
```

#### GET /subscriptions
Получить мои подписки

#### POST /subscriptions/{id}/cancel
Отменить подписку

### Кампании

#### GET /campaigns
Получить список кампаний

**Query параметры:**
- `country_code` (optional)
- `category` (optional)
- `status` (optional)

#### GET /campaigns/{id}
Получить информацию о кампании

#### POST /campaigns
Создать новую кампанию

**Тело запроса:**
```json
{
  "fund_id": 1,
  "title": "Сбор на мечеть",
  "description": "Описание",
  "category": "мечеть",
  "goal_amount": 100000.00,
  "currency": "RUB",
  "banner_url": "https://...",
  "end_date": "2024-12-31T23:59:59"
}
```

### Закят

#### POST /zakat/calc
Рассчитать закят

**Тело запроса:**
```json
{
  "cash": 100000,
  "gold": {"weight": 100, "rate": 6000},
  "silver": null,
  "goods": 50000,
  "debts": 10000
}
```

**Ответ:**
```json
{
  "id": 1,
  "user_id": 123,
  "total_wealth": "760000.00",
  "nisab_value": "450000.00",
  "zakat_due": "7750.00",
  "created_at": "2024-01-01T00:00:00"
}
```

#### POST /zakat/pay
Выплатить закят

**Тело запроса:**
```json
{
  "calculation_id": 1,
  "return_url": "https://..."
}
```

### История

#### GET /me/history
Получить историю транзакций пользователя

**Ответ:**
```json
[
  {
    "type": "donation",
    "id": 1,
    "amount": 500.00,
    "currency": "RUB",
    "status": "completed",
    "donation_type": "sadaqa",
    "created_at": "2024-01-01T00:00:00"
  },
  {
    "type": "subscription",
    "id": 1,
    "amount": 1000.00,
    "currency": "RUB",
    "plan": "pro",
    "period": "P6M",
    "status": "active",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### Вебхуки

#### POST /payments/webhook/yookassa
Вебхук от YooKassa

#### POST /payments/webhook/cloudpayments
Вебхук от CloudPayments

## Интерактивная документация

После запуска сервера доступна Swagger документация:
- http://localhost:8000/docs
- http://localhost:8000/redoc

