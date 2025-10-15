import { Show, Artist, Release, RSVPSummary } from './types'

// Mock Shows Data
export const mockShows: Show[] = [
  {
    id: 'mock-show-1',
    title: 'Nova Kline - Electric Skies Tour',
    date_time: '2024-03-15T20:00:00.000Z',
    time_local: '20:00',
    city: 'Boston',
    venue: 'TD Garden',
    ticket_url: 'https://example.com/tickets/nova-kline-boston',
    spotify_url: 'https://example.com/artist/nova-kline',
    apple_music_url: 'https://example.com/music/nova-kline',
    google_photos_url: 'https://example.com/photos/nova-kline-boston-2024',
    poster_url: 'https://placehold.co/600x900/0ea5e9/white?text=Nova+Kline',
    notes: 'Doors open at 7 PM. Opening act starts at 8 PM.',
    show_artists: [
      {
        artist: 'Nova Kline',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/0ea5e9/white?text=Nova+Kline',
        spotify_id: 'novakline01',
        spotify_url: 'https://example.com/artist/nova-kline'
      }
    ],
    created_at: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 'mock-show-2',
    title: 'Zephyr Vale - Neon Eclipse Tour',
    date_time: '2024-04-22T19:30:00.000Z',
    time_local: '19:30',
    city: 'Boston',
    venue: 'Agganis Arena',
    ticket_url: 'https://example.com/tickets/zephyr-vale-boston',
    spotify_url: 'https://example.com/artist/zephyr-vale',
    apple_music_url: 'https://example.com/music/zephyr-vale',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/8b5cf6/white?text=Zephyr+Vale',
    notes: 'All ages show. VIP meet and greet available.',
    show_artists: [
      {
        artist: 'Zephyr Vale',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/8b5cf6/white?text=Zephyr+Vale',
        spotify_id: 'zephyrvale22',
        spotify_url: 'https://example.com/artist/zephyr-vale'
      }
    ],
    created_at: '2024-01-20T14:15:00.000Z'
  },
  {
    id: 'mock-show-3',
    title: 'Lyra Monroe - Chromalune Tour',
    date_time: '2024-05-10T21:00:00.000Z',
    time_local: '21:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: 'https://example.com/tickets/lyra-monroe-boston',
    spotify_url: 'https://example.com/artist/lyra-monroe',
    apple_music_url: null,
    google_photos_url: 'https://example.com/photos/lyra-monroe-boston-2024',
    poster_url: 'https://placehold.co/600x900/ec4899/white?text=Lyra+Monroe',
    notes: 'Standing room only. No re-entry.',
    show_artists: [
      {
        artist: 'Lyra Monroe',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/ec4899/white?text=Lyra+Monroe',
        spotify_id: 'lyramonroe33',
        spotify_url: 'https://example.com/artist/lyra-monroe'
      },
      {
        artist: 'Ember Rae',
        position: 'Support',
        image_url: 'https://placehold.co/300x300/f97316/white?text=Ember+Rae',
        spotify_id: 'emberrae44',
        spotify_url: 'https://example.com/artist/ember-rae'
      }
    ],
    created_at: '2024-02-01T09:45:00.000Z'
  },
  {
    id: 'mock-show-4',
    title: 'Atlas Rook - The Geometry Tour',
    date_time: '2024-06-05T20:30:00.000Z',
    time_local: '20:30',
    city: 'Boston',
    venue: 'MGM Music Hall',
    ticket_url: 'https://example.com/tickets/atlas-rook-boston',
    spotify_url: 'https://example.com/artist/atlas-rook',
    apple_music_url: 'https://example.com/music/atlas-rook',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/f97316/white?text=Atlas+Rook',
    notes: 'Acoustic experience. Intimate venue.',
    show_artists: [
      {
        artist: 'Atlas Rook',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/f97316/white?text=Atlas+Rook',
        spotify_id: 'atlasrook55',
        spotify_url: 'https://example.com/artist/atlas-rook'
      }
    ],
    created_at: '2024-02-10T16:20:00.000Z'
  },
  {
    id: 'mock-show-5',
    title: 'Aria Nightfall - Midnight Lanterns Tour',
    date_time: '2024-07-18T19:00:00.000Z',
    time_local: '19:00',
    city: 'Boston',
    venue: 'Xfinity Center',
    ticket_url: 'https://example.com/tickets/aria-nightfall-boston',
    spotify_url: 'https://example.com/artist/aria-nightfall',
    apple_music_url: null,
    google_photos_url: 'https://example.com/photos/aria-nightfall-boston-2024',
    poster_url: 'https://placehold.co/600x900/ef4444/white?text=Aria+Nightfall',
    notes: 'Outdoor venue. Rain or shine event.',
    show_artists: [
      {
        artist: 'Aria Nightfall',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/ef4444/white?text=Aria+Nightfall',
        spotify_id: 'arianightfall66',
        spotify_url: 'https://example.com/artist/aria-nightfall'
      },
      {
        artist: 'Kairo Wolfe',
        position: 'Support',
        image_url: 'https://placehold.co/300x300/dc2626/white?text=Kairo+Wolfe',
        spotify_id: 'kairowolfe77',
        spotify_url: 'https://example.com/artist/kairo-wolfe'
      }
    ],
    created_at: '2024-02-15T11:30:00.000Z'
  },
  {
    id: 'mock-show-6',
    title: 'Solstice City - Orbits Tour',
    date_time: '2024-08-12T20:00:00.000Z',
    time_local: '20:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: 'https://example.com/tickets/solstice-city-boston',
    spotify_url: 'https://example.com/artist/solstice-city',
    apple_music_url: 'https://example.com/music/solstice-city',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/3b82f6/white?text=Solstice+City',
    notes: 'Spectacular light show. Environmentally conscious tour.',
    show_artists: [
      {
        artist: 'Solstice City',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/3b82f6/white?text=Solstice+City',
        spotify_id: 'solsticecity88',
        spotify_url: 'https://example.com/artist/solstice-city'
      }
    ],
    created_at: '2024-02-20T13:45:00.000Z'
  }
]

