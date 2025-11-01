# Структура базы данных

## ER-диаграмма основных сущностей

```
┌─────────┐       ┌──────────────┐       ┌──────────┐
│  User   │───────│  Donation    │───────│   Fund   │
└─────────┘       └──────────────┘       └──────────┘
     │                    │                     │
     │                    │                     │
     ├────────────────────┼─────────────────────┤
     │                    │                     │
┌──────────────┐   ┌────────────┐      ┌──────────────┐
│ Subscription │   │ Campaign   │      │   Report    │
└──────────────┘   └────────────┘      └──────────────┘
     │                    │
     │                    │
     └────────────────────┘
```

## Таблицы

### users
Хранит информацию о пользователях Telegram

- `id` (BIGINT, PK)
- `tg_id` (BIGINT, UNIQUE) - ID пользователя в Telegram
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `username` (VARCHAR)
- `locale` (VARCHAR(10))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### funds
Благотворительные фонды

- `id` (BIGINT, PK)
- `name` (VARCHAR(255))
- `description` (TEXT)
- `country_code` (VARCHAR(2))
- `categories` (ARRAY[VARCHAR])
- `verified` (BOOLEAN)
- `logo_url` (VARCHAR(512))
- `website_url` (VARCHAR(512))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### donations
Пожертвования

- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK -> users.id)
- `fund_id` (BIGINT, FK -> funds.id, nullable)
- `campaign_id` (BIGINT, FK -> campaigns.id, nullable)
- `amount_value` (NUMERIC(10,2))
- `currency` (VARCHAR(3))
- `status` (ENUM: pending, processing, completed, failed, cancelled)
- `provider` (ENUM: yookassa, cloudpayments)
- `payment_id` (VARCHAR(255))
- `payment_url` (VARCHAR(512))
- `donation_type` (VARCHAR(50))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP)

### subscriptions
Подписки (садака-джария)

- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK -> users.id)
- `fund_id` (BIGINT, FK -> funds.id, nullable)
- `plan` (ENUM: basic, pro, premium)
- `period` (ENUM: P1M, P3M, P6M, P12M)
- `amount_value` (NUMERIC(10,2))
- `currency` (VARCHAR(3))
- `charity_percent` (NUMERIC(5,2))
- `status` (ENUM: active, paused, cancelled, expired)
- `payment_token` (VARCHAR(255))
- `payment_provider` (VARCHAR(50))
- `started_at` (TIMESTAMP)
- `next_charge_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `cancelled_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### campaigns
Целевые кампании

- `id` (BIGINT, PK)
- `owner_id` (BIGINT, FK -> users.id)
- `fund_id` (BIGINT, FK -> funds.id)
- `title` (VARCHAR(255))
- `description` (TEXT)
- `category` (VARCHAR(100))
- `goal_amount` (NUMERIC(10,2))
- `collected_amount` (NUMERIC(10,2))
- `currency` (VARCHAR(3))
- `banner_url` (VARCHAR(512))
- `start_date` (TIMESTAMP)
- `end_date` (TIMESTAMP)
- `status` (ENUM: draft, pending, active, completed, expired, rejected, cancelled)
- `moderated_by` (BIGINT, FK -> users.id, nullable)
- `moderated_at` (TIMESTAMP, nullable)
- `rejection_reason` (TEXT, nullable)
- `participants_count` (BIGINT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### zakat_calculations
Расчеты закята

- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK -> users.id)
- `payload_json` (JSONB)
- `total_wealth` (NUMERIC(10,2))
- `nisab_value` (NUMERIC(10,2))
- `zakat_due` (NUMERIC(10,2))
- `donation_id` (BIGINT, FK -> donations.id, nullable)
- `created_at` (TIMESTAMP)

### reports
Отчеты фондов

- `id` (BIGINT, PK)
- `fund_id` (BIGINT, FK -> funds.id)
- `period_start` (TIMESTAMP)
- `period_end` (TIMESTAMP)
- `title` (VARCHAR(255))
- `description` (VARCHAR(1000))
- `file_url` (VARCHAR(512))
- `verified` (BOOLEAN)
- `verified_by` (BIGINT, FK -> users.id, nullable)
- `verified_at` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Индексы

- `users.tg_id` - UNIQUE INDEX
- `donations.user_id` - INDEX
- `donations.fund_id` - INDEX
- `donations.campaign_id` - INDEX
- `donations.status` - INDEX
- `subscriptions.user_id` - INDEX
- `subscriptions.status` - INDEX
- `campaigns.status` - INDEX
- `campaigns.fund_id` - INDEX
- `zakat_calculations.user_id` - INDEX

