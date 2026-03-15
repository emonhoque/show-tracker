/**
 * DEMO MODE — Hardcoded fictional data for all entities.
 *
 * All artist names, show titles, venues, and user names are entirely fictional.
 * Image URLs use placeholder services via the image proxy.
 * Dates are spread across 2025–2026 so every section of the site has data.
 *
 * This file is the single source of truth for the "factory reset" state.
 * When a user refreshes the page, the runtime store re-seeds from here.
 */

import { Show, Artist, Release, RSVP, ShowArtist } from './types'
import { ShowCost } from './costs'

// Fixed demo clock — the demo always behaves as if it is this date,
// regardless of when the user actually views it.
export const DEMO_NOW = new Date('2026-03-15T12:00:00Z')
export const DEMO_NOW_ISO = DEMO_NOW.toISOString()
export const DEMO_YEAR = DEMO_NOW.getFullYear()

// ──────────────────────────────────────────────
// Stable IDs
// ──────────────────────────────────────────────

// Shows (S1–S6 past 2025-2026, S7–S12 upcoming, S13–S42 extra 2023-2026)
const S1 = '10000000-0000-0000-0000-000000000001'
const S2 = '10000000-0000-0000-0000-000000000002'
const S3 = '10000000-0000-0000-0000-000000000003'
const S4 = '10000000-0000-0000-0000-000000000004'
const S5 = '10000000-0000-0000-0000-000000000005'
const S6 = '10000000-0000-0000-0000-000000000006'
const S7 = '10000000-0000-0000-0000-000000000007'
const S8 = '10000000-0000-0000-0000-000000000008'
const S9 = '10000000-0000-0000-0000-000000000009'
const S10 = '10000000-0000-0000-0000-000000000010'
const S11 = '10000000-0000-0000-0000-000000000011'
const S12 = '10000000-0000-0000-0000-000000000012'
const S13 = '10000000-0000-0000-0000-000000000013'
const S14 = '10000000-0000-0000-0000-000000000014'
const S15 = '10000000-0000-0000-0000-000000000015'
const S16 = '10000000-0000-0000-0000-000000000016'
const S17 = '10000000-0000-0000-0000-000000000017'
const S18 = '10000000-0000-0000-0000-000000000018'
const S19 = '10000000-0000-0000-0000-000000000019'
const S20 = '10000000-0000-0000-0000-000000000020'
const S21 = '10000000-0000-0000-0000-000000000021'
const S22 = '10000000-0000-0000-0000-000000000022'
const S23 = '10000000-0000-0000-0000-000000000023'
const S24 = '10000000-0000-0000-0000-000000000024'
const S25 = '10000000-0000-0000-0000-000000000025'
const S26 = '10000000-0000-0000-0000-000000000026'
const S27 = '10000000-0000-0000-0000-000000000027'
const S28 = '10000000-0000-0000-0000-000000000028'
const S29 = '10000000-0000-0000-0000-000000000029'
const S30 = '10000000-0000-0000-0000-000000000030'
const S31 = '10000000-0000-0000-0000-000000000031'
const S32 = '10000000-0000-0000-0000-000000000032'
const S33 = '10000000-0000-0000-0000-000000000033'
const S34 = '10000000-0000-0000-0000-000000000034'
const S35 = '10000000-0000-0000-0000-000000000035'
const S36 = '10000000-0000-0000-0000-000000000036'
const S37 = '10000000-0000-0000-0000-000000000037'
const S38 = '10000000-0000-0000-0000-000000000038'
const S39 = '10000000-0000-0000-0000-000000000039'
const S40 = '10000000-0000-0000-0000-000000000040'
const S41 = '10000000-0000-0000-0000-000000000041'
const S42 = '10000000-0000-0000-0000-000000000042'

// Artists (10)
const A1 = '20000000-0000-0000-0000-000000000001'
const A2 = '20000000-0000-0000-0000-000000000002'
const A3 = '20000000-0000-0000-0000-000000000003'
const A4 = '20000000-0000-0000-0000-000000000004'
const A5 = '20000000-0000-0000-0000-000000000005'
const A6 = '20000000-0000-0000-0000-000000000006'
const A7 = '20000000-0000-0000-0000-000000000007'
const A8 = '20000000-0000-0000-0000-000000000008'
const A9 = '20000000-0000-0000-0000-000000000009'
const A10 = '20000000-0000-0000-0000-000000000010'

// Releases (10)
const R1 = '30000000-0000-0000-0000-000000000001'
const R2 = '30000000-0000-0000-0000-000000000002'
const R3 = '30000000-0000-0000-0000-000000000003'
const R4 = '30000000-0000-0000-0000-000000000004'
const R5 = '30000000-0000-0000-0000-000000000005'
const R6 = '30000000-0000-0000-0000-000000000006'
const R7 = '30000000-0000-0000-0000-000000000007'
const R8 = '30000000-0000-0000-0000-000000000008'
const R9 = '30000000-0000-0000-0000-000000000009'
const R10 = '30000000-0000-0000-0000-000000000010'

// Costs
const C1 = '40000000-0000-0000-0000-000000000001'
const C2 = '40000000-0000-0000-0000-000000000002'
const C3 = '40000000-0000-0000-0000-000000000003'
const C4 = '40000000-0000-0000-0000-000000000004'
const C5 = '40000000-0000-0000-0000-000000000005'
const C6 = '40000000-0000-0000-0000-000000000006'
const C7 = '40000000-0000-0000-0000-000000000007'
const C8 = '40000000-0000-0000-0000-000000000008'

// ──────────────────────────────────────────────
// Demo Users & Password
// ──────────────────────────────────────────────
export const DEMO_USERS = [
  'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson',
  'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Isabella Garcia',
]

export const DEMO_PASSWORD = 'demo'

// ──────────────────────────────────────────────
// Image helpers — inline SVG data URIs (no external fetch needed)
// ──────────────────────────────────────────────
function svgDataUri(w: number, h: number, color: string, label: string) {
  const escaped = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<rect width="100%" height="100%" fill="#${color}"/>` +
    `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ` +
    `fill="white" font-family="sans-serif" font-size="${Math.round(w / 10)}px" font-weight="bold">` +
    `${escaped}</text></svg>`
  return `data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, '%22')}`
}
const aImg = (color: string, name: string) => svgDataUri(300, 300, color, name)
const pImg = (color: string, name: string) => svgDataUri(600, 900, color, name)

// Artist → color mapping
const C = {
  nova: 'd97706', zephyr: '8b5cf6', lyra: 'ec4899', ember: '10b981',
  atlas: 'f97316', aria: 'ef4444', kairo: 'dc2626', solstice: '3b82f6',
  echo: '14b8a6', indigo: 'a855f7',
}

// ──────────────────────────────────────────────
// Artists
// ──────────────────────────────────────────────
export const DEMO_ARTISTS: Artist[] = [
  {
    id: A1, artist_name: 'Nova Kline', spotify_id: 'demo_nova_kline',
    spotify_url: 'https://open.spotify.com/artist/demo_nova_kline',
    image_url: aImg(C.nova, 'Nova Kline'),
    genres: ['pop', 'electropop', 'synth pop'], popularity: 95,
    followers_count: 118800000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z', created_by: 'alice johnson', is_active: true,
  },
  {
    id: A2, artist_name: 'Zephyr Vale', spotify_id: 'demo_zephyr_vale',
    spotify_url: 'https://open.spotify.com/artist/demo_zephyr_vale',
    image_url: aImg(C.zephyr, 'Zephyr Vale'),
    genres: ['pop', 'alternative r&b'], popularity: 95,
    followers_count: 113500000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-05T00:00:00Z', created_by: 'alice johnson', is_active: true,
  },
  {
    id: A3, artist_name: 'Lyra Monroe', spotify_id: 'demo_lyra_monroe',
    spotify_url: 'https://open.spotify.com/artist/demo_lyra_monroe',
    image_url: aImg(C.lyra, 'Lyra Monroe'),
    genres: ['pop', 'dance pop', 'electropop'], popularity: 92,
    followers_count: 108800000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-10T00:00:00Z', created_by: 'alice johnson', is_active: true,
  },
  {
    id: A4, artist_name: 'Ember Rae', spotify_id: 'demo_ember_rae',
    spotify_url: 'https://open.spotify.com/artist/demo_ember_rae',
    image_url: aImg(C.ember, 'Ember Rae'),
    genres: ['pop', 'alternative pop', 'indie pop'], popularity: 90,
    followers_count: 97900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-15T00:00:00Z', created_by: 'bob smith', is_active: true,
  },
  {
    id: A5, artist_name: 'Atlas Rook', spotify_id: 'demo_atlas_rook',
    spotify_url: 'https://open.spotify.com/artist/demo_atlas_rook',
    image_url: aImg(C.atlas, 'Atlas Rook'),
    genres: ['pop', 'singer-songwriter', 'acoustic'], popularity: 88,
    followers_count: 92900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-20T00:00:00Z', created_by: 'alice johnson', is_active: true,
  },
  {
    id: A6, artist_name: 'Aria Nightfall', spotify_id: 'demo_aria_nightfall',
    spotify_url: 'https://open.spotify.com/artist/demo_aria_nightfall',
    image_url: aImg(C.aria, 'Aria Nightfall'),
    genres: ['pop', 'r&b', 'dance'], popularity: 88,
    followers_count: 92900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-25T00:00:00Z', created_by: 'carol davis', is_active: true,
  },
  {
    id: A7, artist_name: 'Kairo Wolfe', spotify_id: 'demo_kairo_wolfe',
    spotify_url: 'https://open.spotify.com/artist/demo_kairo_wolfe',
    image_url: aImg(C.kairo, 'Kairo Wolfe'),
    genres: ['hip hop', 'rap', 'alternative hip hop'], popularity: 83,
    followers_count: 84400000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-01T00:00:00Z', created_by: 'david wilson', is_active: true,
  },
  {
    id: A8, artist_name: 'Solstice City', spotify_id: 'demo_solstice_city',
    spotify_url: 'https://open.spotify.com/artist/demo_solstice_city',
    image_url: aImg(C.solstice, 'Solstice City'),
    genres: ['alternative rock', 'pop rock', 'indie rock'], popularity: 85,
    followers_count: 92100000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-05T00:00:00Z', created_by: 'alice johnson', is_active: true,
  },
  {
    id: A9, artist_name: 'Echo Meridian', spotify_id: 'demo_echo_meridian',
    spotify_url: 'https://open.spotify.com/artist/demo_echo_meridian',
    image_url: aImg(C.echo, 'Echo Meridian'),
    genres: ['synthwave', 'electronic', 'retrowave'], popularity: 82,
    followers_count: 83100000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-10T00:00:00Z', created_by: 'emma brown', is_active: true,
  },
  {
    id: A10, artist_name: 'Indigo Harbor', spotify_id: 'demo_indigo_harbor',
    spotify_url: 'https://open.spotify.com/artist/demo_indigo_harbor',
    image_url: aImg(C.indigo, 'Indigo Harbor'),
    genres: ['folk', 'indie folk', 'singer-songwriter'], popularity: 80,
    followers_count: 82900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-15T00:00:00Z', created_by: 'grace lee', is_active: true,
  },
]

// ──────────────────────────────────────────────
// Show‑artist helper
// ──────────────────────────────────────────────
const sa = (name: string, position: ShowArtist['position'], color: string, spotifyId: string): ShowArtist => ({
  artist: name, position, image_url: aImg(color, name),
  spotify_id: spotifyId, spotify_url: `https://open.spotify.com/artist/${spotifyId}`,
})

