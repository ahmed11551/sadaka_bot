import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`
const WEB_APP_URL = process.env.TELEGRAM_WEB_APP_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://quran-reader-telegram.vercel.app')

interface TelegramMessage {
  message_id: number
  from: {
    id: number
    first_name: string
    username?: string
  }
  chat: {
    id: number
    type: string
  }
  text?: string
  data?: string
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: {
    id: string
    from: {
      id: number
      first_name: string
      username?: string
    }
    message?: TelegramMessage
    data: string
  }
}

// Отправка сообщения в Telegram
async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error sending message:', error)
    return null
  }
}

// Отправка ответа на callback query
async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || 'Обработано',
        show_alert: false,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error answering callback:', error)
    return null
  }
}

// Обработка команды /start
function handleStart(chatId: number, userName: string) {
  const text = `🕌 Ассаламу алейкум, ${userName}!

Добро пожаловать в бота для чтения Священного Корана!

📖 <b>Доступные команды:</b>
/start - Начать работу
/surah [номер] - Открыть суру (например: /surah 1)
/search [запрос] - Поиск по Корану
/bookmarks - Мои закладки
/help - Помощь

🌐 <b>Веб-приложение:</b>
Откройте веб-приложение для полного функционала чтения Корана с красивым интерфейсом!`

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '📖 Открыть веб-приложение',
          web_app: { url: WEB_APP_URL }
        }
      ],
      [
        { text: '📋 Список сур', callback_data: 'list_surahs' },
        { text: '🔍 Поиск', callback_data: 'search' }
      ],
      [
        { text: '🔖 Закладки', callback_data: 'bookmarks' },
        { text: 'ℹ️ Помощь', callback_data: 'help' }
      ]
    ]
  }

  return sendMessage(chatId, text, keyboard)
}

// Обработка команды /surah
async function handleSurah(chatId: number, surahNumber: number) {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
    const data = await response.json()
    
    if (data.code === 200 && data.data) {
      const surah = data.data
      const firstAyah = surah.ayahs[0]
      
      const text = `📖 <b>Сура ${surah.number}: ${surah.englishName}</b>
      
<b>${surah.name}</b>
${surah.numberOfAyahs} аятов

<b>Первый аят:</b>
${firstAyah?.text?.substring(0, 200)}...`

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: `📖 Читать суру ${surah.number}`,
              web_app: { url: `${WEB_APP_URL}?surah=${surahNumber}` }
            }
          ],
          [
            { text: '◀️ Предыдущая', callback_data: `surah_${Math.max(1, surahNumber - 1)}` },
            { text: '▶️ Следующая', callback_data: `surah_${Math.min(114, surahNumber + 1)}` }
          ],
          [
            { text: '🔙 Главное меню', callback_data: 'main_menu' }
          ]
        ]
      }

      return sendMessage(chatId, text, keyboard)
    } else {
      return sendMessage(chatId, '❌ Сура не найдена. Используйте номер от 1 до 114.')
    }
  } catch (error) {
    console.error('Error fetching surah:', error)
    return sendMessage(chatId, '❌ Ошибка при загрузке суры. Попробуйте позже.')
  }
}

// Обработка команды /help
function handleHelp(chatId: number) {
  const text = `ℹ️ <b>Помощь</b>

<b>Команды бота:</b>
• /start - Главное меню
• /surah [1-114] - Открыть суру по номеру
• /search [запрос] - Поиск по Корану
• /bookmarks - Ваши закладки
• /help - Эта справка

<b>Веб-приложение:</b>
Нажмите на кнопку "Открыть веб-приложение" для доступа к полному функционалу:
• 📖 Чтение всех 114 сур
• 🔍 Расширенный поиск
• 🔖 Система закладок
• 🌙 Темная тема
• 📱 Адаптивный интерфейс

<b>Поддержка:</b>
Если у вас есть вопросы или предложения, напишите разработчику.`

  return sendMessage(chatId, text)
}

// Обработка callback query
async function handleCallbackQuery(update: TelegramUpdate) {
  if (!update.callback_query) return

  const callbackQuery = update.callback_query
  const chatId = callbackQuery.message?.chat.id || callbackQuery.from.id
  const data = callbackQuery.data
  const queryId = callbackQuery.id

  // Отвечаем на callback
  await answerCallbackQuery(queryId)

  if (data === 'main_menu') {
    return handleStart(chatId, callbackQuery.from.first_name)
  }

  if (data === 'help') {
    return handleHelp(chatId)
  }

  if (data === 'list_surahs') {
    const text = `📋 <b>Список сур</b>

Используйте команду /surah [номер] для открытия суры.
Например: /surah 1

Или откройте веб-приложение для полного списка всех 114 сур!`

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '📖 Открыть веб-приложение',
            web_app: { url: `${WEB_APP_URL}?view=surahs` }
          }
        ],
        [
          { text: '🔙 Главное меню', callback_data: 'main_menu' }
        ]
      ]
    }

    return sendMessage(chatId, text, keyboard)
  }

  if (data === 'search') {
    const text = `🔍 <b>Поиск по Корану</b>

