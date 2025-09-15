import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { getArtistAlbums, mapSpotifyReleaseToRelease } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job (optional security check)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ message: 'No artists to check' })
    }

    let totalNewReleases = 0
    const results = []

    // Check each artist for new releases
    for (const artist of artists) {
      try {
        console.log(`Checking releases for ${artist.artist_name}...`)
        
        // Fetch latest albums from Spotify
        const spotifyReleases = await getArtistAlbums(artist.spotify_id, 50)

        // Filter for recent releases (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentReleases = spotifyReleases.filter(release => {
          const releaseDate = new Date(release.release_date)
          return releaseDate >= thirtyDaysAgo
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
    console.error('Error in cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
