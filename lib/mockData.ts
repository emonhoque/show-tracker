import { Show, Artist, Release, ShowArtist, RSVPSummary } from './types'

// Mock Shows Data
export const mockShows: Show[] = [
  {
    id: 'mock-show-1',
    title: 'Bruno Mars - 24K Magic World Tour',
    date_time: '2024-03-15T20:00:00.000Z',
    time_local: '20:00',
    city: 'Boston',
    venue: 'TD Garden',
    ticket_url: 'https://ticketmaster.com/bruno-mars-boston',
    spotify_url: 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C',
    apple_music_url: 'https://music.apple.com/artist/bruno-mars',
    google_photos_url: 'https://photos.google.com/bruno-mars-boston-2024',
    poster_url: 'https://placehold.co/600x900/d97706/white?text=Bruno+Mars',
    notes: 'Doors open at 7 PM. Opening act starts at 8 PM.',
    show_artists: [
      {
        artist: 'Bruno Mars',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/d97706/white?text=Bruno+Mars',
        spotify_id: '0du5cEVh5yTK9QJze8zA0C',
        spotify_url: 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C'
      }
    ],
    created_at: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 'mock-show-2',
    title: 'The Weeknd - After Hours Til Dawn Tour',
    date_time: '2024-04-22T19:30:00.000Z',
    time_local: '19:30',
    city: 'Boston',
    venue: 'Agganis Arena',
    ticket_url: 'https://ticketmaster.com/weeknd-boston',
    spotify_url: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
    apple_music_url: 'https://music.apple.com/artist/the-weeknd',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/8b5cf6/white?text=The+Weeknd',
    notes: 'All ages show. VIP meet and greet available.',
    show_artists: [
      {
        artist: 'The Weeknd',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/8b5cf6/white?text=The+Weeknd',
        spotify_id: '1Xyo4u8uXC1ZmMpatF05PJ',
        spotify_url: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ'
      }
    ],
    created_at: '2024-01-20T14:15:00.000Z'
  },
  {
    id: 'mock-show-3',
    title: 'Lady Gaga - Chromatica Ball Tour',
    date_time: '2024-05-10T21:00:00.000Z',
    time_local: '21:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: 'https://ticketmaster.com/lady-gaga-boston',
    spotify_url: 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms',
    apple_music_url: null,
    google_photos_url: 'https://photos.google.com/lady-gaga-boston-2024',
    poster_url: 'https://placehold.co/600x900/ec4899/white?text=Lady+Gaga',
    notes: 'Standing room only. No re-entry.',
    show_artists: [
      {
        artist: 'Lady Gaga',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/ec4899/white?text=Lady+Gaga',
        spotify_id: '1HY2Jd0NmPuamShAr6KMms',
        spotify_url: 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms'
      },
      {
        artist: 'Billie Eilish',
        position: 'Support',
        image_url: 'https://placehold.co/300x300/10b981/white?text=Billie+Eilish',
        spotify_id: '6qqNVTkY8uBg9cP3Jd7DAH',
        spotify_url: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH'
      }
    ],
    created_at: '2024-02-01T09:45:00.000Z'
  },
  {
    id: 'mock-show-4',
    title: 'Ed Sheeran - Mathematics Tour',
    date_time: '2024-06-05T20:30:00.000Z',
    time_local: '20:30',
    city: 'Boston',
    venue: 'MGM Music Hall',
    ticket_url: 'https://ticketmaster.com/ed-sheeran-boston',
    spotify_url: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V',
    apple_music_url: 'https://music.apple.com/artist/ed-sheeran',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/f97316/white?text=Ed+Sheeran',
    notes: 'Acoustic experience. Intimate venue.',
    show_artists: [
      {
        artist: 'Ed Sheeran',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/f97316/white?text=Ed+Sheeran',
        spotify_id: '6eUKZXaKkcviH0Ku9w2n3V',
        spotify_url: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V'
      }
    ],
    created_at: '2024-02-10T16:20:00.000Z'
  },
  {
    id: 'mock-show-5',
    title: 'Rihanna - Anti World Tour',
    date_time: '2024-07-18T19:00:00.000Z',
    time_local: '19:00',
    city: 'Boston',
    venue: 'Xfinity Center',
    ticket_url: 'https://ticketmaster.com/rihanna-boston',
    spotify_url: 'https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H',
    apple_music_url: null,
    google_photos_url: 'https://photos.google.com/rihanna-boston-2024',
    poster_url: 'https://placehold.co/600x900/ef4444/white?text=Rihanna',
    notes: 'Outdoor venue. Rain or shine event.',
    show_artists: [
      {
        artist: 'Rihanna',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/ef4444/white?text=Rihanna',
        spotify_id: '5pKCCKE2ajJHZ9KAiaK11H',
        spotify_url: 'https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H'
      },
      {
        artist: 'Kendrick Lamar',
        position: 'Support',
        image_url: 'https://placehold.co/300x300/dc2626/white?text=Kendrick+Lamar',
        spotify_id: '2YZyLoL8N0Wb9xBt1NhZWg',
        spotify_url: 'https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg'
      }
    ],
    created_at: '2024-02-15T11:30:00.000Z'
  },
  {
    id: 'mock-show-6',
    title: 'Coldplay - Music of the Spheres Tour',
    date_time: '2024-08-12T20:00:00.000Z',
    time_local: '20:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: 'https://ticketmaster.com/coldplay-boston',
    spotify_url: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU',
    apple_music_url: 'https://music.apple.com/artist/coldplay',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/3b82f6/white?text=Coldplay',
    notes: 'Spectacular light show. Environmentally conscious tour.',
    show_artists: [
      {
        artist: 'Coldplay',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/3b82f6/white?text=Coldplay',
        spotify_id: '4gzpq5DPGxSnKTe4SA8HAU',
        spotify_url: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU'
      }
    ],
    created_at: '2024-02-20T13:45:00.000Z'
  }
]

