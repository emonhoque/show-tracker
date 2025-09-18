import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { getArtistAlbums, mapSpotifyReleaseToRelease, isSpotifyConfigured } from '@/lib/spotify'

async function fetchReleasesForAllArtists() {
  try {
    if (!isSpotifyConfigured) {
      return NextResponse.json({ 
        error: 'Spotify API not configured',
        message: 'Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your environment variables to use this feature.'
      }, { status: 503 })
    }

    // Get all active artists
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('*')
      .eq('is_active', true)

    if (artistsError) {
      console.error('Error fetching artists:', artistsError)
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 })
    }

    if (!artists || artists.length === 0) {
      return NextResponse.json({ message: 'No artists found' })
    }

    let totalNewReleases = 0
    const results = []

    // Check each artist for new releases
    for (const artist of artists) {
      try {
        
        // Fetch latest albums from Spotify
        const spotifyReleases = await getArtistAlbums(artist.spotify_id, 50)

        // Filter for recent releases (last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const recentReleases = spotifyReleases.filter(release => {
          const releaseDate = new Date(release.release_date)
          return releaseDate >= sixMonthsAgo
        })

        if (recentReleases.length > 0) {
          // Map and insert releases
          const releasesToInsert = recentReleases.map(release => 
            mapSpotifyReleaseToRelease(release, artist.id)
          )

          const { data: newReleases, error: insertError } = await supabase
            .from('releases')
            .upsert(releasesToInsert, { 
              onConflict: 'spotify_id',
              ignoreDuplicates: false 
            })
            .select()

          if (insertError) {
            console.error(`Error inserting releases for ${artist.artist_name}:`, insertError)
            results.push({
              artist: artist.artist_name,
              status: 'error',
              error: insertError.message
            })
          } else {
            totalNewReleases += newReleases.length
            results.push({
              artist: artist.artist_name,
              status: 'success',
              newReleases: newReleases.length
            })
          }
        } else {
          results.push({
            artist: artist.artist_name,
            status: 'no_new_releases',
            newReleases: 0
          })
        }

        // Update artist's last_checked timestamp
        await supabase
          .from('artists')
          .update({ last_checked: new Date().toISOString() })
          .eq('id', artist.id)

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`Error checking releases for ${artist.artist_name}:`, error)
        results.push({
          artist: artist.artist_name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: `Checked ${artists.length} artists, found ${totalNewReleases} new releases`,
      totalArtists: artists.length,
      totalNewReleases,
      results
    })

  } catch (error) {
    console.error('Error in fetchReleasesForAllArtists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const days = parseInt(searchParams.get('days') || '30')
    const weeks = parseInt(searchParams.get('weeks') || '0')
    const offset = (page - 1) * limit

    // Get releases from the last N days or weeks
    const cutoffDate = new Date()
    if (weeks > 0) {
      cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7))
    } else {
      cutoffDate.setDate(cutoffDate.getDate() - days)
    }

    const { data: releases, error, count } = await supabase
      .from('releases')
      .select('*', { count: 'exact' })
      .gte('release_date', cutoffDate.toISOString().split('T')[0])
      .order('release_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching releases:', error)
      return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 })
    }

    const totalPages = Math.ceil((count || 0) / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      releases,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext,
        hasPrev
      }
    })
  } catch (error) {
    console.error('Error in GET /api/releases:', error)
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

    const { artistId } = await request.json()

    // If no artistId provided, fetch releases for all artists
    if (!artistId) {
      return await fetchReleasesForAllArtists()
    }

    // Get artist from database
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .single()

    if (artistError || !artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Fetch latest albums from Spotify
    const spotifyReleases = await getArtistAlbums(artist.spotify_id, 50)

    // Filter for recent releases (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentReleases = spotifyReleases.filter(release => {
      const releaseDate = new Date(release.release_date)
      return releaseDate >= sixMonthsAgo
    })

    // Map and insert releases
    const releasesToInsert = recentReleases.map(release => 
      mapSpotifyReleaseToRelease(release, artistId)
    )

    if (releasesToInsert.length === 0) {
      return NextResponse.json({ message: 'No recent releases found' })
    }

    const { data: newReleases, error: insertError } = await supabase
      .from('releases')
      .upsert(releasesToInsert, { 
        onConflict: 'spotify_id',
        ignoreDuplicates: false 
      })
      .select()

    if (insertError) {
      console.error('Error inserting releases:', insertError)
      return NextResponse.json({ error: 'Failed to insert releases' }, { status: 500 })
    }

    // Update artist's last_checked timestamp
    await supabase
      .from('artists')
      .update({ last_checked: new Date().toISOString() })
      .eq('id', artistId)

    return NextResponse.json({ 
      message: `Found ${newReleases.length} recent releases`,
      releases: newReleases 
    })
  } catch (error) {
    console.error('Error in POST /api/releases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
