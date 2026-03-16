import { SpotifyArtist, SpotifyRelease } from './types'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

// Check if Spotify API credentials are available
export const isSpotifyConfigured = !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET)

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  if (!isSpotifyConfigured) {
    throw new Error('Spotify API credentials not configured')
  }

  // Check if we have a valid token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error(`Failed to get Spotify access token: ${response.statusText}`)
  }

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 minute early

  if (!accessToken) {
    throw new Error('Failed to get access token from Spotify response')
  }

  return accessToken
}

export async function searchArtists(query: string, limit: number = 10): Promise<SpotifyArtist[]> {
  const token = await getAccessToken()
  // Feb 2026: Search limit max reduced from 50 to 10
  const clampedLimit = Math.min(limit, 10)
  
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=${clampedLimit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'no body')
    console.error(`Spotify search error: ${response.status} ${response.statusText}`, errorBody)
    throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.artists.items
}

export async function getArtist(artistId: string): Promise<SpotifyArtist> {
  const token = await getAccessToken()
  
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'no body')
    console.error(`Spotify getArtist error for ${artistId}: ${response.status} ${response.statusText}`, errorBody)
    throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getArtistAlbums(artistId: string, limit: number = 50): Promise<SpotifyRelease[]> {
  const token = await getAccessToken()
  
  // Feb 2026: album_group field removed; include_groups parameter may no longer work.
  // Fetch all albums and filter client-side by album_type instead.
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&market=US`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'no body')
    console.error(`Spotify getArtistAlbums error for ${artistId}: ${response.status} ${response.statusText}`, errorBody)
    throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  // Filter client-side to only albums and singles (replaces include_groups param)
  const items: SpotifyRelease[] = data.items ?? []
  return items.filter(item => item.album_type === 'album' || item.album_type === 'single')
}

/**
 * @deprecated Removed in February 2026 Spotify API changes.
 * GET /browse/new-releases is no longer available.
 * Use getArtistAlbums() per-artist instead.
 */
export async function getNewReleases(_limit: number = 50): Promise<SpotifyRelease[]> {
  console.warn('getNewReleases() is no longer available — GET /browse/new-releases was removed in Feb 2026')
  return []
}

export function mapSpotifyArtistToArtist(spotifyArtist: SpotifyArtist, createdBy?: string) {
  return {
    artist_name: spotifyArtist.name,
    spotify_id: spotifyArtist.id,
    spotify_url: spotifyArtist.external_urls.spotify,
    image_url: spotifyArtist.images?.[0]?.url || null,
    genres: spotifyArtist.genres || [],
    // Feb 2026: popularity and followers removed from Artist responses
    popularity: spotifyArtist.popularity ?? null,
    followers_count: spotifyArtist.followers?.total ?? null,
    created_by: createdBy || null,
    is_active: true
  }
}

export function mapSpotifyReleaseToRelease(spotifyRelease: SpotifyRelease, artistId: string) {
  return {
    artist_id: artistId,
    spotify_id: spotifyRelease.id,
    name: spotifyRelease.name,
    release_type: spotifyRelease.album_type as 'album' | 'single' | 'compilation' | 'ep',
    release_date: spotifyRelease.release_date,
    spotify_url: spotifyRelease.external_urls.spotify,
    image_url: spotifyRelease.images?.[0]?.url || null,
    total_tracks: spotifyRelease.total_tracks || null,
    external_urls: spotifyRelease.external_urls || null,
    artists: spotifyRelease.artists || null
  }
}