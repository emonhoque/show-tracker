import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { getArtist, mapSpotifyArtistToArtist, isSpotifyConfigured } from '@/lib/spotify'

export async function GET() {
  try {
    const { data: artists, error } = await supabase
      .from('artists')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching artists:', error)
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 })
    }

    return NextResponse.json(artists)
  } catch (error) {
    console.error('Error in GET /api/artists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSpotifyConfigured) {
      return NextResponse.json({ 
        error: 'Spotify API not configured',
        message: 'Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your environment variables to use this feature.'
      }, { status: 503 })
    }

    const { spotifyId, createdBy } = await request.json()

    if (!spotifyId) {
      return NextResponse.json({ error: 'Spotify ID is required' }, { status: 400 })
    }

    // Check if artist already exists
    const { data: existingArtist } = await supabase
      .from('artists')
      .select('*')
      .eq('spotify_id', spotifyId)
      .single()

    if (existingArtist) {
      return NextResponse.json(existingArtist)
    }

    // Fetch artist data from Spotify
    const spotifyArtist = await getArtist(spotifyId)
    
    if (!spotifyArtist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Map and insert artist
    const artistData = mapSpotifyArtistToArtist(spotifyArtist, createdBy)
    
    const { data: newArtist, error } = await supabase
      .from('artists')
      .insert(artistData)
      .select()
      .single()

    if (error) {
      console.error('Error creating artist:', error)
      return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 })
    }

    return NextResponse.json(newArtist)
  } catch (error) {
    console.error('Error in POST /api/artists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