// Mock Past Shows
export const mockPastShows: Show[] = [
  {
    id: 'mock-past-show-1',
    title: 'Echo Meridian - Northern Lines Tour',
    date_time: '2024-01-15T21:00:00.000Z',
    time_local: '21:00',
    city: 'Boston',
    venue: 'Big Night Live',
    ticket_url: null,
    spotify_url: 'https://example.com/artist/echo-meridian',
    apple_music_url: null,
    google_photos_url: 'https://example.com/photos/echo-meridian-boston-2024',
    poster_url: 'https://placehold.co/600x900/14b8a6/white?text=Echo+Meridian',
    notes: 'Synthwave showcase. Incredible energy.',
    show_artists: [
      {
        artist: 'Echo Meridian',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/14b8a6/white?text=Echo+Meridian',
        spotify_id: 'echomeridian99',
        spotify_url: 'https://example.com/artist/echo-meridian'
      }
    ],
    created_at: '2023-12-10T08:30:00.000Z'
  },
  {
    id: 'mock-past-show-2',
    title: 'Indigo Harbor - Tide and Timber Tour',
    date_time: '2024-01-28T19:30:00.000Z',
    time_local: '19:30',
    city: 'Boston',
    venue: 'Berklee Performance Center',
    ticket_url: null,
    spotify_url: 'https://example.com/artist/indigo-harbor',
    apple_music_url: 'https://example.com/music/indigo-harbor',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/a855f7/white?text=Indigo+Harbor',
    notes: 'Intimate acoustic performance. Sold out show.',
    show_artists: [
      {
        artist: 'Indigo Harbor',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/a855f7/white?text=Indigo+Harbor',
        spotify_id: 'indigoharbor00',
        spotify_url: 'https://example.com/artist/indigo-harbor'
      }
    ],
    created_at: '2023-12-15T12:15:00.000Z'
  }
]

