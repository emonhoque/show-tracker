import { NextRequest, NextResponse } from 'next/server'
import { getPastShowsPaginated } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Return mock data instead of database query
    const result = getPastShowsPaginated(page, limit)
    
    const response = NextResponse.json(result)
    
    // Add caching with revalidation for past shows
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    response.headers.set('ETag', `"past-shows-${Math.floor(Date.now() / 60000)}"`)
    
    return response
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
