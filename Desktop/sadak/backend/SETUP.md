# Инструкция по настройке Backend

## Шаг 1: Установка Python

Убедитесь, что у вас установлен Python 3.11 или выше.

Проверка:
```powershell
py --version
# или
python --version
```

## Шаг 2: Создание виртуального окружения

```powershell
cd backend
py -m venv venv
```

## Шаг 3: Активация виртуального окружения

Windows PowerShell:
```powershell
.\venv\Scripts\Activate.ps1
```

Windows CMD:
```cmd
venv\Scripts\activate.bat
```

## Шаг 4: Установка зависимостей

```powershell
pip install -r requirements.txt
```

## Шаг 5: Настройка базы данных

### Установка PostgreSQL

Если PostgreSQL не установлен:
1. Скачайте с https://www.postgresql.org/download/windows/
2. Установите и запомните пароль пользователя postgres

### Создание базы данных

Откройте pgAdmin или используйте psql:
```sql
CREATE DATABASE sadakadb;
```

### Настройка DATABASE_URL в .env

Отредактируйте `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:ваш_пароль@localhost:5432/sadakadb
```

## Шаг 6: Создание первой миграции

```powershell
# Убедитесь что виртуальное окружение активно
alembic revision --autogenerate -m "Initial migration"
```

## Шаг 7: Применение миграций

```powershell
alembic upgrade head
```

## Шаг 8: Настройка Telegram Bot (опционально для начала)

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен
3. Добавьте в `backend/.env`:
```env
TELEGRAM_BOT_TOKEN=ваш_токен
TELEGRAM_SECRET_KEY=ваш_секретный_ключ
```

Примечание: Для начала разработки можно оставить пустыми - валидация будет пропущена.

## Шаг 9: Запуск сервера

```powershell
uvicorn app.main:app --reload
```

Сервер будет доступен на http://localhost:8000
API документация: http://localhost:8000/docs

## Устранение проблем

### Ошибка при активации venv

Если появляется ошибка о политике выполнения скриптов:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Ошибка подключения к БД

Проверьте:
- Запущен ли PostgreSQL сервис
- Правильность DATABASE_URL в .env
- Доступность базы данных

### Ошибки импорта

Убедитесь что виртуальное окружение активно и все зависимости установлены.

