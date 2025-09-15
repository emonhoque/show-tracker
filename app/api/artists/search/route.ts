import { NextRequest, NextResponse } from 'next/server'
import { searchArtists, isSpotifyConfigured } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    if (!isSpotifyConfigured) {
      return NextResponse.json({ 
        error: 'Spotify API not configured',
        message: 'Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your environment variables to use this feature.'
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const artists = await searchArtists(query, limit)
    return NextResponse.json(artists)
  } catch (error) {
    console.error('Error in GET /api/artists/search:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