// Mock Past Shows
export const mockPastShows: Show[] = [
  {
    id: 'mock-past-show-1',
    title: 'Bad Bunny - World\'s Hottest Tour',
    date_time: '2024-01-15T21:00:00.000Z',
    time_local: '21:00',
    city: 'Boston',
    venue: 'Big Night Live',
    ticket_url: null,
    spotify_url: 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X',
    apple_music_url: null,
    google_photos_url: 'https://photos.google.com/bad-bunny-boston-2024',
    poster_url: 'https://placehold.co/600x900/14b8a6/white?text=Bad+Bunny',
    notes: 'Reggaeton showcase. Incredible energy!',
    show_artists: [
      {
        artist: 'Bad Bunny',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/14b8a6/white?text=Bad+Bunny',
        spotify_id: '4q3ewBCX7sLwd24euuV69X',
        spotify_url: 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X'
      }
    ],
    created_at: '2023-12-10T08:30:00.000Z'
  },
  {
    id: 'mock-past-show-2',
    title: 'Taylor Swift - The Eras Tour',
    date_time: '2024-01-28T19:30:00.000Z',
    time_local: '19:30',
    city: 'Boston',
    venue: 'Berklee Performance Center',
    ticket_url: null,
    spotify_url: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    apple_music_url: 'https://music.apple.com/artist/taylor-swift',
    google_photos_url: null,
    poster_url: 'https://placehold.co/600x900/a855f7/white?text=Taylor+Swift',
    notes: 'Intimate acoustic performance. Sold out show.',
    show_artists: [
      {
        artist: 'Taylor Swift',
        position: 'Headliner',
        image_url: 'https://placehold.co/300x300/a855f7/white?text=Taylor+Swift',
        spotify_id: '06HL4z0CvFAxyc27GXpf02',
        spotify_url: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02'
      }
    ],
    created_at: '2023-12-15T12:15:00.000Z'
  }
]