// Mock Artists Data
export const mockArtists: Artist[] = [
  {
    id: 'mock-artist-1',
    artist_name: 'Nova Kline',
    spotify_id: 'novakline01',
    spotify_url: 'https://example.com/artist/nova-kline',
    image_url: 'https://placehold.co/300x300/0ea5e9/white?text=Nova+Kline',
    genres: ['synth pop', 'alt pop', 'electro'],
    popularity: 95,
    followers_count: 1188000,
    last_checked: '2024-02-20T10:30:00.000Z',
    created_at: '2024-01-01T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-2',
    artist_name: 'Zephyr Vale',
    spotify_id: 'zephyrvale22',
    spotify_url: 'https://example.com/artist/zephyr-vale',
    image_url: 'https://placehold.co/300x300/8b5cf6/white?text=Zephyr+Vale',
    genres: ['electronic', 'alt r&b', 'dream pop'],
    popularity: 93,
    followers_count: 1135000,
    last_checked: '2024-02-18T15:45:00.000Z',
    created_at: '2024-01-05T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-3',
    artist_name: 'Lyra Monroe',
    spotify_id: 'lyramonroe33',
    spotify_url: 'https://example.com/artist/lyra-monroe',
    image_url: 'https://placehold.co/300x300/ec4899/white?text=Lyra+Monroe',
    genres: ['dance pop', 'electropop', 'synthwave'],
    popularity: 92,
    followers_count: 1088000,
    last_checked: '2024-02-16T09:20:00.000Z',
    created_at: '2024-01-10T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-4',
    artist_name: 'Ember Rae',
    spotify_id: 'emberrae44',
    spotify_url: 'https://example.com/artist/ember-rae',
    image_url: 'https://placehold.co/300x300/f97316/white?text=Ember+Rae',
    genres: ['alt pop', 'indie pop', 'electronica'],
    popularity: 90,
    followers_count: 979000,
    last_checked: '2024-02-14T14:10:00.000Z',
    created_at: '2024-01-15T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-5',
    artist_name: 'Atlas Rook',
    spotify_id: 'atlasrook55',
    spotify_url: 'https://example.com/artist/atlas-rook',
    image_url: 'https://placehold.co/300x300/f97316/white?text=Atlas+Rook',
    genres: ['singer songwriter', 'acoustic', 'folk pop'],
    popularity: 88,
    followers_count: 929000,
    last_checked: '2024-02-12T11:30:00.000Z',
    created_at: '2024-01-20T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-6',
    artist_name: 'Aria Nightfall',
    spotify_id: 'arianightfall66',
    spotify_url: 'https://example.com/artist/aria-nightfall',
    image_url: 'https://placehold.co/300x300/ef4444/white?text=Aria+Nightfall',
    genres: ['pop', 'r&b', 'dance'],
    popularity: 88,
    followers_count: 929000,
    last_checked: '2024-02-10T16:45:00.000Z',
    created_at: '2024-01-25T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-7',
    artist_name: 'Solstice City',
    spotify_id: 'solsticecity88',
    spotify_url: 'https://example.com/artist/solstice-city',
    image_url: 'https://placehold.co/300x300/3b82f6/white?text=Solstice+City',
    genres: ['alt rock', 'pop rock', 'space pop'],
    popularity: 85,
    followers_count: 921000,
    last_checked: '2024-02-08T13:20:00.000Z',
    created_at: '2024-01-30T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-8',
    artist_name: 'Kairo Wolfe',
    spotify_id: 'kairowolfe77',
    spotify_url: 'https://example.com/artist/kairo-wolfe',
    image_url: 'https://placehold.co/300x300/dc2626/white?text=Kairo+Wolfe',
    genres: ['hip hop', 'rap', 'alt rap'],
    popularity: 83,
    followers_count: 844000,
    last_checked: '2024-02-06T10:15:00.000Z',
    created_at: '2024-02-01T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-9',
    artist_name: 'Echo Meridian',
    spotify_id: 'echomeridian99',
    spotify_url: 'https://example.com/artist/echo-meridian',
    image_url: 'https://placehold.co/300x300/14b8a6/white?text=Echo+Meridian',
    genres: ['synthwave', 'chillwave', 'electronic'],
    popularity: 82,
    followers_count: 831000,
    last_checked: '2024-02-04T08:45:00.000Z',
    created_at: '2024-02-05T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-10',
    artist_name: 'Indigo Harbor',
    spotify_id: 'indigoharbor00',
    spotify_url: 'https://example.com/artist/indigo-harbor',
    image_url: 'https://placehold.co/300x300/a855f7/white?text=Indigo+Harbor',
    genres: ['indie folk', 'alt country', 'singer songwriter'],
    popularity: 80,
    followers_count: 829000,
    last_checked: '2024-02-02T14:30:00.000Z',
    created_at: '2024-02-10T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  }
]

// Mock Releases Data
export const mockReleases: Release[] = [
  {
    id: 'mock-release-1',
    artist_id: 'mock-artist-1',
    spotify_id: 'rel-electric-skies',
    name: 'Electric Skies',
    release_type: 'album',
    release_date: '2024-01-07',
    spotify_url: 'https://example.com/album/electric-skies',
    image_url: 'https://placehold.co/300x300/0ea5e9/white?text=Electric+Skies',
    total_tracks: 9,
    external_urls: {
      spotify: 'https://example.com/album/electric-skies',
      apple_music: 'https://example.com/apple/electric-skies'
    },
    artists: [
      {
        id: 'artist-nova-kline',
        name: 'Nova Kline'
      }
    ],
    created_at: '2024-01-07T00:00:00.000Z'
  },
  {
    id: 'mock-release-2',
    artist_id: 'mock-artist-2',
    spotify_id: 'rel-neon-eclipse',
    name: 'Neon Eclipse',
    release_type: 'album',
    release_date: '2024-01-15',
    spotify_url: 'https://example.com/album/neon-eclipse',
    image_url: 'https://placehold.co/300x300/8b5cf6/white?text=Neon+Eclipse',
    total_tracks: 14,
    external_urls: {
      spotify: 'https://example.com/album/neon-eclipse'
    },
    artists: [
      {
        id: 'artist-zephyr-vale',
        name: 'Zephyr Vale'
      }
    ],
    created_at: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'mock-release-3',
    artist_id: 'mock-artist-3',
    spotify_id: 'rel-chromalune',
    name: 'Chromalune',
    release_type: 'album',
    release_date: '2024-01-22',
    spotify_url: 'https://example.com/album/chromalune',
    image_url: 'https://placehold.co/300x300/ec4899/white?text=Chromalune',
    total_tracks: 16,
    external_urls: {
      spotify: 'https://example.com/album/chromalune'
    },
    artists: [
      {
        id: 'artist-lyra-monroe',
        name: 'Lyra Monroe'
      }
    ],
    created_at: '2024-01-22T00:00:00.000Z'
  },
  {
    id: 'mock-release-4',
    artist_id: 'mock-artist-4',
    spotify_id: 'rel-ashes-and-petals',
    name: 'Ashes and Petals',
    release_type: 'album',
    release_date: '2024-01-30',
    spotify_url: 'https://example.com/album/ashes-and-petals',
    image_url: 'https://placehold.co/300x300/f97316/white?text=Ashes+and+Petals',
    total_tracks: 16,
    external_urls: {
      spotify: 'https://example.com/album/ashes-and-petals'
    },
    artists: [
      {
        id: 'artist-ember-rae',
        name: 'Ember Rae'
      }
    ],
    created_at: '2024-01-30T00:00:00.000Z'
  },
  {
    id: 'mock-release-5',
    artist_id: 'mock-artist-5',
    spotify_id: 'rel-vectors',
    name: 'Vectors',
    release_type: 'album',
    release_date: '2024-02-05',
    spotify_url: 'https://example.com/album/vectors',
    image_url: 'https://placehold.co/300x300/f97316/white?text=Vectors',
    total_tracks: 12,
    external_urls: {
      spotify: 'https://example.com/album/vectors'
    },
    artists: [
      {
        id: 'artist-atlas-rook',
        name: 'Atlas Rook'
      }
    ],
    created_at: '2024-02-05T00:00:00.000Z'
  },
  {
    id: 'mock-release-6',
    artist_id: 'mock-artist-6',
    spotify_id: 'rel-lanterns',
    name: 'Lanterns',
    release_type: 'album',
    release_date: '2024-02-10',
    spotify_url: 'https://example.com/album/lanterns',
    image_url: 'https://placehold.co/300x300/ef4444/white?text=Lanterns',
    total_tracks: 13,
    external_urls: {
      spotify: 'https://example.com/album/lanterns'
    },
    artists: [
      {
        id: 'artist-aria-nightfall',
        name: 'Aria Nightfall'
      }
    ],
    created_at: '2024-02-10T00:00:00.000Z'
  },
  {
    id: 'mock-release-7',
    artist_id: 'mock-artist-7',
    spotify_id: 'rel-orbits',
    name: 'Orbits',
    release_type: 'album',
    release_date: '2024-02-12',
    spotify_url: 'https://example.com/album/orbits',
    image_url: 'https://placehold.co/300x300/3b82f6/white?text=Orbits',
    total_tracks: 12,
    external_urls: {
      spotify: 'https://example.com/album/orbits'
    },
    artists: [
      {
        id: 'artist-solstice-city',
        name: 'Solstice City'
      }
    ],
    created_at: '2024-02-12T00:00:00.000Z'
  },
  {
    id: 'mock-release-8',
    artist_id: 'mock-artist-8',
    spotify_id: 'rel-city-of-wolves',
    name: 'City of Wolves',
    release_type: 'album',
    release_date: '2024-02-14',
    spotify_url: 'https://example.com/album/city-of-wolves',
    image_url: 'https://placehold.co/300x300/dc2626/white?text=City+of+Wolves',
    total_tracks: 18,
    external_urls: {
      spotify: 'https://example.com/album/city-of-wolves'
    },
    artists: [
      {
        id: 'artist-kairo-wolfe',
        name: 'Kairo Wolfe'
      }
    ],
    created_at: '2024-02-14T00:00:00.000Z'
  },
  {
    id: 'mock-release-9',
    artist_id: 'mock-artist-9',
    spotify_id: 'rel-northern-lines',
    name: 'Northern Lines',
    release_type: 'album',
    release_date: '2024-02-16',
    spotify_url: 'https://example.com/album/northern-lines',
    image_url: 'https://placehold.co/300x300/14b8a6/white?text=Northern+Lines',
    total_tracks: 23,
    external_urls: {
      spotify: 'https://example.com/album/northern-lines'
    },
    artists: [
      {
        id: 'artist-echo-meridian',
        name: 'Echo Meridian'
      }
    ],
    created_at: '2024-02-16T00:00:00.000Z'
  },
  {
    id: 'mock-release-10',
    artist_id: 'mock-artist-10',
    spotify_id: 'rel-tide-and-timber',
    name: 'Tide and Timber',
    release_type: 'album',
    release_date: '2024-02-18',
    spotify_url: 'https://example.com/album/tide-and-timber',
    image_url: 'https://placehold.co/300x300/a855f7/white?text=Tide+and+Timber',
    total_tracks: 13,
    external_urls: {
      spotify: 'https://example.com/album/tide-and-timber'
    },
    artists: [
      {
        id: 'artist-indigo-harbor',
        name: 'Indigo Harbor'
      }
    ],
    created_at: '2024-02-18T00:00:00.000Z'
  }
]

// Mock RSVP Data for shows
export const mockRSVPs: Record<string, RSVPSummary> = {
  'mock-show-1': {
    going: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'],
    maybe: ['Emma Brown', 'Frank Miller'],
    not_going: ['Grace Lee']
  },
  'mock-show-2': {
    going: ['Alice Johnson', 'Emma Brown', 'Henry Taylor'],
    maybe: ['Bob Smith', 'Isabella Garcia'],
    not_going: ['Carol Davis', 'Frank Miller']
  },
  'mock-show-3': {
    going: ['Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown', 'Frank Miller'],
    maybe: ['Grace Lee'],
    not_going: ['Alice Johnson']
  },
  'mock-show-4': {
    going: ['Alice Johnson', 'Grace Lee', 'Henry Taylor'],
    maybe: ['Bob Smith', 'Carol Davis'],
    not_going: ['David Wilson', 'Emma Brown']
  },
  'mock-show-5': {
    going: ['David Wilson', 'Emma Brown', 'Frank Miller', 'Grace Lee', 'Isabella Garcia'],
    maybe: ['Alice Johnson', 'Bob Smith'],
    not_going: ['Carol Davis']
  },
  'mock-show-6': {
    going: ['Carol Davis', 'Emma Brown', 'Grace Lee'],
    maybe: ['Alice Johnson', 'David Wilson'],
    not_going: ['Bob Smith', 'Frank Miller']
  },
  'mock-past-show-1': {
    going: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
    maybe: ['Emma Brown'],
    not_going: ['David Wilson', 'Frank Miller']
  },
  'mock-past-show-2': {
    going: ['Grace Lee', 'Henry Taylor', 'Isabella Garcia'],
    maybe: ['Alice Johnson'],
    not_going: ['Bob Smith', 'Carol Davis']
  }
}

// Helper function to get upcoming shows with RSVPs
export const getUpcomingShowsWithRSVPs = (): Show[] => {
  return mockShows.map(show => ({
    ...show,
    rsvps: mockRSVPs[show.id] || { going: [], maybe: [], not_going: [] }
  }))
}

// Helper function to get past shows with RSVPs
export const getPastShowsWithRSVPs = (): Show[] => {
  return mockPastShows.map(show => ({
    ...show,
    rsvps: mockRSVPs[show.id] || { going: [], maybe: [], not_going: [] }
  }))
}

// Helper function to get recent releases (last 30 days)
export const getRecentReleases = (): Release[] => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return mockReleases.filter(release =>
    new Date(release.release_date) >= thirtyDaysAgo
  )
}

