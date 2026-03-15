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

// ──────────────────────────────────────────────
// Stable IDs
// ──────────────────────────────────────────────

// Shows (S1–S6 past, S7–S12 upcoming)
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
// Image helpers
// ──────────────────────────────────────────────
const aImg = (color: string, name: string) =>
  `https://placehold.co/300x300/${color}/white?text=${name.replace(/ /g, '+')}`
const pImg = (color: string, name: string) =>
  `https://placehold.co/600x900/${color}/white?text=${name.replace(/ /g, '+')}`

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
    created_at: '2025-01-01T00:00:00Z', created_by: 'Alice Johnson', is_active: true,
  },
  {
    id: A2, artist_name: 'Zephyr Vale', spotify_id: 'demo_zephyr_vale',
    spotify_url: 'https://open.spotify.com/artist/demo_zephyr_vale',
    image_url: aImg(C.zephyr, 'Zephyr Vale'),
    genres: ['pop', 'alternative r&b'], popularity: 95,
    followers_count: 113500000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-05T00:00:00Z', created_by: 'Alice Johnson', is_active: true,
  },
  {
    id: A3, artist_name: 'Lyra Monroe', spotify_id: 'demo_lyra_monroe',
    spotify_url: 'https://open.spotify.com/artist/demo_lyra_monroe',
    image_url: aImg(C.lyra, 'Lyra Monroe'),
    genres: ['pop', 'dance pop', 'electropop'], popularity: 92,
    followers_count: 108800000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-10T00:00:00Z', created_by: 'Alice Johnson', is_active: true,
  },
  {
    id: A4, artist_name: 'Ember Rae', spotify_id: 'demo_ember_rae',
    spotify_url: 'https://open.spotify.com/artist/demo_ember_rae',
    image_url: aImg(C.ember, 'Ember Rae'),
    genres: ['pop', 'alternative pop', 'indie pop'], popularity: 90,
    followers_count: 97900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-15T00:00:00Z', created_by: 'Bob Smith', is_active: true,
  },
  {
    id: A5, artist_name: 'Atlas Rook', spotify_id: 'demo_atlas_rook',
    spotify_url: 'https://open.spotify.com/artist/demo_atlas_rook',
    image_url: aImg(C.atlas, 'Atlas Rook'),
    genres: ['pop', 'singer-songwriter', 'acoustic'], popularity: 88,
    followers_count: 92900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-20T00:00:00Z', created_by: 'Alice Johnson', is_active: true,
  },
  {
    id: A6, artist_name: 'Aria Nightfall', spotify_id: 'demo_aria_nightfall',
    spotify_url: 'https://open.spotify.com/artist/demo_aria_nightfall',
    image_url: aImg(C.aria, 'Aria Nightfall'),
    genres: ['pop', 'r&b', 'dance'], popularity: 88,
    followers_count: 92900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-25T00:00:00Z', created_by: 'Carol Davis', is_active: true,
  },
  {
    id: A7, artist_name: 'Kairo Wolfe', spotify_id: 'demo_kairo_wolfe',
    spotify_url: 'https://open.spotify.com/artist/demo_kairo_wolfe',
    image_url: aImg(C.kairo, 'Kairo Wolfe'),
    genres: ['hip hop', 'rap', 'alternative hip hop'], popularity: 83,
    followers_count: 84400000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-01T00:00:00Z', created_by: 'David Wilson', is_active: true,
  },
  {
    id: A8, artist_name: 'Solstice City', spotify_id: 'demo_solstice_city',
    spotify_url: 'https://open.spotify.com/artist/demo_solstice_city',
    image_url: aImg(C.solstice, 'Solstice City'),
    genres: ['alternative rock', 'pop rock', 'indie rock'], popularity: 85,
    followers_count: 92100000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-05T00:00:00Z', created_by: 'Alice Johnson', is_active: true,
  },
  {
    id: A9, artist_name: 'Echo Meridian', spotify_id: 'demo_echo_meridian',
    spotify_url: 'https://open.spotify.com/artist/demo_echo_meridian',
    image_url: aImg(C.echo, 'Echo Meridian'),
    genres: ['synthwave', 'electronic', 'retrowave'], popularity: 82,
    followers_count: 83100000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-10T00:00:00Z', created_by: 'Emma Brown', is_active: true,
  },
  {
    id: A10, artist_name: 'Indigo Harbor', spotify_id: 'demo_indigo_harbor',
    spotify_url: 'https://open.spotify.com/artist/demo_indigo_harbor',
    image_url: aImg(C.indigo, 'Indigo Harbor'),
    genres: ['folk', 'indie folk', 'singer-songwriter'], popularity: 80,
    followers_count: 82900000, last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-15T00:00:00Z', created_by: 'Grace Lee', is_active: true,
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
// Shows  (S1–S6 past · S7–S12 upcoming)
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
]