// Mock Artists Data
export const mockArtists: Artist[] = [
  {
    id: 'mock-artist-1',
    artist_name: 'Bruno Mars',
    spotify_id: '0du5cEVh5yTK9QJze8zA0C',
    spotify_url: 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C',
    image_url: 'https://placehold.co/300x300/d97706/white?text=Bruno+Mars',
    genres: ['pop', 'r&b', 'funk'],
    popularity: 95,
    followers_count: 118800000,
    last_checked: '2024-02-20T10:30:00.000Z',
    created_at: '2024-01-01T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-2',
    artist_name: 'The Weeknd',
    spotify_id: '1Xyo4u8uXC1ZmMpatF05PJ',
    spotify_url: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
    image_url: 'https://placehold.co/300x300/8b5cf6/white?text=The+Weeknd',
    genres: ['pop', 'r&b', 'alternative r&b'],
    popularity: 95,
    followers_count: 113500000,
    last_checked: '2024-02-18T15:45:00.000Z',
    created_at: '2024-01-05T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-3',
    artist_name: 'Lady Gaga',
    spotify_id: '1HY2Jd0NmPuamShAr6KMms',
    spotify_url: 'https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms',
    image_url: 'https://placehold.co/300x300/ec4899/white?text=Lady+Gaga',
    genres: ['pop', 'dance pop', 'electropop'],
    popularity: 92,
    followers_count: 108800000,
    last_checked: '2024-02-16T09:20:00.000Z',
    created_at: '2024-01-10T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-4',
    artist_name: 'Billie Eilish',
    spotify_id: '6qqNVTkY8uBg9cP3Jd7DAH',
    spotify_url: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH',
    image_url: 'https://placehold.co/300x300/10b981/white?text=Billie+Eilish',
    genres: ['pop', 'alternative pop', 'indie pop'],
    popularity: 90,
    followers_count: 97900000,
    last_checked: '2024-02-14T14:10:00.000Z',
    created_at: '2024-01-15T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-5',
    artist_name: 'Ed Sheeran',
    spotify_id: '6eUKZXaKkcviH0Ku9w2n3V',
    spotify_url: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V',
    image_url: 'https://placehold.co/300x300/f97316/white?text=Ed+Sheeran',
    genres: ['pop', 'singer-songwriter', 'acoustic'],
    popularity: 88,
    followers_count: 92900000,
    last_checked: '2024-02-12T11:30:00.000Z',
    created_at: '2024-01-20T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-6',
    artist_name: 'Rihanna',
    spotify_id: '5pKCCKE2ajJHZ9KAiaK11H',
    spotify_url: 'https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H',
    image_url: 'https://placehold.co/300x300/ef4444/white?text=Rihanna',
    genres: ['pop', 'r&b', 'dance'],
    popularity: 88,
    followers_count: 92900000,
    last_checked: '2024-02-10T16:45:00.000Z',
    created_at: '2024-01-25T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-7',
    artist_name: 'Coldplay',
    spotify_id: '4gzpq5DPGxSnKTe4SA8HAU',
    spotify_url: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU',
    image_url: 'https://placehold.co/300x300/3b82f6/white?text=Coldplay',
    genres: ['alternative rock', 'pop rock', 'permanent wave'],
    popularity: 85,
    followers_count: 92100000,
    last_checked: '2024-02-08T13:20:00.000Z',
    created_at: '2024-01-30T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-8',
    artist_name: 'Kendrick Lamar',
    spotify_id: '2YZyLoL8N0Wb9xBt1NhZWg',
    spotify_url: 'https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg',
    image_url: 'https://placehold.co/300x300/dc2626/white?text=Kendrick+Lamar',
    genres: ['hip hop', 'rap', 'west coast rap'],
    popularity: 83,
    followers_count: 84400000,
    last_checked: '2024-02-06T10:15:00.000Z',
    created_at: '2024-02-01T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-9',
    artist_name: 'Bad Bunny',
    spotify_id: '4q3ewBCX7sLwd24euuV69X',
    spotify_url: 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X',
    image_url: 'https://placehold.co/300x300/14b8a6/white?text=Bad+Bunny',
    genres: ['reggaeton', 'latin trap', 'urbano latino'],
    popularity: 82,
    followers_count: 83100000,
    last_checked: '2024-02-04T08:45:00.000Z',
    created_at: '2024-02-05T00:00:00.000Z',
    created_by: 'demo-user',
    is_active: true
  },
  {
    id: 'mock-artist-10',
    artist_name: 'Taylor Swift',
    spotify_id: '06HL4z0CvFAxyc27GXpf02',
    spotify_url: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    image_url: 'https://placehold.co/300x300/a855f7/white?text=Taylor+Swift',
    genres: ['pop', 'country', 'singer-songwriter'],
    popularity: 80,
    followers_count: 82900000,
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
    spotify_id: '4PgleR09JVnm3zY1fW3XBA',
    name: '24K Magic',
    release_type: 'album',
    release_date: '2024-01-07',
    spotify_url: 'https://open.spotify.com/album/4PgleR09JVnm3zY1fW3XBA',
    image_url: 'https://placehold.co/300x300/d97706/white?text=24K+Magic',
    total_tracks: 9,
    external_urls: {
      spotify: 'https://open.spotify.com/album/4PgleR09JVnm3zY1fW3XBA',
      apple_music: 'https://music.apple.com/album/24k-magic'
    },
    artists: [
      {
        id: '0du5cEVh5yTK9QJze8zA0C',
        name: 'Bruno Mars'
      }
    ],
    created_at: '2024-01-07T00:00:00.000Z'
  },
  {
    id: 'mock-release-2',
    artist_id: 'mock-artist-2',
    spotify_id: '4qZBW3f2Q8y0k1A84d4iAO',
    name: 'After Hours',
    release_type: 'album',
    release_date: '2024-01-15',
    spotify_url: 'https://open.spotify.com/album/4qZBW3f2Q8y0k1A84d4iAO',
    image_url: 'https://placehold.co/300x300/8b5cf6/white?text=After+Hours',
    total_tracks: 14,
    external_urls: {
      spotify: 'https://open.spotify.com/album/4qZBW3f2Q8y0k1A84d4iAO'
    },
    artists: [
      {
        id: '1Xyo4u8uXC1ZmMpatF05PJ',
        name: 'The Weeknd'
      }
    ],
    created_at: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'mock-release-3',
    artist_id: 'mock-artist-3',
    spotify_id: '1yNE5OOgUBQ9bC8U0WP0yH',
    name: 'Chromatica',
    release_type: 'album',
    release_date: '2024-01-22',
    spotify_url: 'https://open.spotify.com/album/1yNE5OOgUBQ9bC8U0WP0yH',
    image_url: 'https://placehold.co/300x300/ec4899/white?text=Chromatica',
    total_tracks: 16,
    external_urls: {
      spotify: 'https://open.spotify.com/album/1yNE5OOgUBQ9bC8U0WP0yH'
    },
    artists: [
      {
        id: '1HY2Jd0NmPuamShAr6KMms',
        name: 'Lady Gaga'
      }
    ],
    created_at: '2024-01-22T00:00:00.000Z'
  },
  {
    id: 'mock-release-4',
    artist_id: 'mock-artist-4',
    spotify_id: '0JGOiO34nwfUdDrD612dOp',
    name: 'Happier Than Ever',
    release_type: 'album',
    release_date: '2024-01-30',
    spotify_url: 'https://open.spotify.com/album/0JGOiO34nwfUdDrD612dOp',
    image_url: 'https://placehold.co/300x300/10b981/white?text=Happier+Than+Ever',
    total_tracks: 16,
    external_urls: {
      spotify: 'https://open.spotify.com/album/0JGOiO34nwfUdDrD612dOp'
    },
    artists: [
      {
        id: '6qqNVTkY8uBg9cP3Jd7DAH',
        name: 'Billie Eilish'
      }
    ],
    created_at: '2024-01-30T00:00:00.000Z'
  },
  {
    id: 'mock-release-5',
    artist_id: 'mock-artist-5',
    spotify_id: '3T4tUhGYeRNVUGevb0wThu',
    name: 'Divide',
    release_type: 'album',
    release_date: '2024-02-05',
    spotify_url: 'https://open.spotify.com/album/3T4tUhGYeRNVUGevb0wThu',
    image_url: 'https://placehold.co/300x300/f97316/white?text=Divide',
    total_tracks: 12,
    external_urls: {
      spotify: 'https://open.spotify.com/album/3T4tUhGYeRNVUGevb0wThu'
    },
    artists: [
      {
        id: '6eUKZXaKkcviH0Ku9w2n3V',
        name: 'Ed Sheeran'
      }
    ],
    created_at: '2024-02-05T00:00:00.000Z'
  },
  {
    id: 'mock-release-6',
    artist_id: 'mock-artist-6',
    spotify_id: '6UXCm6bOO4gFlDQZV5yL37',
    name: 'Anti',
    release_type: 'album',
    release_date: '2024-02-10',
    spotify_url: 'https://open.spotify.com/album/6UXCm6bOO4gFlDQZV5yL37',
    image_url: 'https://placehold.co/300x300/ef4444/white?text=Anti',
    total_tracks: 13,
    external_urls: {
      spotify: 'https://open.spotify.com/album/6UXCm6bOO4gFlDQZV5yL37'
    },
    artists: [
      {
        id: '5pKCCKE2ajJHZ9KAiaK11H',
        name: 'Rihanna'
      }
    ],
    created_at: '2024-02-10T00:00:00.000Z'
  },
  {
    id: 'mock-release-7',
    artist_id: 'mock-artist-7',
    spotify_id: '4VZ7jhV0wvLaGIjcidRV8O',
    name: 'Music of the Spheres',
    release_type: 'album',
    release_date: '2024-02-12',
    spotify_url: 'https://open.spotify.com/album/4VZ7jhV0wvLaGIjcidRV8O',
    image_url: 'https://placehold.co/300x300/3b82f6/white?text=Music+of+the+Spheres',
    total_tracks: 12,
    external_urls: {
      spotify: 'https://open.spotify.com/album/4VZ7jhV0wvLaGIjcidRV8O'
    },
    artists: [
      {
        id: '4gzpq5DPGxSnKTe4SA8HAU',
        name: 'Coldplay'
      }
    ],
    created_at: '2024-02-12T00:00:00.000Z'
  },
  {
    id: 'mock-release-8',
    artist_id: 'mock-artist-8',
    spotify_id: '4eLPsYPBmXABThSJ821sqY',
    name: 'Mr. Morale & The Big Steppers',
    release_type: 'album',
    release_date: '2024-02-14',
    spotify_url: 'https://open.spotify.com/album/4eLPsYPBmXABThSJ821sqY',
    image_url: 'https://placehold.co/300x300/dc2626/white?text=Mr.+Morale',
    total_tracks: 18,
    external_urls: {
      spotify: 'https://open.spotify.com/album/4eLPsYPBmXABThSJ821sqY'
    },
    artists: [
      {
        id: '2YZyLoL8N0Wb9xBt1NhZWg',
        name: 'Kendrick Lamar'
      }
    ],
    created_at: '2024-02-14T00:00:00.000Z'
  },
  {
    id: 'mock-release-9',
    artist_id: 'mock-artist-9',
    spotify_id: '3RQQmkQEvNCY4prGKE6oc5',
    name: 'Un Verano Sin Ti',
    release_type: 'album',
    release_date: '2024-02-16',
    spotify_url: 'https://open.spotify.com/album/3RQQmkQEvNCY4prGKE6oc5',
    image_url: 'https://placehold.co/300x300/14b8a6/white?text=Un+Verano+Sin+Ti',
    total_tracks: 23,
    external_urls: {
      spotify: 'https://open.spotify.com/album/3RQQmkQEvNCY4prGKE6oc5'
    },
    artists: [
      {
        id: '4q3ewBCX7sLwd24euuV69X',
        name: 'Bad Bunny'
      }
    ],
    created_at: '2024-02-16T00:00:00.000Z'
  },
  {
    id: 'mock-release-10',
    artist_id: 'mock-artist-10',
    spotify_id: '5AEDGbliTTfjOB8TSm1sxt',
    name: 'Midnights',
    release_type: 'album',
    release_date: '2024-02-18',
    spotify_url: 'https://open.spotify.com/album/5AEDGbliTTfjOB8TSm1sxt',
    image_url: 'https://placehold.co/300x300/a855f7/white?text=Midnights',
    total_tracks: 13,
    external_urls: {
      spotify: 'https://open.spotify.com/album/5AEDGbliTTfjOB8TSm1sxt'
    },
    artists: [
      {
        id: '06HL4z0CvFAxyc27GXpf02',
        name: 'Taylor Swift'
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
