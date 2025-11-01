# Проверка деплоя на Vercel

## Статус проекта

**Vercel Project ID:** `prj_GbuvGvl80hKzmiLa0Nb9eYUQzm4l`  
**GitHub Repository:** `https://github.com/ahmed11551/sadaka_bot.git`  
**Последний коммит:** `e2b9502 - Add Telegram Wallet style bottom navigation and improve UI transitions`  
**Статус Git:** Все изменения закоммичены и запушены в `origin/main`

## Что проверить в Vercel Dashboard

### 1. Статус деплоя
- Откройте [Vercel Dashboard](https://vercel.com/dashboard)
- Найдите проект с ID `prj_GbuvGvl80hKzmiLa0Nb9eYUQzm4l`
- Проверьте, что последний деплой успешно завершен
- Если есть ошибки, проверьте логи сборки

### 2. Переменные окружения
Убедитесь, что в настройках проекта установлены:

```
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
TELEGRAM_WEB_APP_URL=https://quran-reader-telegram.vercel.app
```

**Как проверить:**
1. Откройте проект в Vercel Dashboard
2. Перейдите в **Settings** → **Environment Variables**
3. Проверьте наличие обеих переменных

### 3. Настройки сборки
Проверьте, что в настройках проекта указаны:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (по умолчанию)
- **Output Directory:** `.next` (по умолчанию)
- **Install Command:** `npm install` (по умолчанию)
- **Root Directory:** `.` (или папка с проектом, если в монорепо)

### 4. Автоматический деплой
- Убедитесь, что включен **Auto-deploy** из ветки `main`
- При каждом push в `main` Vercel должен автоматически развертывать проект

## Принудительный редеплой

Если нужно принудительно запустить деплой:

### Вариант 1: Через Vercel Dashboard
1. Откройте проект в Vercel Dashboard
2. Перейдите на вкладку **Deployments**
3. Найдите последний деплой
4. Нажмите **•••** → **Redeploy**

### Вариант 2: Через Git (рекомендуется)
Создайте пустой коммит и запушьте:

```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

## Проверка работы приложения

После успешного деплоя проверьте:

1. **Главная страница:** https://quran-reader-telegram.vercel.app
2. **API Webhook:** 
   ```
   GET https://quran-reader-telegram.vercel.app/api/telegram/webhook?action=get-webhook-info
   ```
3. **Quran API:**
   ```
   GET https://quran-reader-telegram.vercel.app/api/quran/surah?number=1
   ```

## Установка Webhook для Telegram бота

После успешного деплоя установите webhook:

```bash
# Замените YOUR_TOKEN на токен бота
curl "https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://quran-reader-telegram.vercel.app/api/telegram/webhook"
```

Или через браузер:
```
https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://quran-reader-telegram.vercel.app/api/telegram/webhook
```

Или через API приложения:
```
GET https://quran-reader-telegram.vercel.app/api/telegram/webhook?action=set-webhook&url=https://quran-reader-telegram.vercel.app/api/telegram/webhook
```

## Типичные проблемы

### Ошибка сборки
- Проверьте логи деплоя в Vercel Dashboard
- Убедитесь, что все зависимости указаны в `package.json`
- Проверьте, что TypeScript компилируется без ошибок

### Переменные окружения не работают
- Убедитесь, что переменные добавлены для нужных окружений (Production, Preview, Development)
- После добавления переменных может потребоваться редеплой

### Webhook не работает
- Проверьте, что `TELEGRAM_BOT_TOKEN` правильно установлен
- Убедитесь, что URL webhook правильный
- Проверьте логи в Vercel → Functions

## Контакты и поддержка

Если возникли проблемы:
1. Проверьте логи в Vercel Dashboard
2. Проверьте логи в Telegram Bot API
3. Убедитесь, что все переменные окружения установлены
4. Проверьте, что webhook установлен корректно

