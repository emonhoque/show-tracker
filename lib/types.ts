export interface ShowArtist {
  artist: string
  position: 'Headliner' | 'Support'
  image_url?: string
  spotify_id: string
  spotify_url: string
}

export interface Show {
  id: string
  title: string
  date_time: string
  time_local: string
  city: string
  venue: string
  ticket_url?: string | null
  spotify_url?: string | null
  apple_music_url?: string | null
  google_photos_url?: string | null
  poster_url?: string | null
  notes?: string | null
  show_artists?: ShowArtist[]
  created_at: string
}

export interface RSVP {
  show_id: string
  name: string
  status: 'going' | 'maybe' | 'not_going'
  updated_at: string
}

export interface RSVPSummary {
  going: string[]
  maybe: string[]
  not_going: string[]
}

export interface Artist {
  id: string
  artist_name: string
  spotify_id: string
  spotify_url?: string | null
  image_url?: string | null
  genres?: string[] | null
  popularity?: number | null
  followers_count?: number | null
  last_checked: string
  created_at: string
  created_by?: string | null
  is_active: boolean
}

export interface Release {
  id: string
  artist_id: string
  spotify_id: string
  name: string
  release_type: 'album' | 'single' | 'compilation' | 'ep'
  release_date: string
  spotify_url?: string | null
  image_url?: string | null
  total_tracks?: number | null
  external_urls?: Record<string, string> | null
  artists?: Array<{
    id: string
    name: string
  }> | null
  created_at: string
}

export interface UserArtist {
  user_id: string
  artist_id: string
  added_at: string
}

export interface SpotifyArtist {
  id: string
  name: string
  external_urls: {
    spotify: string
  }
  images: Array<{
    url: string
    height: number
    width: number
  }>
  genres: string[]
  popularity: number
  followers: {
    total: number
  }
}

export interface SpotifyRelease {
  id: string
  name: string
  album_type: string
  release_date: string
  external_urls: {
    spotify: string
  }
  images: Array<{
    url: string
    height: number
    width: number
  }>
  total_tracks: number
  artists: Array<{
    id: string
    name: string
  }>
}