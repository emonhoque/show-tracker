import { NextRequest, NextResponse } from 'next/server'
import { searchArtists, isSpotifyConfigured } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // Check if Spotify is configured
    if (!isSpotifyConfigured) {
      return NextResponse.json({ 
        error: 'Spotify API not configured. Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your environment variables.' 
      }, { status: 500 })
    }

    // Search for artists using the existing function
    const artists = await searchArtists(query, 10)
    
    return NextResponse.json({
      artists: artists || []
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}