Используйте команду /search [запрос] для поиска.

Например:
/search бисмиллах
/search милость

Или откройте веб-приложение для расширенного поиска!`

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '📖 Открыть веб-приложение',
            web_app: { url: `${WEB_APP_URL}?view=search` }
          }
        ],
        [
          { text: '🔙 Главное меню', callback_data: 'main_menu' }
        ]
      ]
    }

    return sendMessage(chatId, text, keyboard)
  }

  if (data === 'bookmarks') {
    const text = `🔖 <b>Закладки</b>

Ваши сохраненные аяты доступны в веб-приложении.
Откройте приложение для просмотра закладок.`

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '📖 Открыть веб-приложение',
            web_app: { url: `${WEB_APP_URL}?view=bookmarks` }
          }
        ],
        [
          { text: '🔙 Главное меню', callback_data: 'main_menu' }
        ]
      ]
    }

    return sendMessage(chatId, text, keyboard)
  }

  if (data?.startsWith('surah_')) {
    const surahNumber = parseInt(data.replace('surah_', ''))
    if (!isNaN(surahNumber) && surahNumber >= 1 && surahNumber <= 114) {
      return handleSurah(chatId, surahNumber)
    }
  }
}

export async function POST(request: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'TELEGRAM_BOT_TOKEN not configured' },
      { status: 500 }
    )
  }

  try {
    const update: TelegramUpdate = await request.json()

    // Обработка callback query (inline кнопки)
    if (update.callback_query) {
      await handleCallbackQuery(update)
      return NextResponse.json({ ok: true })
    }

    // Обработка сообщений
    if (update.message) {
      const message = update.message
      const chatId = message.chat.id
      const text = message.text || ''
      const userName = message.from.first_name

      // Команда /start
      if (text.startsWith('/start')) {
        await handleStart(chatId, userName)
        return NextResponse.json({ ok: true })
      }

      // Команда /help
      if (text.startsWith('/help')) {
        await handleHelp(chatId)
        return NextResponse.json({ ok: true })
      }

      // Команда /surah [номер]
      if (text.startsWith('/surah')) {
        const match = text.match(/\/surah\s+(\d+)/)
        if (match) {
          const surahNumber = parseInt(match[1])
          if (surahNumber >= 1 && surahNumber <= 114) {
            await handleSurah(chatId, surahNumber)
          } else {
            await sendMessage(chatId, '❌ Номер суры должен быть от 1 до 114.')
          }
        } else {
          await sendMessage(chatId, '❌ Используйте: /surah [номер]\nНапример: /surah 1')
        }
        return NextResponse.json({ ok: true })
      }

      // Команда /search
      if (text.startsWith('/search')) {
        const searchQuery = text.replace('/search', '').trim()
        if (searchQuery) {
          const keyboard = {
            inline_keyboard: [
              [
                {
                  text: '🔍 Открыть поиск в веб-приложении',
                  web_app: { url: `${WEB_APP_URL}?search=${encodeURIComponent(searchQuery)}` }
                }
              ],
              [
                { text: '🔙 Главное меню', callback_data: 'main_menu' }
              ]
            ]
          }
          await sendMessage(
            chatId,
            `🔍 Поиск: "${searchQuery}"\n\nОткройте веб-приложение для просмотра результатов.`,
            keyboard
          )
        } else {
          await sendMessage(chatId, '❌ Используйте: /search [запрос]\nНапример: /search бисмиллах')
        }
        return NextResponse.json({ ok: true })
      }

      // Команда /bookmarks
      if (text.startsWith('/bookmarks')) {
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: '📖 Открыть закладки',
                web_app: { url: `${WEB_APP_URL}?view=bookmarks` }
              }
            ],
            [
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
        }
        await sendMessage(chatId, '🔖 Ваши закладки доступны в веб-приложении.', keyboard)
        return NextResponse.json({ ok: true })
      }

      // Неизвестная команда
      if (text.startsWith('/')) {
        await sendMessage(chatId, `❌ Неизвестная команда. Используйте /help для справки.`)
        return NextResponse.json({ ok: true })
      }

      // Любое другое сообщение
      await handleStart(chatId, userName)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Установка webhook (для настройки)
export async function GET(request: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'TELEGRAM_BOT_TOKEN not configured' },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  if (action === 'set-webhook') {
    const webhookUrl = searchParams.get('url') || `${WEB_APP_URL}/api/telegram/webhook`
    
    try {
      const response = await fetch(
        `${TELEGRAM_API_URL}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
      )
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to set webhook' }, { status: 500 })
    }
  }

  if (action === 'get-webhook-info') {
    try {
      const response = await fetch(`${TELEGRAM_API_URL}/getWebhookInfo`)
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to get webhook info' }, { status: 500 })
    }
  }

  return NextResponse.json({
    message: 'Telegram Webhook API',
    endpoints: {
      'POST /api/telegram/webhook': 'Receive webhook updates',
      'GET /api/telegram/webhook?action=set-webhook&url=...': 'Set webhook URL',
      'GET /api/telegram/webhook?action=get-webhook-info': 'Get webhook info'
    }
  })
}

