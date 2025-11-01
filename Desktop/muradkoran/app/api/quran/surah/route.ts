import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const surahNumber = searchParams.get('number')
    
    if (surahNumber) {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const response = await fetch('https://api.alquran.cloud/v1/surah')
      const data = await response.json()
      return NextResponse.json(data)
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}

