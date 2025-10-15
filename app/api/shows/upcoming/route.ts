import { NextResponse } from 'next/server'
import { getUpcomingShowsWithRSVPs } from '@/lib/mockData'

export async function GET() {
  try {
    // Return mock data instead of database query
    const upcomingShows = getUpcomingShowsWithRSVPs()
    
    const response = NextResponse.json(upcomingShows)
    
    // No caching for upcoming shows to ensure real-time updates
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    return response
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
