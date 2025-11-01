# Инструкция по развертыванию

## Требования

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Telegram Bot Token

## Backend

### 1. Установка зависимостей

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните необходимые переменные:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `TELEGRAM_BOT_TOKEN` - токен бота от @BotFather
- `TELEGRAM_SECRET_KEY` - секретный ключ для валидации initData
- Ключи платежных систем

### 3. Создание базы данных

```bash
createdb sadakadb
```

### 4. Применение миграций

```bash
alembic upgrade head
```

### 5. Запуск сервера

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend

### 1. Установка зависимостей

```bash
cd frontend
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env`:

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

Для продакшена укажите URL вашего API.

### 3. Сборка

```bash
npm run build
```

### 4. Запуск dev-сервера

```bash
npm run dev
```

## Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Получите токен
3. Настройте Web App:
   ```
   /newapp
   ```
   Укажите URL вашего фронтенда

## Развертывание в продакшене

### Backend

1. Используйте процесс-менеджер (PM2, systemd):
   ```bash
   pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name sadak-backend
   ```

2. Настройте Nginx как reverse proxy
3. Настройте SSL через Let's Encrypt
4. Используйте PostgreSQL на отдельном сервере

### Frontend

1. Соберите статические файлы:
   ```bash
   npm run build
   ```

2. Разместите папку `dist` на веб-сервере (Nginx)
3. Настройте роутинг для SPA

### Настройка вебхуков платежных систем

1. YooKassa:
   - URL: `https://your-domain.com/api/v1/payments/webhook/yookassa`
   - Метод: POST

2. CloudPayments:
   - URL: `https://your-domain.com/api/v1/payments/webhook/cloudpayments`
   - Метод: POST