// ──────────────────────────────────────────────
// Shows  (S1–S6 past · S7–S12 upcoming · S13–S42 extra 2023-2026)
// Dates relative to March 15 2026
// ──────────────────────────────────────────────
export const DEMO_SHOWS: Show[] = [
  // ── Past shows ──
  {
    id: S1,
    title: 'Echo Meridian - Northern Lines Tour',
    date_time: '2025-06-16T01:00:00Z', // Jun 15 2025, 9 PM ET
    time_local: '21:00',
    city: 'Boston',
    venue: 'Big Night Live',
    ticket_url: null,
    poster_url: pImg(C.echo, 'Echo Meridian'),
    notes: 'Synthwave showcase. Incredible energy.',
    show_artists: [sa('Echo Meridian', 'Headliner', C.echo, 'demo_echo_meridian')],
    created_at: '2025-05-01T00:00:00Z',
  },
  {
    id: S2,
    title: 'Indigo Harbor - Tide and Timber Tour',
    date_time: '2025-07-28T23:30:00Z', // Jul 28 2025, 7:30 PM ET
    time_local: '19:30',
    city: 'Boston',
    venue: 'Berklee Performance Center',
    ticket_url: null,
    poster_url: pImg(C.indigo, 'Indigo Harbor'),
    notes: 'Intimate acoustic performance. Sold out show.',
    show_artists: [sa('Indigo Harbor', 'Headliner', C.indigo, 'demo_indigo_harbor')],
    created_at: '2025-06-15T00:00:00Z',
  },
  {
    id: S3,
    title: 'Nova Kline - Starlight Sessions',
    date_time: '2025-09-06T00:00:00Z', // Sep 5 2025, 8 PM ET
    time_local: '20:00',
    city: 'Cambridge',
    venue: 'The Sinclair',
    ticket_url: null,
    poster_url: pImg(C.nova, 'Nova Kline'),
    notes: 'Intimate unplugged set. Only 200 capacity.',
    show_artists: [
      sa('Nova Kline', 'Headliner', C.nova, 'demo_nova_kline'),
      sa('Ember Rae', 'Support', C.ember, 'demo_ember_rae'),
    ],
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: S4,
    title: 'Aria Nightfall - Halloween Midnight Show',
    date_time: '2025-11-01T01:00:00Z', // Oct 31 2025, 9 PM ET
    time_local: '21:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: null,
    poster_url: pImg(C.aria, 'Aria Nightfall'),
    notes: 'Halloween special with costume contest.',
    show_artists: [
      sa('Aria Nightfall', 'Headliner', C.aria, 'demo_aria_nightfall'),
      sa('Kairo Wolfe', 'Support', C.kairo, 'demo_kairo_wolfe'),
    ],
    created_at: '2025-09-15T00:00:00Z',
  },
  {
    id: S5,
    title: 'Kairo Wolfe - City of Wolves Release',
    date_time: '2025-12-20T01:00:00Z', // Dec 19 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Brighton Music Hall',
    ticket_url: null,
    poster_url: pImg(C.kairo, 'Kairo Wolfe'),
    notes: 'Album release party. Exclusive merch drop.',
    show_artists: [sa('Kairo Wolfe', 'Headliner', C.kairo, 'demo_kairo_wolfe')],
    created_at: '2025-11-01T00:00:00Z',
  },
  {
    id: S6,
    title: 'Solstice City & Friends',
    date_time: '2026-01-25T01:00:00Z', // Jan 24 2026, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: null,
    poster_url: pImg(C.solstice, 'Solstice City'),
    notes: 'Multi-artist showcase. Three amazing sets.',
    show_artists: [
      sa('Solstice City', 'Headliner', C.solstice, 'demo_solstice_city'),
      sa('Nova Kline', 'Support', C.nova, 'demo_nova_kline'),
      sa('Atlas Rook', 'Local', C.atlas, 'demo_atlas_rook'),
    ],
    created_at: '2025-12-15T00:00:00Z',
  },

  // ── Upcoming shows ──
  {
    id: S7,
    title: 'Nova Kline - Electric Skies Tour',
    date_time: '2026-03-23T00:00:00Z', // Mar 22 2026, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'TD Garden',
    ticket_url: 'https://example.com/tickets/nova-kline',
    poster_url: pImg(C.nova, 'Nova Kline'),
    notes: 'Doors open at 7 PM. Opening act starts at 8 PM.',
    show_artists: [sa('Nova Kline', 'Headliner', C.nova, 'demo_nova_kline')],
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: S8,
    title: 'Zephyr Vale - Neon Eclipse Tour',
    date_time: '2026-04-22T23:30:00Z', // Apr 22 2026, 7:30 PM ET
    time_local: '19:30',
    city: 'Boston',
    venue: 'Agganis Arena',
    ticket_url: 'https://example.com/tickets/zephyr-vale',
    poster_url: pImg(C.zephyr, 'Zephyr Vale'),
    notes: 'All ages show. VIP meet and greet available.',
    show_artists: [sa('Zephyr Vale', 'Headliner', C.zephyr, 'demo_zephyr_vale')],
    created_at: '2026-02-10T00:00:00Z',
  },
  {
    id: S9,
    title: 'Lyra Monroe - Chromalune Tour',
    date_time: '2026-05-11T01:00:00Z', // May 10 2026, 9 PM ET
    time_local: '21:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: 'https://example.com/tickets/lyra-monroe',
    poster_url: pImg(C.lyra, 'Lyra Monroe'),
    notes: 'Standing room only. No re-entry.',
    show_artists: [
      sa('Lyra Monroe', 'Headliner', C.lyra, 'demo_lyra_monroe'),
      sa('Ember Rae', 'Support', C.ember, 'demo_ember_rae'),
    ],
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: S10,
    title: 'Atlas Rook - The Geometry Tour',
    date_time: '2026-06-06T00:30:00Z', // Jun 5 2026, 8:30 PM ET
    time_local: '20:30',
    city: 'Boston',
    venue: 'MGM Music Hall',
    ticket_url: 'https://example.com/tickets/atlas-rook',
    poster_url: pImg(C.atlas, 'Atlas Rook'),
    notes: 'Acoustic experience. Intimate venue.',
    show_artists: [sa('Atlas Rook', 'Headliner', C.atlas, 'demo_atlas_rook')],
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: S11,
    title: 'Aria Nightfall - Midnight Lanterns Tour',
    date_time: '2026-07-18T23:00:00Z', // Jul 18 2026, 7 PM ET
    time_local: '19:00',
    city: 'Boston',
    venue: 'Xfinity Center',
    ticket_url: 'https://example.com/tickets/aria-nightfall',
    poster_url: pImg(C.aria, 'Aria Nightfall'),
    notes: 'Outdoor venue. Rain or shine event.',
    show_artists: [
      sa('Aria Nightfall', 'Headliner', C.aria, 'demo_aria_nightfall'),
      sa('Kairo Wolfe', 'Support', C.kairo, 'demo_kairo_wolfe'),
    ],
    created_at: '2026-03-05T00:00:00Z',
  },
  {
    id: S12,
    title: 'Solstice City - Orbits Tour',
    date_time: '2026-08-13T00:00:00Z', // Aug 12 2026, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: 'https://example.com/tickets/solstice-city',
    poster_url: pImg(C.solstice, 'Solstice City'),
    notes: 'Spectacular light show. Environmentally conscious tour.',
    show_artists: [sa('Solstice City', 'Headliner', C.solstice, 'demo_solstice_city')],
    created_at: '2026-03-10T00:00:00Z',
  },

  // ── 2023 shows (all past) ──
  {
    id: S13,
    title: 'Nova Kline - First Light Tour',
    date_time: '2023-03-18T00:00:00Z', // Mar 17 2023, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Paradise Rock Club',
    ticket_url: null,
    poster_url: pImg(C.nova, 'Nova Kline'),
    notes: 'First time seeing Nova, incredible debut tour.',
    show_artists: [sa('Nova Kline', 'Headliner', C.nova, 'demo_nova_kline')],
    created_at: '2023-02-01T00:00:00Z',
  },
  {
    id: S14,
    title: 'Zephyr Vale - Velvet Haze Tour',
    date_time: '2023-05-13T00:00:00Z', // May 12 2023, 8 PM ET
    time_local: '20:00',
    city: 'Cambridge',
    venue: 'The Sinclair',
    ticket_url: null,
    poster_url: pImg(C.zephyr, 'Zephyr Vale'),
    notes: 'Small venue, amazing acoustics.',
    show_artists: [sa('Zephyr Vale', 'Headliner', C.zephyr, 'demo_zephyr_vale')],
    created_at: '2023-04-01T00:00:00Z',
  },
  {
    id: S15,
    title: 'Ember Rae - Wildflower Sessions',
    date_time: '2023-06-24T23:00:00Z', // Jun 24 2023, 7 PM ET
    time_local: '19:00',
    city: 'Somerville',
    venue: 'Crystal Ballroom',
    ticket_url: null,
    poster_url: pImg(C.ember, 'Ember Rae'),
    notes: 'Outdoor patio set. Perfect summer evening.',
    show_artists: [
      sa('Ember Rae', 'Headliner', C.ember, 'demo_ember_rae'),
      sa('Atlas Rook', 'Support', C.atlas, 'demo_atlas_rook'),
    ],
    created_at: '2023-05-15T00:00:00Z',
  },
  {
    id: S16,
    title: 'Kairo Wolfe - Raw Cuts Tour',
    date_time: '2023-07-22T01:00:00Z', // Jul 21 2023, 9 PM ET
    time_local: '21:00',
    city: 'Boston',
    venue: 'Brighton Music Hall',
    ticket_url: null,
    poster_url: pImg(C.kairo, 'Kairo Wolfe'),
    notes: 'Surprise guest appearance from Echo Meridian.',
    show_artists: [
      sa('Kairo Wolfe', 'Headliner', C.kairo, 'demo_kairo_wolfe'),
      sa('Echo Meridian', 'Support', C.echo, 'demo_echo_meridian'),
    ],
    created_at: '2023-06-10T00:00:00Z',
  },
  {
    id: S17,
    title: 'Aria Nightfall - Ember Glow Tour',
    date_time: '2023-09-09T00:00:00Z', // Sep 8 2023, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Royale',
    ticket_url: null,
    poster_url: pImg(C.aria, 'Aria Nightfall'),
    notes: 'Dance floor was packed all night.',
    show_artists: [sa('Aria Nightfall', 'Headliner', C.aria, 'demo_aria_nightfall')],
    created_at: '2023-08-01T00:00:00Z',
  },
  {
    id: S18,
    title: 'Solstice City - Signal Flare Tour',
    date_time: '2023-10-14T00:00:00Z', // Oct 13 2023, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: null,
    poster_url: pImg(C.solstice, 'Solstice City'),
    notes: 'Rock energy at its finest. Played three encores.',
    show_artists: [sa('Solstice City', 'Headliner', C.solstice, 'demo_solstice_city')],
    created_at: '2023-09-01T00:00:00Z',
  },
  {
    id: S19,
    title: 'Echo Meridian - Afterglow Sessions',
    date_time: '2023-11-11T01:00:00Z', // Nov 10 2023, 8 PM ET
    time_local: '20:00',
    city: 'Cambridge',
    venue: 'The Middle East',
    ticket_url: null,
    poster_url: pImg(C.echo, 'Echo Meridian'),
    notes: 'Synthwave night. Fog machines and laser lights.',
    show_artists: [sa('Echo Meridian', 'Headliner', C.echo, 'demo_echo_meridian')],
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: S20,
    title: 'Indigo Harbor - Driftwood Acoustic Tour',
    date_time: '2023-12-16T01:00:00Z', // Dec 15 2023, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Berklee Performance Center',
    ticket_url: null,
    poster_url: pImg(C.indigo, 'Indigo Harbor'),
    notes: 'Holiday special. Full string section joined for encore.',
    show_artists: [
      sa('Indigo Harbor', 'Headliner', C.indigo, 'demo_indigo_harbor'),
      sa('Atlas Rook', 'Support', C.atlas, 'demo_atlas_rook'),
    ],
    created_at: '2023-11-01T00:00:00Z',
  },

  // ── 2024 shows (all past) ──
  {
    id: S21,
    title: 'Nova Kline - Prism World Tour',
    date_time: '2024-01-27T01:00:00Z', // Jan 26 2024, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'TD Garden',
    ticket_url: null,
    poster_url: pImg(C.nova, 'Nova Kline'),
    notes: 'Arena show. First time at TD Garden. Mind-blowing production.',
    show_artists: [sa('Nova Kline', 'Headliner', C.nova, 'demo_nova_kline')],
    created_at: '2023-12-01T00:00:00Z',
  },
  {
    id: S22,
    title: 'Lyra Monroe - Moonrise Festival Set',
    date_time: '2024-03-09T01:00:00Z', // Mar 8 2024, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: null,
    poster_url: pImg(C.lyra, 'Lyra Monroe'),
    notes: 'Festival warm-up show. Debuted new unreleased tracks.',
    show_artists: [
      sa('Lyra Monroe', 'Headliner', C.lyra, 'demo_lyra_monroe'),
      sa('Aria Nightfall', 'Support', C.aria, 'demo_aria_nightfall'),
    ],
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: S23,
    title: 'Atlas Rook - Campfire Stories Tour',
    date_time: '2024-04-20T00:00:00Z', // Apr 19 2024, 8 PM ET
    time_local: '20:00',
    city: 'Somerville',
    venue: 'Crystal Ballroom',
    ticket_url: null,
    poster_url: pImg(C.atlas, 'Atlas Rook'),
    notes: 'Stripped-back acoustic set. Storytelling between songs.',
    show_artists: [sa('Atlas Rook', 'Headliner', C.atlas, 'demo_atlas_rook')],
    created_at: '2024-03-15T00:00:00Z',
  },
  {
    id: S24,
    title: 'Kairo Wolfe & Zephyr Vale - Dual Headline',
    date_time: '2024-05-25T00:00:00Z', // May 24 2024, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: null,
    poster_url: pImg(C.kairo, 'Kairo Wolfe'),
    notes: 'Co-headliner. Traded songs back and forth.',
    show_artists: [
      sa('Kairo Wolfe', 'Headliner', C.kairo, 'demo_kairo_wolfe'),
      sa('Zephyr Vale', 'Headliner', C.zephyr, 'demo_zephyr_vale'),
    ],
    created_at: '2024-04-15T00:00:00Z',
  },
  {
    id: S25,
    title: 'Ember Rae - Summer Solstice Show',
    date_time: '2024-06-22T00:00:00Z', // Jun 21 2024, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Leader Bank Pavilion',
    ticket_url: null,
    poster_url: pImg(C.ember, 'Ember Rae'),
    notes: 'Sunset set on the waterfront. Perfect weather.',
    show_artists: [
      sa('Ember Rae', 'Headliner', C.ember, 'demo_ember_rae'),
      sa('Indigo Harbor', 'Support', C.indigo, 'demo_indigo_harbor'),
    ],
    created_at: '2024-05-15T00:00:00Z',
  },
  {
    id: S26,
    title: 'Solstice City - Black Hole Summer Tour',
    date_time: '2024-07-20T00:00:00Z', // Jul 19 2024, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'MGM Music Hall',
    ticket_url: null,
    poster_url: pImg(C.solstice, 'Solstice City'),
    notes: 'Massive light rig. Best production I have seen.',
    show_artists: [sa('Solstice City', 'Headliner', C.solstice, 'demo_solstice_city')],
    created_at: '2024-06-15T00:00:00Z',
  },
  {
    id: S27,
    title: 'Echo Meridian - Neon Nights Festival',
    date_time: '2024-08-31T01:00:00Z', // Aug 30 2024, 9 PM ET
    time_local: '21:00',
    city: 'Boston',
    venue: 'Big Night Live',
    ticket_url: null,
    poster_url: pImg(C.echo, 'Echo Meridian'),
    notes: 'Late-night set. Full visual experience with projections.',
    show_artists: [
      sa('Echo Meridian', 'Headliner', C.echo, 'demo_echo_meridian'),
      sa('Lyra Monroe', 'Support', C.lyra, 'demo_lyra_monroe'),
    ],
    created_at: '2024-07-20T00:00:00Z',
  },
  {
    id: S28,
    title: 'Aria Nightfall - Velvet Nights Tour',
    date_time: '2024-10-19T00:00:00Z', // Oct 18 2024, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Royale',
    ticket_url: null,
    poster_url: pImg(C.aria, 'Aria Nightfall'),
    notes: 'Fall tour. Moody lighting and incredible vocals.',
    show_artists: [sa('Aria Nightfall', 'Headliner', C.aria, 'demo_aria_nightfall')],
    created_at: '2024-09-10T00:00:00Z',
  },

  // ── Additional 2025 shows (past) ──
  {
    id: S29,
    title: 'Zephyr Vale - Parallax Tour',
    date_time: '2025-01-18T01:00:00Z', // Jan 17 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Agganis Arena',
    ticket_url: null,
    poster_url: pImg(C.zephyr, 'Zephyr Vale'),
    notes: 'Winter tour kickoff. Snow outside, heat inside.',
    show_artists: [sa('Zephyr Vale', 'Headliner', C.zephyr, 'demo_zephyr_vale')],
    created_at: '2024-12-01T00:00:00Z',
  },
  {
    id: S30,
    title: 'Lyra Monroe - Dreamstate Sessions',
    date_time: '2025-02-15T01:00:00Z', // Feb 14 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: null,
    poster_url: pImg(C.lyra, 'Lyra Monroe'),
    notes: 'Valentine\'s Day show. Beautiful setlist.',
    show_artists: [
      sa('Lyra Monroe', 'Headliner', C.lyra, 'demo_lyra_monroe'),
      sa('Nova Kline', 'Support', C.nova, 'demo_nova_kline'),
    ],
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: S31,
    title: 'Atlas Rook - Canyon Echoes Tour',
    date_time: '2025-03-22T00:00:00Z', // Mar 21 2025, 8 PM ET
    time_local: '20:00',
    city: 'Cambridge',
    venue: 'The Sinclair',
    ticket_url: null,
    poster_url: pImg(C.atlas, 'Atlas Rook'),
    notes: 'Tiny venue for a now-massive artist. Lucky to get tickets.',
    show_artists: [sa('Atlas Rook', 'Headliner', C.atlas, 'demo_atlas_rook')],
    created_at: '2025-02-10T00:00:00Z',
  },
  {
    id: S32,
    title: 'Indigo Harbor - Sea Glass Tour',
    date_time: '2025-04-12T00:00:00Z', // Apr 11 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Paradise Rock Club',
    ticket_url: null,
    poster_url: pImg(C.indigo, 'Indigo Harbor'),
    notes: 'Spring tour. Played the entire new album front to back.',
    show_artists: [sa('Indigo Harbor', 'Headliner', C.indigo, 'demo_indigo_harbor')],
    created_at: '2025-03-01T00:00:00Z',
  },
  {
    id: S33,
    title: 'Nova Kline & Ember Rae - Double Feature',
    date_time: '2025-05-10T00:00:00Z', // May 9 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: null,
    poster_url: pImg(C.nova, 'Nova Kline'),
    notes: 'Co-headline show. Best of both worlds.',
    show_artists: [
      sa('Nova Kline', 'Headliner', C.nova, 'demo_nova_kline'),
      sa('Ember Rae', 'Headliner', C.ember, 'demo_ember_rae'),
    ],
    created_at: '2025-04-01T00:00:00Z',
  },
  {
    id: S34,
    title: 'Kairo Wolfe - Street Poet Tour',
    date_time: '2025-08-02T00:00:00Z', // Aug 1 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Big Night Live',
    ticket_url: null,
    poster_url: pImg(C.kairo, 'Kairo Wolfe'),
    notes: 'High energy hip hop. Crowd was insane.',
    show_artists: [sa('Kairo Wolfe', 'Headliner', C.kairo, 'demo_kairo_wolfe')],
    created_at: '2025-07-01T00:00:00Z',
  },
  {
    id: S35,
    title: 'Aria Nightfall - Lunar Eclipse Tour',
    date_time: '2025-10-04T00:00:00Z', // Oct 3 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: null,
    poster_url: pImg(C.aria, 'Aria Nightfall'),
    notes: 'Dramatic stage design. She descended from the ceiling.',
    show_artists: [
      sa('Aria Nightfall', 'Headliner', C.aria, 'demo_aria_nightfall'),
      sa('Echo Meridian', 'Support', C.echo, 'demo_echo_meridian'),
    ],
    created_at: '2025-09-01T00:00:00Z',
  },
  {
    id: S36,
    title: 'Solstice City - Voltage Tour',
    date_time: '2025-11-15T01:00:00Z', // Nov 14 2025, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'MGM Music Hall',
    ticket_url: null,
    poster_url: pImg(C.solstice, 'Solstice City'),
    notes: 'Power went out mid-set, they played unplugged!',
    show_artists: [sa('Solstice City', 'Headliner', C.solstice, 'demo_solstice_city')],
    created_at: '2025-10-01T00:00:00Z',
  },

  // ── Additional 2026 shows (past & upcoming) ──
  {
    id: S37,
    title: 'Lyra Monroe - Gravity Tour',
    date_time: '2026-01-10T01:00:00Z', // Jan 9 2026, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Royale',
    ticket_url: null,
    poster_url: pImg(C.lyra, 'Lyra Monroe'),
    notes: 'New Year tour. Full band plus backup dancers.',
    show_artists: [sa('Lyra Monroe', 'Headliner', C.lyra, 'demo_lyra_monroe')],
    created_at: '2025-12-01T00:00:00Z',
  },
  {
    id: S38,
    title: 'Echo Meridian - Waveform Tour',
    date_time: '2026-02-07T01:00:00Z', // Feb 6 2026, 8 PM ET
    time_local: '20:00',
    city: 'Cambridge',
    venue: 'The Middle East',
    ticket_url: null,
    poster_url: pImg(C.echo, 'Echo Meridian'),
    notes: 'Intimate basement show. Only 150 people.',
    show_artists: [sa('Echo Meridian', 'Headliner', C.echo, 'demo_echo_meridian')],
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: S39,
    title: 'Indigo Harbor - Coastal Highway Tour',
    date_time: '2026-02-28T01:00:00Z', // Feb 27 2026, 8 PM ET
    time_local: '20:00',
    city: 'Boston',
    venue: 'Berklee Performance Center',
    ticket_url: null,
    poster_url: pImg(C.indigo, 'Indigo Harbor'),
    notes: 'Full orchestral accompaniment. Breathtaking.',
    show_artists: [sa('Indigo Harbor', 'Headliner', C.indigo, 'demo_indigo_harbor')],
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: S40,
    title: 'Ember Rae - Wildfire Tour',
    date_time: '2026-04-04T00:00:00Z', // Apr 3 2026, 8 PM ET (upcoming)
    time_local: '20:00',
    city: 'Boston',
    venue: 'Paradise Rock Club',
    ticket_url: 'https://example.com/tickets/ember-wildfire',
    poster_url: pImg(C.ember, 'Ember Rae'),
    notes: 'Spring tour. On sale now.',
    show_artists: [
      sa('Ember Rae', 'Headliner', C.ember, 'demo_ember_rae'),
      sa('Indigo Harbor', 'Support', C.indigo, 'demo_indigo_harbor'),
    ],
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: S41,
    title: 'Kairo Wolfe - Crown Tour',
    date_time: '2026-05-02T00:00:00Z', // May 1 2026, 8 PM ET (upcoming)
    time_local: '20:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: 'https://example.com/tickets/kairo-crown',
    poster_url: pImg(C.kairo, 'Kairo Wolfe'),
    notes: 'Album release tour. Pre-sale sold out in minutes.',
    show_artists: [sa('Kairo Wolfe', 'Headliner', C.kairo, 'demo_kairo_wolfe')],
    created_at: '2026-03-10T00:00:00Z',
  },
  {
    id: S42,
    title: 'Zephyr Vale - Aurora Tour',
    date_time: '2026-06-20T00:00:00Z', // Jun 19 2026, 8 PM ET (upcoming)
    time_local: '20:00',
    city: 'Boston',
    venue: 'Leader Bank Pavilion',
    ticket_url: 'https://example.com/tickets/zephyr-aurora',
    poster_url: pImg(C.zephyr, 'Zephyr Vale'),
    notes: 'Outdoor summer show. Can not wait.',
    show_artists: [
      sa('Zephyr Vale', 'Headliner', C.zephyr, 'demo_zephyr_vale'),
      sa('Lyra Monroe', 'Support', C.lyra, 'demo_lyra_monroe'),
    ],
    created_at: '2026-03-12T00:00:00Z',
  },
]

