import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Обработка вебхуков от Telegram
    // Здесь можно добавить логику для обработки сообщений от Telegram бота
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Telegram API endpoint',
    status: 'active'
  })
}

