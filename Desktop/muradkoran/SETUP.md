# Инструкция по настройке Telegram бота

## 1. Создание бота в Telegram

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен (например: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 2. Настройка Web App

1. В BotFather отправьте команду `/newapp`
2. Выберите вашего бота
3. Укажите название приложения: `Quran Reader`
4. Укажите описание: `Чтение Священного Корана`
5. Загрузите иконку (или пропустите)
6. Укажите URL веб-приложения: `https://quran-reader-telegram.vercel.app`

## 3. Настройка переменных окружения

В Vercel добавьте следующие переменные окружения:

```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_WEB_APP_URL=https://quran-reader-telegram.vercel.app
```

## 4. Настройка Webhook

После развертывания на Vercel, установите webhook:

```bash
# Замените YOUR_TOKEN на токен бота
# Замените YOUR_URL на URL вашего приложения на Vercel
curl "https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://YOUR_URL/api/telegram/webhook"
```

Или через браузер:
```
https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://YOUR_URL/api/telegram/webhook
```

Или через API вашего приложения:
```
GET https://YOUR_URL/api/telegram/webhook?action=set-webhook&url=https://YOUR_URL/api/telegram/webhook
```

## 5. Проверка webhook

Проверьте статус webhook:

```
GET https://YOUR_URL/api/telegram/webhook?action=get-webhook-info
```

## 6. Тестирование

1. Найдите вашего бота в Telegram
2. Отправьте команду `/start`
3. Проверьте работу всех команд и кнопок
4. Откройте веб-приложение через кнопку в боте

## Команды бота

- `/start` - Главное меню
- `/surah [номер]` - Открыть суру (1-114)
- `/search [запрос]` - Поиск по Корану
- `/bookmarks` - Мои закладки
- `/help` - Справка

## Возможные проблемы

### Webhook не работает

1. Убедитесь, что URL доступен из интернета (Vercel автоматически это обеспечивает)
2. Проверьте, что токен бота правильный
3. Проверьте логи в Vercel

### Бот не отвечает

1. Проверьте, что webhook установлен
2. Проверьте переменные окружения
3. Посмотрите логи в консоли Vercel

### Web App не открывается

1. Убедитесь, что URL указан правильно в BotFather
2. Проверьте, что приложение развернуто на HTTPS
3. Убедитесь, что домен добавлен в настройках бота

