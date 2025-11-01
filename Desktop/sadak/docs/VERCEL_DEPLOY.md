# Деплой на Vercel

## Быстрый деплой

### 1. Подготовка

1. Убедитесь что проект собирается локально:
```bash
cd frontend
npm run build
```

2. Проверьте что `dist/` папка создана с файлами

### 2. Деплой через Vercel CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Деплой
cd frontend
vercel
```

### 3. Деплой через GitHub

1. Создайте репозиторий на GitHub
2. Загрузите код:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/sadak.git
git push -u origin main
```

3. Зайдите на https://vercel.com
4. Нажмите "New Project"
5. Импортируйте репозиторий
6. Настройки:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

7. Добавьте переменные окружения:
   - `VITE_API_URL` - URL вашего API (например: `https://api.yourdomain.com/api/v1`)

8. Нажмите "Deploy"

### 4. Настройка домена

После деплоя:
1. Перейдите в Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи как указано в Vercel

## Настройка API для продакшена

Backend нужно деплоить отдельно (на Railway, Render, или другом хостинге).

После деплоя backend:
1. Обновите `VITE_API_URL` в настройках Vercel
2. Пересоберите проект

## Переменные окружения для Vercel

В настройках проекта Vercel добавьте:

- `VITE_API_URL` - URL вашего API backend

Пример:
```
VITE_API_URL=https://sadak-api.railway.app/api/v1
```

## Роутинг (SPA)

Vercel автоматически настроит роутинг для SPA через `vercel.json`.

Если роутинг не работает:
1. Убедитесь что `vercel.json` в папке `frontend/`
2. Проверьте что все маршруты ведут на `index.html`

## Проверка после деплоя

1. Откройте деплой URL
2. Проверьте что все страницы работают
3. Проверьте что API запросы идут на правильный URL
4. Проверьте консоль браузера на ошибки

## Автоматический деплой

Vercel автоматически деплоит при каждом push в main ветку.

Для других веток создаются preview деплои.

