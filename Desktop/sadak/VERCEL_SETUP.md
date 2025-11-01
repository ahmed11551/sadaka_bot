# Настройка деплоя на Vercel

## Автоматическая настройка (рекомендуется)

1. Перейдите на [Vercel Dashboard](https://vercel.com/dashboard)
2. Импортируйте ваш репозиторий `sadaka_bot`
3. **Важно!** В настройках проекта установите:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` (или оставьте по умолчанию)
   - **Output Directory**: `dist`

4. Добавьте переменные окружения (если нужно):
   - `VITE_API_URL` - URL вашего API

5. Нажмите Deploy

## Альтернативный способ (если Root Directory не работает)

Если автоматическая настройка не работает, используйте следующие шаги:

1. В Vercel Dashboard выберите ваш проект
2. Перейдите в Settings → General
3. В разделе "Root Directory" укажите: `frontend`
4. Перейдите в Settings → Environment Variables
5. Добавьте необходимые переменные окружения
6. Перейдите в Deployments и создайте новый деплой

## Проверка после деплоя

После успешного деплоя ваше приложение должно быть доступно по адресу:
`https://sadaka-bot.vercel.app`

Если вы видите ошибку 404:
- Проверьте, что Root Directory установлен в `frontend`
- Убедитесь, что `frontend/vercel.json` существует
- Проверьте, что build команда завершилась успешно в логах деплоя

## Структура проекта для Vercel

```
.
├── frontend/          ← Root Directory должен быть здесь
│   ├── dist/         ← Output Directory (создается после build)
│   ├── vercel.json   ← Конфигурация Vercel
│   ├── package.json
│   └── ...
└── backend/          ← Backend деплоится отдельно
```

