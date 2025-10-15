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

export interface RecapData {
  year: number
  personalSummary: {
    totalShows: number
    busiestMonth: number
    busiestMonthName: string
    topVenue: string
  }
  leaderboard: Array<{
    name: string
    displayName: string
    totalShows: number
    mostActiveMonthCount: number
  }>
  monthlyData: Array<{
    name: string
    displayName: string
    monthlyCounts: number[]
    color: string
  }>
  stats: {
    personalTotalShows: number
    personalBusiestMonth: { month: string; count: number }
    personalTopVenue: { venue: string; count: number }
    personalSolos: number
    personalFirstShow: { title: string; date: string }
    personalLastShow: { title: string; date: string }
    personalLongestGap: { days: number; startDate: string; endDate: string }
    personalBackToBackNights: { count: number; examples: Array<{ dates: string[] }> }
    personalMaxShowsInMonth: { month: string; count: number }
    personalMostCommonDay: { day: string; count: number }
    personalTopArtists: Array<{ artist: string; count: number; image_url?: string }>
    personalMostSeenArtist: { artist: string; count: number }
    personalUniqueArtists: number
    personalArtistDiversity: number
    personalTopArtistsByPosition: {
      Headliner: Array<{ artist: string; count: number; image_url?: string }>
      Support: Array<{ artist: string; count: number; image_url?: string }>
      Local: Array<{ artist: string; count: number; image_url?: string }>
    }
    totalShows: number
    groupBusiestMonth: { month: string; count: number }
    groupTopVenue: { venue: string; count: number }
    mostPeopleInOneShow: { showTitle: string; date: string; count: number }
    mostSolos: { name: string; count: number }
    mostActiveUser: { name: string; count: number }
    groupTotal: number
    averageShowsPerPerson: number
    mostPopularDay: { day: string; count: number }
    biggestStreak: { user: string; streak: number }
    groupTopArtists: Array<{ artist: string; count: number; image_url?: string }>
    groupMostSeenArtist: { artist: string; count: number }
    groupUniqueArtists: number
    groupArtistDiversity: number
    mostDiverseUser: { name: string; diversity: number }
    groupTopArtistsByPosition: {
      Headliner: Array<{ artist: string; count: number; image_url?: string }>
      Support: Array<{ artist: string; count: number; image_url?: string }>
      Local: Array<{ artist: string; count: number; image_url?: string }>
    }
  }
  demo?: boolean
}