// ──────────────────────────────────────────────
// RSVPs
// ──────────────────────────────────────────────
export const DEMO_RSVPS: RSVP[] = [
  // S1 — Echo Meridian (past)
  { show_id: S1, name: 'alice johnson', status: 'going', updated_at: '2025-06-10T00:00:00Z' },
  { show_id: S1, name: 'bob smith', status: 'going', updated_at: '2025-06-10T00:00:00Z' },
  { show_id: S1, name: 'carol davis', status: 'going', updated_at: '2025-06-11T00:00:00Z' },
  { show_id: S1, name: 'emma brown', status: 'maybe', updated_at: '2025-06-12T00:00:00Z' },
  { show_id: S1, name: 'david wilson', status: 'not_going', updated_at: '2025-06-11T00:00:00Z' },
  { show_id: S1, name: 'frank miller', status: 'not_going', updated_at: '2025-06-12T00:00:00Z' },

  // S2 — Indigo Harbor (past)
  { show_id: S2, name: 'grace lee', status: 'going', updated_at: '2025-07-20T00:00:00Z' },
  { show_id: S2, name: 'henry taylor', status: 'going', updated_at: '2025-07-21T00:00:00Z' },
  { show_id: S2, name: 'isabella garcia', status: 'going', updated_at: '2025-07-22T00:00:00Z' },
  { show_id: S2, name: 'alice johnson', status: 'maybe', updated_at: '2025-07-23T00:00:00Z' },
  { show_id: S2, name: 'bob smith', status: 'not_going', updated_at: '2025-07-20T00:00:00Z' },
  { show_id: S2, name: 'carol davis', status: 'not_going', updated_at: '2025-07-21T00:00:00Z' },

  // S3 — Nova Kline Starlight (past)
  { show_id: S3, name: 'alice johnson', status: 'going', updated_at: '2025-08-28T00:00:00Z' },
  { show_id: S3, name: 'carol davis', status: 'going', updated_at: '2025-08-29T00:00:00Z' },
  { show_id: S3, name: 'david wilson', status: 'going', updated_at: '2025-08-30T00:00:00Z' },
  { show_id: S3, name: 'emma brown', status: 'going', updated_at: '2025-08-31T00:00:00Z' },
  { show_id: S3, name: 'frank miller', status: 'maybe', updated_at: '2025-09-01T00:00:00Z' },
  { show_id: S3, name: 'bob smith', status: 'not_going', updated_at: '2025-08-28T00:00:00Z' },

  // S4 — Aria Nightfall Halloween (past)
  { show_id: S4, name: 'alice johnson', status: 'going', updated_at: '2025-10-20T00:00:00Z' },
  { show_id: S4, name: 'bob smith', status: 'going', updated_at: '2025-10-21T00:00:00Z' },
  { show_id: S4, name: 'emma brown', status: 'going', updated_at: '2025-10-22T00:00:00Z' },
  { show_id: S4, name: 'frank miller', status: 'going', updated_at: '2025-10-23T00:00:00Z' },
  { show_id: S4, name: 'grace lee', status: 'going', updated_at: '2025-10-24T00:00:00Z' },
  { show_id: S4, name: 'david wilson', status: 'maybe', updated_at: '2025-10-25T00:00:00Z' },
  { show_id: S4, name: 'carol davis', status: 'not_going', updated_at: '2025-10-20T00:00:00Z' },

  // S5 — Kairo Wolfe Release (past)
  { show_id: S5, name: 'alice johnson', status: 'going', updated_at: '2025-12-10T00:00:00Z' },
  { show_id: S5, name: 'carol davis', status: 'going', updated_at: '2025-12-11T00:00:00Z' },
  { show_id: S5, name: 'bob smith', status: 'maybe', updated_at: '2025-12-12T00:00:00Z' },
  { show_id: S5, name: 'david wilson', status: 'not_going', updated_at: '2025-12-10T00:00:00Z' },

  // S6 — Solstice City & Friends (past)
  { show_id: S6, name: 'alice johnson', status: 'going', updated_at: '2026-01-15T00:00:00Z' },
  { show_id: S6, name: 'emma brown', status: 'going', updated_at: '2026-01-16T00:00:00Z' },
  { show_id: S6, name: 'grace lee', status: 'going', updated_at: '2026-01-17T00:00:00Z' },
  { show_id: S6, name: 'bob smith', status: 'maybe', updated_at: '2026-01-18T00:00:00Z' },
  { show_id: S6, name: 'carol davis', status: 'maybe', updated_at: '2026-01-19T00:00:00Z' },
  { show_id: S6, name: 'frank miller', status: 'not_going', updated_at: '2026-01-15T00:00:00Z' },

  // S7 — Nova Kline Electric Skies (upcoming)
  { show_id: S7, name: 'alice johnson', status: 'going', updated_at: '2026-03-01T00:00:00Z' },
  { show_id: S7, name: 'bob smith', status: 'going', updated_at: '2026-03-02T00:00:00Z' },
  { show_id: S7, name: 'carol davis', status: 'going', updated_at: '2026-03-03T00:00:00Z' },
  { show_id: S7, name: 'david wilson', status: 'going', updated_at: '2026-03-04T00:00:00Z' },
  { show_id: S7, name: 'emma brown', status: 'maybe', updated_at: '2026-03-05T00:00:00Z' },
  { show_id: S7, name: 'frank miller', status: 'maybe', updated_at: '2026-03-06T00:00:00Z' },
  { show_id: S7, name: 'grace lee', status: 'not_going', updated_at: '2026-03-01T00:00:00Z' },

  // S8 — Zephyr Vale Neon Eclipse (upcoming)
  { show_id: S8, name: 'alice johnson', status: 'going', updated_at: '2026-03-05T00:00:00Z' },
  { show_id: S8, name: 'emma brown', status: 'going', updated_at: '2026-03-06T00:00:00Z' },
  { show_id: S8, name: 'henry taylor', status: 'going', updated_at: '2026-03-07T00:00:00Z' },
  { show_id: S8, name: 'bob smith', status: 'maybe', updated_at: '2026-03-08T00:00:00Z' },
  { show_id: S8, name: 'isabella garcia', status: 'maybe', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S8, name: 'carol davis', status: 'not_going', updated_at: '2026-03-05T00:00:00Z' },
  { show_id: S8, name: 'frank miller', status: 'not_going', updated_at: '2026-03-06T00:00:00Z' },

  // S9 — Lyra Monroe Chromalune (upcoming)
  { show_id: S9, name: 'bob smith', status: 'going', updated_at: '2026-03-07T00:00:00Z' },
  { show_id: S9, name: 'carol davis', status: 'going', updated_at: '2026-03-08T00:00:00Z' },
  { show_id: S9, name: 'david wilson', status: 'going', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S9, name: 'emma brown', status: 'going', updated_at: '2026-03-10T00:00:00Z' },
  { show_id: S9, name: 'frank miller', status: 'going', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S9, name: 'grace lee', status: 'maybe', updated_at: '2026-03-07T00:00:00Z' },
  { show_id: S9, name: 'alice johnson', status: 'not_going', updated_at: '2026-03-08T00:00:00Z' },

  // S10 — Atlas Rook Geometry (upcoming)
  { show_id: S10, name: 'alice johnson', status: 'going', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S10, name: 'grace lee', status: 'going', updated_at: '2026-03-10T00:00:00Z' },
  { show_id: S10, name: 'henry taylor', status: 'going', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S10, name: 'bob smith', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S10, name: 'carol davis', status: 'maybe', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S10, name: 'david wilson', status: 'not_going', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S10, name: 'emma brown', status: 'not_going', updated_at: '2026-03-10T00:00:00Z' },

  // S11 — Aria Nightfall Midnight Lanterns (upcoming)
  { show_id: S11, name: 'david wilson', status: 'going', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S11, name: 'emma brown', status: 'going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S11, name: 'frank miller', status: 'going', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S11, name: 'grace lee', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S11, name: 'isabella garcia', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S11, name: 'alice johnson', status: 'maybe', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S11, name: 'bob smith', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S11, name: 'carol davis', status: 'not_going', updated_at: '2026-03-11T00:00:00Z' },

  // S12 — Solstice City Orbits (upcoming)
  { show_id: S12, name: 'carol davis', status: 'going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S12, name: 'emma brown', status: 'going', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S12, name: 'grace lee', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S12, name: 'alice johnson', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S12, name: 'david wilson', status: 'maybe', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S12, name: 'bob smith', status: 'not_going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S12, name: 'frank miller', status: 'not_going', updated_at: '2026-03-13T00:00:00Z' },

  // S13 — Nova Kline First Light 2023
  { show_id: S13, name: 'alice johnson', status: 'going', updated_at: '2023-03-10T00:00:00Z' },
  { show_id: S13, name: 'bob smith', status: 'going', updated_at: '2023-03-11T00:00:00Z' },
  { show_id: S13, name: 'carol davis', status: 'going', updated_at: '2023-03-12T00:00:00Z' },
  { show_id: S13, name: 'emma brown', status: 'maybe', updated_at: '2023-03-13T00:00:00Z' },

  // S14 — Zephyr Vale Velvet Haze 2023
  { show_id: S14, name: 'alice johnson', status: 'going', updated_at: '2023-05-01T00:00:00Z' },
  { show_id: S14, name: 'david wilson', status: 'going', updated_at: '2023-05-02T00:00:00Z' },
  { show_id: S14, name: 'grace lee', status: 'going', updated_at: '2023-05-03T00:00:00Z' },
  { show_id: S14, name: 'bob smith', status: 'not_going', updated_at: '2023-05-01T00:00:00Z' },

  // S15 — Ember Rae Wildflower 2023
  { show_id: S15, name: 'alice johnson', status: 'going', updated_at: '2023-06-15T00:00:00Z' },
  { show_id: S15, name: 'carol davis', status: 'going', updated_at: '2023-06-16T00:00:00Z' },
  { show_id: S15, name: 'emma brown', status: 'going', updated_at: '2023-06-17T00:00:00Z' },
  { show_id: S15, name: 'frank miller', status: 'going', updated_at: '2023-06-18T00:00:00Z' },
  { show_id: S15, name: 'bob smith', status: 'maybe', updated_at: '2023-06-15T00:00:00Z' },

  // S16 — Kairo Wolfe Raw Cuts 2023
  { show_id: S16, name: 'bob smith', status: 'going', updated_at: '2023-07-10T00:00:00Z' },
  { show_id: S16, name: 'david wilson', status: 'going', updated_at: '2023-07-11T00:00:00Z' },
  { show_id: S16, name: 'alice johnson', status: 'going', updated_at: '2023-07-12T00:00:00Z' },
  { show_id: S16, name: 'henry taylor', status: 'maybe', updated_at: '2023-07-10T00:00:00Z' },

  // S17 — Aria Nightfall Ember Glow 2023
  { show_id: S17, name: 'alice johnson', status: 'going', updated_at: '2023-08-25T00:00:00Z' },
  { show_id: S17, name: 'emma brown', status: 'going', updated_at: '2023-08-26T00:00:00Z' },
  { show_id: S17, name: 'grace lee', status: 'going', updated_at: '2023-08-27T00:00:00Z' },
  { show_id: S17, name: 'carol davis', status: 'maybe', updated_at: '2023-08-25T00:00:00Z' },
  { show_id: S17, name: 'frank miller', status: 'not_going', updated_at: '2023-08-26T00:00:00Z' },

  // S18 — Solstice City Signal Flare 2023
  { show_id: S18, name: 'alice johnson', status: 'going', updated_at: '2023-10-01T00:00:00Z' },
  { show_id: S18, name: 'bob smith', status: 'going', updated_at: '2023-10-02T00:00:00Z' },
  { show_id: S18, name: 'david wilson', status: 'going', updated_at: '2023-10-03T00:00:00Z' },
  { show_id: S18, name: 'emma brown', status: 'going', updated_at: '2023-10-04T00:00:00Z' },
  { show_id: S18, name: 'carol davis', status: 'not_going', updated_at: '2023-10-01T00:00:00Z' },

  // S19 — Echo Meridian Afterglow 2023
  { show_id: S19, name: 'alice johnson', status: 'going', updated_at: '2023-11-01T00:00:00Z' },
  { show_id: S19, name: 'emma brown', status: 'going', updated_at: '2023-11-02T00:00:00Z' },
  { show_id: S19, name: 'henry taylor', status: 'going', updated_at: '2023-11-03T00:00:00Z' },
  { show_id: S19, name: 'bob smith', status: 'maybe', updated_at: '2023-11-01T00:00:00Z' },
  { show_id: S19, name: 'grace lee', status: 'not_going', updated_at: '2023-11-02T00:00:00Z' },

  // S20 — Indigo Harbor Driftwood 2023
  { show_id: S20, name: 'alice johnson', status: 'going', updated_at: '2023-12-05T00:00:00Z' },
  { show_id: S20, name: 'grace lee', status: 'going', updated_at: '2023-12-06T00:00:00Z' },
  { show_id: S20, name: 'isabella garcia', status: 'going', updated_at: '2023-12-07T00:00:00Z' },
  { show_id: S20, name: 'carol davis', status: 'going', updated_at: '2023-12-08T00:00:00Z' },
  { show_id: S20, name: 'bob smith', status: 'maybe', updated_at: '2023-12-05T00:00:00Z' },

  // S21 — Nova Kline Prism 2024
  { show_id: S21, name: 'alice johnson', status: 'going', updated_at: '2024-01-15T00:00:00Z' },
  { show_id: S21, name: 'bob smith', status: 'going', updated_at: '2024-01-16T00:00:00Z' },
  { show_id: S21, name: 'carol davis', status: 'going', updated_at: '2024-01-17T00:00:00Z' },
  { show_id: S21, name: 'david wilson', status: 'going', updated_at: '2024-01-18T00:00:00Z' },
  { show_id: S21, name: 'emma brown', status: 'going', updated_at: '2024-01-19T00:00:00Z' },
  { show_id: S21, name: 'frank miller', status: 'maybe', updated_at: '2024-01-15T00:00:00Z' },

  // S22 — Lyra Monroe Moonrise 2024
  { show_id: S22, name: 'alice johnson', status: 'going', updated_at: '2024-02-25T00:00:00Z' },
  { show_id: S22, name: 'emma brown', status: 'going', updated_at: '2024-02-26T00:00:00Z' },
  { show_id: S22, name: 'frank miller', status: 'going', updated_at: '2024-02-27T00:00:00Z' },
  { show_id: S22, name: 'grace lee', status: 'going', updated_at: '2024-02-28T00:00:00Z' },
  { show_id: S22, name: 'bob smith', status: 'not_going', updated_at: '2024-02-25T00:00:00Z' },

  // S23 — Atlas Rook Campfire 2024
  { show_id: S23, name: 'alice johnson', status: 'going', updated_at: '2024-04-10T00:00:00Z' },
  { show_id: S23, name: 'grace lee', status: 'going', updated_at: '2024-04-11T00:00:00Z' },
  { show_id: S23, name: 'henry taylor', status: 'going', updated_at: '2024-04-12T00:00:00Z' },
  { show_id: S23, name: 'david wilson', status: 'maybe', updated_at: '2024-04-10T00:00:00Z' },

  // S24 — Kairo & Zephyr Dual Headline 2024
  { show_id: S24, name: 'alice johnson', status: 'going', updated_at: '2024-05-15T00:00:00Z' },
  { show_id: S24, name: 'bob smith', status: 'going', updated_at: '2024-05-16T00:00:00Z' },
  { show_id: S24, name: 'david wilson', status: 'going', updated_at: '2024-05-17T00:00:00Z' },
  { show_id: S24, name: 'emma brown', status: 'going', updated_at: '2024-05-18T00:00:00Z' },
  { show_id: S24, name: 'frank miller', status: 'going', updated_at: '2024-05-19T00:00:00Z' },
  { show_id: S24, name: 'carol davis', status: 'maybe', updated_at: '2024-05-15T00:00:00Z' },
  { show_id: S24, name: 'grace lee', status: 'not_going', updated_at: '2024-05-16T00:00:00Z' },

  // S25 — Ember Rae Summer Solstice 2024
  { show_id: S25, name: 'alice johnson', status: 'going', updated_at: '2024-06-10T00:00:00Z' },
  { show_id: S25, name: 'carol davis', status: 'going', updated_at: '2024-06-11T00:00:00Z' },
  { show_id: S25, name: 'emma brown', status: 'going', updated_at: '2024-06-12T00:00:00Z' },
  { show_id: S25, name: 'bob smith', status: 'maybe', updated_at: '2024-06-10T00:00:00Z' },
  { show_id: S25, name: 'david wilson', status: 'not_going', updated_at: '2024-06-11T00:00:00Z' },

  // S26 — Solstice City Black Hole Summer 2024
  { show_id: S26, name: 'alice johnson', status: 'going', updated_at: '2024-07-10T00:00:00Z' },
  { show_id: S26, name: 'bob smith', status: 'going', updated_at: '2024-07-11T00:00:00Z' },
  { show_id: S26, name: 'david wilson', status: 'going', updated_at: '2024-07-12T00:00:00Z' },
  { show_id: S26, name: 'frank miller', status: 'going', updated_at: '2024-07-13T00:00:00Z' },
  { show_id: S26, name: 'emma brown', status: 'maybe', updated_at: '2024-07-10T00:00:00Z' },
  { show_id: S26, name: 'carol davis', status: 'not_going', updated_at: '2024-07-11T00:00:00Z' },

  // S27 — Echo Meridian Neon Nights 2024
  { show_id: S27, name: 'alice johnson', status: 'going', updated_at: '2024-08-20T00:00:00Z' },
  { show_id: S27, name: 'emma brown', status: 'going', updated_at: '2024-08-21T00:00:00Z' },
  { show_id: S27, name: 'henry taylor', status: 'going', updated_at: '2024-08-22T00:00:00Z' },
  { show_id: S27, name: 'isabella garcia', status: 'going', updated_at: '2024-08-23T00:00:00Z' },
  { show_id: S27, name: 'bob smith', status: 'not_going', updated_at: '2024-08-20T00:00:00Z' },

  // S28 — Aria Nightfall Velvet Nights 2024
  { show_id: S28, name: 'alice johnson', status: 'going', updated_at: '2024-10-08T00:00:00Z' },
  { show_id: S28, name: 'bob smith', status: 'going', updated_at: '2024-10-09T00:00:00Z' },
  { show_id: S28, name: 'carol davis', status: 'going', updated_at: '2024-10-10T00:00:00Z' },
  { show_id: S28, name: 'frank miller', status: 'maybe', updated_at: '2024-10-08T00:00:00Z' },
  { show_id: S28, name: 'emma brown', status: 'not_going', updated_at: '2024-10-09T00:00:00Z' },

  // S29 — Zephyr Vale Parallax 2025
  { show_id: S29, name: 'alice johnson', status: 'going', updated_at: '2025-01-08T00:00:00Z' },
  { show_id: S29, name: 'bob smith', status: 'going', updated_at: '2025-01-09T00:00:00Z' },
  { show_id: S29, name: 'david wilson', status: 'going', updated_at: '2025-01-10T00:00:00Z' },
  { show_id: S29, name: 'grace lee', status: 'going', updated_at: '2025-01-11T00:00:00Z' },
  { show_id: S29, name: 'carol davis', status: 'maybe', updated_at: '2025-01-08T00:00:00Z' },

  // S30 — Lyra Monroe Dreamstate 2025
  { show_id: S30, name: 'alice johnson', status: 'going', updated_at: '2025-02-05T00:00:00Z' },
  { show_id: S30, name: 'carol davis', status: 'going', updated_at: '2025-02-06T00:00:00Z' },
  { show_id: S30, name: 'emma brown', status: 'going', updated_at: '2025-02-07T00:00:00Z' },
  { show_id: S30, name: 'frank miller', status: 'going', updated_at: '2025-02-08T00:00:00Z' },
  { show_id: S30, name: 'henry taylor', status: 'going', updated_at: '2025-02-09T00:00:00Z' },
  { show_id: S30, name: 'bob smith', status: 'not_going', updated_at: '2025-02-05T00:00:00Z' },

  // S31 — Atlas Rook Canyon Echoes 2025
  { show_id: S31, name: 'alice johnson', status: 'going', updated_at: '2025-03-12T00:00:00Z' },
  { show_id: S31, name: 'grace lee', status: 'going', updated_at: '2025-03-13T00:00:00Z' },
  { show_id: S31, name: 'bob smith', status: 'maybe', updated_at: '2025-03-12T00:00:00Z' },
  { show_id: S31, name: 'carol davis', status: 'not_going', updated_at: '2025-03-13T00:00:00Z' },

  // S32 — Indigo Harbor Sea Glass 2025
  { show_id: S32, name: 'alice johnson', status: 'going', updated_at: '2025-04-01T00:00:00Z' },
  { show_id: S32, name: 'grace lee', status: 'going', updated_at: '2025-04-02T00:00:00Z' },
  { show_id: S32, name: 'isabella garcia', status: 'going', updated_at: '2025-04-03T00:00:00Z' },
  { show_id: S32, name: 'emma brown', status: 'maybe', updated_at: '2025-04-01T00:00:00Z' },

  // S33 — Nova & Ember Double Feature 2025
  { show_id: S33, name: 'alice johnson', status: 'going', updated_at: '2025-05-01T00:00:00Z' },
  { show_id: S33, name: 'bob smith', status: 'going', updated_at: '2025-05-02T00:00:00Z' },
  { show_id: S33, name: 'carol davis', status: 'going', updated_at: '2025-05-03T00:00:00Z' },
  { show_id: S33, name: 'david wilson', status: 'going', updated_at: '2025-05-04T00:00:00Z' },
  { show_id: S33, name: 'emma brown', status: 'going', updated_at: '2025-05-05T00:00:00Z' },
  { show_id: S33, name: 'frank miller', status: 'maybe', updated_at: '2025-05-01T00:00:00Z' },
  { show_id: S33, name: 'grace lee', status: 'maybe', updated_at: '2025-05-02T00:00:00Z' },

  // S34 — Kairo Wolfe Street Poet 2025
  { show_id: S34, name: 'bob smith', status: 'going', updated_at: '2025-07-20T00:00:00Z' },
  { show_id: S34, name: 'david wilson', status: 'going', updated_at: '2025-07-21T00:00:00Z' },
  { show_id: S34, name: 'alice johnson', status: 'going', updated_at: '2025-07-22T00:00:00Z' },
  { show_id: S34, name: 'frank miller', status: 'going', updated_at: '2025-07-23T00:00:00Z' },
  { show_id: S34, name: 'emma brown', status: 'not_going', updated_at: '2025-07-20T00:00:00Z' },

  // S35 — Aria Nightfall Lunar Eclipse 2025
  { show_id: S35, name: 'alice johnson', status: 'going', updated_at: '2025-09-20T00:00:00Z' },
  { show_id: S35, name: 'emma brown', status: 'going', updated_at: '2025-09-21T00:00:00Z' },
  { show_id: S35, name: 'grace lee', status: 'going', updated_at: '2025-09-22T00:00:00Z' },
  { show_id: S35, name: 'henry taylor', status: 'going', updated_at: '2025-09-23T00:00:00Z' },
  { show_id: S35, name: 'carol davis', status: 'maybe', updated_at: '2025-09-20T00:00:00Z' },
  { show_id: S35, name: 'bob smith', status: 'not_going', updated_at: '2025-09-21T00:00:00Z' },

  // S36 — Solstice City Voltage 2025
  { show_id: S36, name: 'alice johnson', status: 'going', updated_at: '2025-11-01T00:00:00Z' },
  { show_id: S36, name: 'bob smith', status: 'going', updated_at: '2025-11-02T00:00:00Z' },
  { show_id: S36, name: 'frank miller', status: 'going', updated_at: '2025-11-03T00:00:00Z' },
  { show_id: S36, name: 'david wilson', status: 'going', updated_at: '2025-11-04T00:00:00Z' },
  { show_id: S36, name: 'emma brown', status: 'maybe', updated_at: '2025-11-01T00:00:00Z' },
  { show_id: S36, name: 'carol davis', status: 'not_going', updated_at: '2025-11-02T00:00:00Z' },

  // S37 — Lyra Monroe Gravity 2026 (past)
  { show_id: S37, name: 'alice johnson', status: 'going', updated_at: '2025-12-28T00:00:00Z' },
  { show_id: S37, name: 'carol davis', status: 'going', updated_at: '2025-12-29T00:00:00Z' },
  { show_id: S37, name: 'emma brown', status: 'going', updated_at: '2025-12-30T00:00:00Z' },
  { show_id: S37, name: 'bob smith', status: 'maybe', updated_at: '2025-12-28T00:00:00Z' },

  // S38 — Echo Meridian Waveform 2026 (past)
  { show_id: S38, name: 'alice johnson', status: 'going', updated_at: '2026-01-25T00:00:00Z' },
  { show_id: S38, name: 'henry taylor', status: 'going', updated_at: '2026-01-26T00:00:00Z' },
  { show_id: S38, name: 'emma brown', status: 'going', updated_at: '2026-01-27T00:00:00Z' },
  { show_id: S38, name: 'bob smith', status: 'not_going', updated_at: '2026-01-25T00:00:00Z' },

  // S39 — Indigo Harbor Coastal Highway 2026 (past)
  { show_id: S39, name: 'alice johnson', status: 'going', updated_at: '2026-02-15T00:00:00Z' },
  { show_id: S39, name: 'grace lee', status: 'going', updated_at: '2026-02-16T00:00:00Z' },
  { show_id: S39, name: 'isabella garcia', status: 'going', updated_at: '2026-02-17T00:00:00Z' },
  { show_id: S39, name: 'carol davis', status: 'going', updated_at: '2026-02-18T00:00:00Z' },
  { show_id: S39, name: 'bob smith', status: 'maybe', updated_at: '2026-02-15T00:00:00Z' },

  // S40 — Ember Rae Wildfire 2026 (upcoming)
  { show_id: S40, name: 'alice johnson', status: 'going', updated_at: '2026-03-10T00:00:00Z' },
  { show_id: S40, name: 'carol davis', status: 'going', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S40, name: 'emma brown', status: 'maybe', updated_at: '2026-03-10T00:00:00Z' },
  { show_id: S40, name: 'bob smith', status: 'maybe', updated_at: '2026-03-11T00:00:00Z' },

  // S41 — Kairo Wolfe Crown 2026 (upcoming)
  { show_id: S41, name: 'bob smith', status: 'going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S41, name: 'david wilson', status: 'going', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S41, name: 'alice johnson', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S41, name: 'frank miller', status: 'maybe', updated_at: '2026-03-13T00:00:00Z' },

  // S42 — Zephyr Vale Aurora 2026 (upcoming)
  { show_id: S42, name: 'alice johnson', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S42, name: 'emma brown', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S42, name: 'grace lee', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S42, name: 'bob smith', status: 'maybe', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S42, name: 'david wilson', status: 'not_going', updated_at: '2026-03-14T00:00:00Z' },
]

// ──────────────────────────────────────────────
// Releases  (within 91-day window from Mar 15 2026)
// ──────────────────────────────────────────────
export const DEMO_RELEASES: Release[] = [
  {
    id: R1, artist_id: A10, spotify_id: 'demo_rel_tide',
    name: 'Tide and Timber', release_type: 'album', release_date: '2026-03-08',
    spotify_url: 'https://open.spotify.com/album/demo_tide',
    image_url: aImg(C.indigo, 'Tide and Timber'),
    total_tracks: 13,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_tide' },
    artists: [{ id: 'demo_indigo_harbor', name: 'Indigo Harbor' }],
    created_at: '2026-03-08T00:00:00Z',
  },
  {
    id: R2, artist_id: A9, spotify_id: 'demo_rel_northern',
    name: 'Northern Lines', release_type: 'album', release_date: '2026-03-06',
    spotify_url: 'https://open.spotify.com/album/demo_northern',
    image_url: aImg(C.echo, 'Northern Lines'),
    total_tracks: 23,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_northern' },
    artists: [{ id: 'demo_echo_meridian', name: 'Echo Meridian' }],
    created_at: '2026-03-06T00:00:00Z',
  },
  {
    id: R3, artist_id: A7, spotify_id: 'demo_rel_wolves',
    name: 'City of Wolves', release_type: 'album', release_date: '2026-03-04',
    spotify_url: 'https://open.spotify.com/album/demo_wolves',
    image_url: aImg(C.kairo, 'City of Wolves'),
    total_tracks: 18,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_wolves' },
    artists: [{ id: 'demo_kairo_wolfe', name: 'Kairo Wolfe' }],
    created_at: '2026-03-04T00:00:00Z',
  },
  {
    id: R4, artist_id: A8, spotify_id: 'demo_rel_orbits',
    name: 'Orbits', release_type: 'album', release_date: '2026-03-01',
    spotify_url: 'https://open.spotify.com/album/demo_orbits',
    image_url: aImg(C.solstice, 'Orbits'),
    total_tracks: 12,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_orbits' },
    artists: [{ id: 'demo_solstice_city', name: 'Solstice City' }],
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: R5, artist_id: A6, spotify_id: 'demo_rel_lanterns',
    name: 'Midnight Lanterns', release_type: 'album', release_date: '2026-02-16',
    spotify_url: 'https://open.spotify.com/album/demo_lanterns',
    image_url: aImg(C.aria, 'Midnight Lanterns'),
    total_tracks: 14,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_lanterns' },
    artists: [{ id: 'demo_aria_nightfall', name: 'Aria Nightfall' }],
    created_at: '2026-02-16T00:00:00Z',
  },
  {
    id: R6, artist_id: A5, spotify_id: 'demo_rel_geometry',
    name: 'The Geometry', release_type: 'album', release_date: '2026-02-08',
    spotify_url: 'https://open.spotify.com/album/demo_geometry',
    image_url: aImg(C.atlas, 'The Geometry'),
    total_tracks: 12,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_geometry' },
    artists: [{ id: 'demo_atlas_rook', name: 'Atlas Rook' }],
    created_at: '2026-02-08T00:00:00Z',
  },
  {
    id: R7, artist_id: A3, spotify_id: 'demo_rel_chroma',
    name: 'Chromalune', release_type: 'album', release_date: '2026-01-28',
    spotify_url: 'https://open.spotify.com/album/demo_chroma',
    image_url: aImg(C.lyra, 'Chromalune'),
    total_tracks: 16,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_chroma' },
    artists: [{ id: 'demo_lyra_monroe', name: 'Lyra Monroe' }],
    created_at: '2026-01-28T00:00:00Z',
  },
  {
    id: R8, artist_id: A2, spotify_id: 'demo_rel_neon',
    name: 'Neon Eclipse', release_type: 'album', release_date: '2026-01-18',
    spotify_url: 'https://open.spotify.com/album/demo_neon',
    image_url: aImg(C.zephyr, 'Neon Eclipse'),
    total_tracks: 14,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_neon' },
    artists: [{ id: 'demo_zephyr_vale', name: 'Zephyr Vale' }],
    created_at: '2026-01-18T00:00:00Z',
  },
  {
    id: R9, artist_id: A1, spotify_id: 'demo_rel_skies',
    name: 'Electric Skies', release_type: 'album', release_date: '2026-01-08',
    spotify_url: 'https://open.spotify.com/album/demo_skies',
    image_url: aImg(C.nova, 'Electric Skies'),
    total_tracks: 9,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_skies' },
    artists: [{ id: 'demo_nova_kline', name: 'Nova Kline' }],
    created_at: '2026-01-08T00:00:00Z',
  },
  {
    id: R10, artist_id: A4, spotify_id: 'demo_rel_emberheart',
    name: 'Ember Heart', release_type: 'album', release_date: '2025-12-22',
    spotify_url: 'https://open.spotify.com/album/demo_emberheart',
    image_url: aImg(C.ember, 'Ember Heart'),
    total_tracks: 16,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_emberheart' },
    artists: [{ id: 'demo_ember_rae', name: 'Ember Rae' }],
    created_at: '2025-12-22T00:00:00Z',
  },
]

// ──────────────────────────────────────────────
// Costs  (Alice Johnson's expense tracking)
// ──────────────────────────────────────────────
export const DEMO_COSTS: ShowCost[] = [
  { id: C1, show_id: S1, user_id: 'alice johnson', category: 'ticket', amount_minor: 4500, currency: 'USD', note: 'GA ticket', created_at: '2025-06-10T00:00:00Z', updated_at: '2025-06-10T00:00:00Z' },
  { id: C2, show_id: S1, user_id: 'alice johnson', category: 'merch', amount_minor: 3500, currency: 'USD', note: 'Tour t-shirt', created_at: '2025-06-16T01:00:00Z', updated_at: '2025-06-16T01:00:00Z' },
  { id: C3, show_id: S3, user_id: 'alice johnson', category: 'ticket', amount_minor: 5500, currency: 'USD', note: 'GA ticket', created_at: '2025-08-28T00:00:00Z', updated_at: '2025-08-28T00:00:00Z' },
  { id: C4, show_id: S3, user_id: 'alice johnson', category: 'food_drink', amount_minor: 2200, currency: 'USD', note: 'Beers at the venue', created_at: '2025-09-06T00:00:00Z', updated_at: '2025-09-06T00:00:00Z' },
  { id: C5, show_id: S4, user_id: 'alice johnson', category: 'ticket', amount_minor: 6500, currency: 'USD', note: 'VIP ticket', created_at: '2025-10-15T00:00:00Z', updated_at: '2025-10-15T00:00:00Z' },
  { id: C6, show_id: S4, user_id: 'alice johnson', category: 'rideshare', amount_minor: 1800, currency: 'USD', note: 'Uber home', created_at: '2025-11-01T01:00:00Z', updated_at: '2025-11-01T01:00:00Z' },
  { id: C7, show_id: S5, user_id: 'alice johnson', category: 'ticket', amount_minor: 4000, currency: 'USD', note: null, created_at: '2025-12-05T00:00:00Z', updated_at: '2025-12-05T00:00:00Z' },
  { id: C8, show_id: S6, user_id: 'alice johnson', category: 'ticket', amount_minor: 3000, currency: 'USD', note: null, created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-10T00:00:00Z' },
]
