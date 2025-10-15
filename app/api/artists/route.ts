import { NextResponse } from 'next/server'
import { mockData } from '@/lib/mockData'

export async function GET() {
  try {
    // Return mock data instead of database query
    return NextResponse.json(mockData.artists)
  } catch (error) {
    console.error('Error in GET /api/artists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Demo mode - return mock success response
    return NextResponse.json({ 
      message: 'Demo mode: Artist would be added in production',
      demo: true
    })
  } catch (error) {
    console.error('Error in POST /api/artists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
