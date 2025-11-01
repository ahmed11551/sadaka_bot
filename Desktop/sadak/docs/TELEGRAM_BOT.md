# Настройка Telegram Bot и Inline-режима

## Создание бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен в переменную окружения `TELEGRAM_BOT_TOKEN`

## Настройка Mini App

1. В [@BotFather](https://t.me/BotFather) отправьте:
   ```
   /newapp
   ```
2. Выберите вашего бота
3. Укажите название приложения
4. Укажите URL вашего фронтенда (например: `https://your-domain.com`)
5. Загрузите иконку приложения (512x512 PNG)

## Inline-команды

Для реализации быстрого доступа к разделам через команды бота:

### Примеры команд:

```
/sadaqa - Открывает вкладку "Пожертвовать"
/support - Быстрые донаты
/zakat - Калькулятор закята
/campaigns - Список кампаний
/partners - Каталог фондов
```

### Реализация (опционально)

Создайте файл `backend/app/bot/bot.py`:

```python
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from app.core.config import settings

async def sadaqa_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /sadaqa"""
    web_app_url = "https://your-domain.com/?tab=donate"
    await update.message.reply_text(
        "Перейти к пожертвованиям",
        reply_markup=InlineKeyboardMarkup([[
            InlineKeyboardButton("Открыть приложение", web_app=WebAppInfo(url=web_app_url))
        ]])
    )

def setup_bot():
    """Настройка бота"""
    application = Application.builder().token(settings.TELEGRAM_BOT_TOKEN).build()
    
    application.add_handler(CommandHandler("sadaqa", sadaqa_command))
    application.add_handler(CommandHandler("support", support_command))
    application.add_handler(CommandHandler("zakat", zakat_command))
    application.add_handler(CommandHandler("campaigns", campaigns_command))
    application.add_handler(CommandHandler("partners", partners_command))
    
    return application
```

## Callback Data для кнопок

Примеры формата callback_data для навигации:

```
donate:fund=1;sum=500
sub:plan=premium;period=P12M
campaign:view=123
```

Парсинг на фронтенде:

```typescript
const parseCallbackData = (data: string) => {
  const parts = data.split(':')
  const action = parts[0]
  const params = parts[1]?.split(';').reduce((acc, param) => {
    const [key, value] = param.split('=')
    acc[key] = value
    return acc
  }, {})
  return { action, params }
}
```

## Валидация initData

Секретный ключ для валидации initData получается через:
```
Telegram WebApp → Bot Settings → Advanced → Secret Key
```

Сохраните его в переменную окружения `TELEGRAM_SECRET_KEY`.

