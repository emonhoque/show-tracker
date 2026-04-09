export interface ShowArtist {
  artist: string
  position: 'Headliner' | 'Support' | 'Local'
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

export interface UserBadge {
  user_id: string
  badge_key: string
  scope_year: number | null
  unlocked_at: string
  metadata: Record<string, unknown> | null
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
  // Feb 2026: popularity and followers removed from Spotify API responses
  popularity?: number
  followers?: {
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

// Merch Tracking types
export type MerchCategory =
  | 'shirt'
  | 'hoodie'
  | 'vinyl'
  | 'poster'
  | 'hat'
  | 'pin'
  | 'sticker'
  | 'flag'
  | 'jersey'
  | 'jacket'
  | 'accessory'
  | 'other'

export type MerchCondition = 'new' | 'good' | 'worn' | 'sealed'

export type PurchaseSource = 'concert' | 'online' | 'resale' | 'gift' | 'other'

export interface MerchItem {
  id: string
  user_id: string
  artist_name: string
  artist_id?: string | null
  show_id?: string | null
  name: string
  category: MerchCategory
  variant?: string | null
  quantity: number
  condition: MerchCondition
  purchase_date?: string | null
  purchase_price_minor?: number | null
  currency: string
  purchase_source?: PurchaseSource | null
  is_signed: boolean
  is_limited_edition: boolean
  is_custom: boolean
  notes?: string | null
  created_at: string
  updated_at: string
  // Joined data
  images?: MerchItemImage[]
  show?: Pick<Show, 'id' | 'title' | 'date_time' | 'venue'> | null
  artist?: Pick<Artist, 'id' | 'artist_name' | 'image_url'> | null
}

export interface MerchItemImage {
  id: string
  merch_item_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface MerchStats {
  totalItems: number
  totalQuantity: number
  totalSpent: number
  categoryBreakdown: Record<string, number>
  topArtist: { name: string; count: number } | null
  signedCount: number
  limitedEditionCount: number
  customCount: number
}