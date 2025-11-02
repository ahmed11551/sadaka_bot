# Инструкция по деплою в Vercel

## Быстрый деплой

### 1. Если проект уже подключен к Vercel:

Просто сделайте commit и push изменений:

```bash
git add .
git commit -m "Обновлен дизайн в стиле Telegram Wallet"
git push
```

Vercel автоматически задеплоит изменения!

### 2. Если проект еще не подключен к Vercel:

1. **Войдите в Vercel:**
   - Перейдите на https://vercel.com
   - Войдите через GitHub/GitLab/Bitbucket

2. **Импортируйте проект:**
   - Нажмите "Add New Project"
   - Выберите репозиторий `sadak`
   - Vercel автоматически определит настройки из `vercel.json`

3. **Настройте переменные окружения:**
   - В настройках проекта добавьте переменную:
     - `VITE_API_URL` = `https://your-backend-url.com/api/v1`
     - (Замените на реальный URL вашего бэкенда)

4. **Root Directory:**
   - Убедитесь что Root Directory установлен в `frontend/`
   - Или используйте корневой `vercel.json` который указывает на `frontend/`

5. **Деплой:**
   - Нажмите "Deploy"
   - Vercel соберет проект и задеплоит

### 3. Через Vercel CLI:

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите
vercel login

# Задеплойте
cd frontend
vercel --prod
```

## Важные настройки

### Переменные окружения в Vercel:

Добавьте в настройках проекта:
- `VITE_API_URL` = URL вашего бэкенда (например: `https://api.sadak.com/api/v1`)

### Проверка конфигурации:

Проект уже настроен:
- ✅ `vercel.json` в корне и в `frontend/`
- ✅ Правильные build команды
- ✅ Настроен SPA routing (rewrites)

## После деплоя

1. Проверьте что приложение работает
2. Убедитесь что API запросы идут на правильный backend
3. Проверьте работу в Telegram WebApp

## Автоматический деплой

После подключения к Git, каждый push в `main`/`master` ветку будет автоматически триггерить деплой.