// ──────────────────────────────────────────────
// RSVPs
// ──────────────────────────────────────────────
export const DEMO_RSVPS: RSVP[] = [
  // S1 — Echo Meridian (past)
  { show_id: S1, name: 'Alice Johnson', status: 'going', updated_at: '2025-06-10T00:00:00Z' },
  { show_id: S1, name: 'Bob Smith', status: 'going', updated_at: '2025-06-10T00:00:00Z' },
  { show_id: S1, name: 'Carol Davis', status: 'going', updated_at: '2025-06-11T00:00:00Z' },
  { show_id: S1, name: 'Emma Brown', status: 'maybe', updated_at: '2025-06-12T00:00:00Z' },
  { show_id: S1, name: 'David Wilson', status: 'not_going', updated_at: '2025-06-11T00:00:00Z' },
  { show_id: S1, name: 'Frank Miller', status: 'not_going', updated_at: '2025-06-12T00:00:00Z' },

  // S2 — Indigo Harbor (past)
  { show_id: S2, name: 'Grace Lee', status: 'going', updated_at: '2025-07-20T00:00:00Z' },
  { show_id: S2, name: 'Henry Taylor', status: 'going', updated_at: '2025-07-21T00:00:00Z' },
  { show_id: S2, name: 'Isabella Garcia', status: 'going', updated_at: '2025-07-22T00:00:00Z' },
  { show_id: S2, name: 'Alice Johnson', status: 'maybe', updated_at: '2025-07-23T00:00:00Z' },
  { show_id: S2, name: 'Bob Smith', status: 'not_going', updated_at: '2025-07-20T00:00:00Z' },
  { show_id: S2, name: 'Carol Davis', status: 'not_going', updated_at: '2025-07-21T00:00:00Z' },

  // S3 — Nova Kline Starlight (past)
  { show_id: S3, name: 'Alice Johnson', status: 'going', updated_at: '2025-08-28T00:00:00Z' },
  { show_id: S3, name: 'Carol Davis', status: 'going', updated_at: '2025-08-29T00:00:00Z' },
  { show_id: S3, name: 'David Wilson', status: 'going', updated_at: '2025-08-30T00:00:00Z' },
  { show_id: S3, name: 'Emma Brown', status: 'going', updated_at: '2025-08-31T00:00:00Z' },
  { show_id: S3, name: 'Frank Miller', status: 'maybe', updated_at: '2025-09-01T00:00:00Z' },
  { show_id: S3, name: 'Bob Smith', status: 'not_going', updated_at: '2025-08-28T00:00:00Z' },

  // S4 — Aria Nightfall Halloween (past)
  { show_id: S4, name: 'Alice Johnson', status: 'going', updated_at: '2025-10-20T00:00:00Z' },
  { show_id: S4, name: 'Bob Smith', status: 'going', updated_at: '2025-10-21T00:00:00Z' },
  { show_id: S4, name: 'Emma Brown', status: 'going', updated_at: '2025-10-22T00:00:00Z' },
  { show_id: S4, name: 'Frank Miller', status: 'going', updated_at: '2025-10-23T00:00:00Z' },
  { show_id: S4, name: 'Grace Lee', status: 'going', updated_at: '2025-10-24T00:00:00Z' },
  { show_id: S4, name: 'David Wilson', status: 'maybe', updated_at: '2025-10-25T00:00:00Z' },
  { show_id: S4, name: 'Carol Davis', status: 'not_going', updated_at: '2025-10-20T00:00:00Z' },

  // S5 — Kairo Wolfe Release (past)
  { show_id: S5, name: 'Alice Johnson', status: 'going', updated_at: '2025-12-10T00:00:00Z' },
  { show_id: S5, name: 'Carol Davis', status: 'going', updated_at: '2025-12-11T00:00:00Z' },
  { show_id: S5, name: 'Bob Smith', status: 'maybe', updated_at: '2025-12-12T00:00:00Z' },
  { show_id: S5, name: 'David Wilson', status: 'not_going', updated_at: '2025-12-10T00:00:00Z' },

  // S6 — Solstice City & Friends (past)
  { show_id: S6, name: 'Alice Johnson', status: 'going', updated_at: '2026-01-15T00:00:00Z' },
  { show_id: S6, name: 'Emma Brown', status: 'going', updated_at: '2026-01-16T00:00:00Z' },
  { show_id: S6, name: 'Grace Lee', status: 'going', updated_at: '2026-01-17T00:00:00Z' },
  { show_id: S6, name: 'Bob Smith', status: 'maybe', updated_at: '2026-01-18T00:00:00Z' },
  { show_id: S6, name: 'Carol Davis', status: 'maybe', updated_at: '2026-01-19T00:00:00Z' },
  { show_id: S6, name: 'Frank Miller', status: 'not_going', updated_at: '2026-01-15T00:00:00Z' },

  // S7 — Nova Kline Electric Skies (upcoming)
  { show_id: S7, name: 'Alice Johnson', status: 'going', updated_at: '2026-03-01T00:00:00Z' },
  { show_id: S7, name: 'Bob Smith', status: 'going', updated_at: '2026-03-02T00:00:00Z' },
  { show_id: S7, name: 'Carol Davis', status: 'going', updated_at: '2026-03-03T00:00:00Z' },
  { show_id: S7, name: 'David Wilson', status: 'going', updated_at: '2026-03-04T00:00:00Z' },
  { show_id: S7, name: 'Emma Brown', status: 'maybe', updated_at: '2026-03-05T00:00:00Z' },
  { show_id: S7, name: 'Frank Miller', status: 'maybe', updated_at: '2026-03-06T00:00:00Z' },
  { show_id: S7, name: 'Grace Lee', status: 'not_going', updated_at: '2026-03-01T00:00:00Z' },

  // S8 — Zephyr Vale Neon Eclipse (upcoming)
  { show_id: S8, name: 'Alice Johnson', status: 'going', updated_at: '2026-03-05T00:00:00Z' },
  { show_id: S8, name: 'Emma Brown', status: 'going', updated_at: '2026-03-06T00:00:00Z' },
  { show_id: S8, name: 'Henry Taylor', status: 'going', updated_at: '2026-03-07T00:00:00Z' },
  { show_id: S8, name: 'Bob Smith', status: 'maybe', updated_at: '2026-03-08T00:00:00Z' },
  { show_id: S8, name: 'Isabella Garcia', status: 'maybe', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S8, name: 'Carol Davis', status: 'not_going', updated_at: '2026-03-05T00:00:00Z' },
  { show_id: S8, name: 'Frank Miller', status: 'not_going', updated_at: '2026-03-06T00:00:00Z' },

  // S9 — Lyra Monroe Chromalune (upcoming)
  { show_id: S9, name: 'Bob Smith', status: 'going', updated_at: '2026-03-07T00:00:00Z' },
  { show_id: S9, name: 'Carol Davis', status: 'going', updated_at: '2026-03-08T00:00:00Z' },
  { show_id: S9, name: 'David Wilson', status: 'going', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S9, name: 'Emma Brown', status: 'going', updated_at: '2026-03-10T00:00:00Z' },
  { show_id: S9, name: 'Frank Miller', status: 'going', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S9, name: 'Grace Lee', status: 'maybe', updated_at: '2026-03-07T00:00:00Z' },
  { show_id: S9, name: 'Alice Johnson', status: 'not_going', updated_at: '2026-03-08T00:00:00Z' },

  // S10 — Atlas Rook Geometry (upcoming)
  { show_id: S10, name: 'Alice Johnson', status: 'going', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S10, name: 'Grace Lee', status: 'going', updated_at: '2026-03-10T00:00:00Z' },
  { show_id: S10, name: 'Henry Taylor', status: 'going', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S10, name: 'Bob Smith', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S10, name: 'Carol Davis', status: 'maybe', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S10, name: 'David Wilson', status: 'not_going', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S10, name: 'Emma Brown', status: 'not_going', updated_at: '2026-03-10T00:00:00Z' },

  // S11 — Aria Nightfall Midnight Lanterns (upcoming)
  { show_id: S11, name: 'David Wilson', status: 'going', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S11, name: 'Emma Brown', status: 'going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S11, name: 'Frank Miller', status: 'going', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S11, name: 'Grace Lee', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S11, name: 'Isabella Garcia', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S11, name: 'Alice Johnson', status: 'maybe', updated_at: '2026-03-11T00:00:00Z' },
  { show_id: S11, name: 'Bob Smith', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S11, name: 'Carol Davis', status: 'not_going', updated_at: '2026-03-11T00:00:00Z' },

  // S12 — Solstice City Orbits (upcoming)
  { show_id: S12, name: 'Carol Davis', status: 'going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S12, name: 'Emma Brown', status: 'going', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S12, name: 'Grace Lee', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S12, name: 'Alice Johnson', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S12, name: 'David Wilson', status: 'maybe', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S12, name: 'Bob Smith', status: 'not_going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S12, name: 'Frank Miller', status: 'not_going', updated_at: '2026-03-13T00:00:00Z' },
]

// ──────────────────────────────────────────────
// Releases  (within 91-day window from Mar 15 2026)
// ──────────────────────────────────────────────
export const DEMO_RELEASES: Release[] = [
  {
    id: R1, artist_id: A10, spotify_id: 'demo_rel_tide',
    name: 'Tide and Timber', release_type: 'album', release_date: '2026-03-08',
    spotify_url: 'https://open.spotify.com/album/demo_tide',
    image_url: aImg(C.indigo, 'Tide+and+Timber'),
    total_tracks: 13,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_tide' },
    artists: [{ id: 'demo_indigo_harbor', name: 'Indigo Harbor' }],
    created_at: '2026-03-08T00:00:00Z',
  },
  {
    id: R2, artist_id: A9, spotify_id: 'demo_rel_northern',
    name: 'Northern Lines', release_type: 'album', release_date: '2026-03-06',
    spotify_url: 'https://open.spotify.com/album/demo_northern',
    image_url: aImg(C.echo, 'Northern+Lines'),
    total_tracks: 23,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_northern' },
    artists: [{ id: 'demo_echo_meridian', name: 'Echo Meridian' }],
    created_at: '2026-03-06T00:00:00Z',
  },
  {
    id: R3, artist_id: A7, spotify_id: 'demo_rel_wolves',
    name: 'City of Wolves', release_type: 'album', release_date: '2026-03-04',
    spotify_url: 'https://open.spotify.com/album/demo_wolves',
    image_url: aImg(C.kairo, 'City+of+Wolves'),
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
    image_url: aImg(C.aria, 'Midnight+Lanterns'),
    total_tracks: 14,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_lanterns' },
    artists: [{ id: 'demo_aria_nightfall', name: 'Aria Nightfall' }],
    created_at: '2026-02-16T00:00:00Z',
  },
  {
    id: R6, artist_id: A5, spotify_id: 'demo_rel_geometry',
    name: 'The Geometry', release_type: 'album', release_date: '2026-02-08',
    spotify_url: 'https://open.spotify.com/album/demo_geometry',
    image_url: aImg(C.atlas, 'The+Geometry'),
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
    image_url: aImg(C.zephyr, 'Neon+Eclipse'),
    total_tracks: 14,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_neon' },
    artists: [{ id: 'demo_zephyr_vale', name: 'Zephyr Vale' }],
    created_at: '2026-01-18T00:00:00Z',
  },
  {
    id: R9, artist_id: A1, spotify_id: 'demo_rel_skies',
    name: 'Electric Skies', release_type: 'album', release_date: '2026-01-08',
    spotify_url: 'https://open.spotify.com/album/demo_skies',
    image_url: aImg(C.nova, 'Electric+Skies'),
    total_tracks: 9,
    external_urls: { spotify: 'https://open.spotify.com/album/demo_skies' },
    artists: [{ id: 'demo_nova_kline', name: 'Nova Kline' }],
    created_at: '2026-01-08T00:00:00Z',
  },
  {
    id: R10, artist_id: A4, spotify_id: 'demo_rel_emberheart',
    name: 'Ember Heart', release_type: 'album', release_date: '2025-12-22',
    spotify_url: 'https://open.spotify.com/album/demo_emberheart',
    image_url: aImg(C.ember, 'Ember+Heart'),
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
  { id: C1, show_id: S1, user_id: 'Alice Johnson', category: 'ticket', amount_minor: 4500, currency: 'USD', note: 'GA ticket', created_at: '2025-06-10T00:00:00Z', updated_at: '2025-06-10T00:00:00Z' },
  { id: C2, show_id: S1, user_id: 'Alice Johnson', category: 'merch', amount_minor: 3500, currency: 'USD', note: 'Tour t-shirt', created_at: '2025-06-16T01:00:00Z', updated_at: '2025-06-16T01:00:00Z' },
  { id: C3, show_id: S3, user_id: 'Alice Johnson', category: 'ticket', amount_minor: 5500, currency: 'USD', note: 'GA ticket', created_at: '2025-08-28T00:00:00Z', updated_at: '2025-08-28T00:00:00Z' },
  { id: C4, show_id: S3, user_id: 'Alice Johnson', category: 'food_drink', amount_minor: 2200, currency: 'USD', note: 'Beers at the venue', created_at: '2025-09-06T00:00:00Z', updated_at: '2025-09-06T00:00:00Z' },
  { id: C5, show_id: S4, user_id: 'Alice Johnson', category: 'ticket', amount_minor: 6500, currency: 'USD', note: 'VIP ticket', created_at: '2025-10-15T00:00:00Z', updated_at: '2025-10-15T00:00:00Z' },
  { id: C6, show_id: S4, user_id: 'Alice Johnson', category: 'rideshare', amount_minor: 1800, currency: 'USD', note: 'Uber home', created_at: '2025-11-01T01:00:00Z', updated_at: '2025-11-01T01:00:00Z' },
  { id: C7, show_id: S5, user_id: 'Alice Johnson', category: 'ticket', amount_minor: 4000, currency: 'USD', note: null, created_at: '2025-12-05T00:00:00Z', updated_at: '2025-12-05T00:00:00Z' },
  { id: C8, show_id: S6, user_id: 'Alice Johnson', category: 'ticket', amount_minor: 3000, currency: 'USD', note: null, created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-10T00:00:00Z' },
]
