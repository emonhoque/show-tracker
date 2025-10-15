import { NextRequest, NextResponse } from 'next/server'
import { mockArtists } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // Demo mode - filter mock artists by search query
    const filteredArtists = mockArtists.filter(artist =>
      artist.artist_name.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({
      artists: filteredArtists.map(artist => ({
        id: artist.spotify_id,
        name: artist.artist_name,
        image_url: artist.image_url,
        genres: artist.genres,
        popularity: 75
      })),
      demo: true
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}