// Mock pagination response for past shows
export const getPastShowsPaginated = (page: number = 1, limit: number = 20) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedShows = mockPastShows.slice(startIndex, endIndex)

  return {
    shows: paginatedShows.map(show => ({
      ...show,
      rsvps: mockRSVPs[show.id] || { going: [], maybe: [], not_going: [] }
    })),
    pagination: {
      page,
      limit,
      total: mockPastShows.length,
      totalPages: Math.ceil(mockPastShows.length / limit),
      hasNext: endIndex < mockPastShows.length,
      hasPrev: page > 1
    }
  }
}

// Mock pagination response for releases
export const getReleasesPaginated = (page: number = 1, limit: number = 50) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedReleases = mockReleases.slice(startIndex, endIndex)

  return {
    releases: paginatedReleases,
    pagination: {
      page,
      limit,
      total: mockReleases.length,
      totalPages: Math.ceil(mockReleases.length / limit),
      hasNext: endIndex < mockReleases.length,
      hasPrev: page > 1
    }
  }
}

// Helper function to get RSVPs by show ID
export const getRsvpsByShowId = (showId: string) => {
  const rsvps = mockRSVPs[showId] || { going: [], maybe: [], not_going: [] }
  const allRsvps = [
    ...rsvps.going.map(name => ({ name, status: 'going' as const })),
    ...rsvps.maybe.map(name => ({ name, status: 'maybe' as const })),
    ...rsvps.not_going.map(name => ({ name, status: 'not_going' as const }))
  ]
  return allRsvps
}

// Export all mock data as a single object for easy access
export const mockData = {
  shows: mockShows,
  pastShows: mockPastShows,
  artists: mockArtists,
  releases: mockReleases,
  rsvps: mockRSVPs,
  getUpcomingShowsWithRSVPs,
  getPastShowsWithRSVPs,
  getRecentReleases,
  getPastShowsPaginated,
  getReleasesPaginated,
  getRsvpsByShowId
}
