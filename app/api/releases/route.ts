import { NextRequest, NextResponse } from 'next/server'
import { getReleasesPaginated } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')

    // Return mock data instead of database query
    const result = getReleasesPaginated(page, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/releases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Demo mode - return mock success response
    return NextResponse.json({
      message: 'Demo mode: Would check for new releases in production',
      demo: true
    })
  } catch (error) {
    console.error('Error in POST /api/releases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
