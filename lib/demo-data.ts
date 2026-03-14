/**
 * DEMO MODE — Hardcoded fictional data for all entities.
 *
 * All artist names, show titles, venues, and user names are entirely made up.
 * Image URLs use placeholder services or are left null.
 * Dates are spread across 2025–2026 so every section of the site has data.
 *
 * This file is the single source of truth for the "factory reset" state.
 * When a user refreshes the page, the runtime store re-seeds from here.
 */

import { Show, Artist, Release, RSVP } from './types'
import { ShowCost } from './costs'

// ──────────────────────────────────────────────
// Stable IDs (UUIDs)
// ──────────────────────────────────────────────

// Show IDs
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

// Artist IDs
const A1 = '20000000-0000-0000-0000-000000000001'
const A2 = '20000000-0000-0000-0000-000000000002'
const A3 = '20000000-0000-0000-0000-000000000003'
const A4 = '20000000-0000-0000-0000-000000000004'
const A5 = '20000000-0000-0000-0000-000000000005'
const A6 = '20000000-0000-0000-0000-000000000006'
const A7 = '20000000-0000-0000-0000-000000000007'
const A8 = '20000000-0000-0000-0000-000000000008'

// Release IDs
const R1 = '30000000-0000-0000-0000-000000000001'
const R2 = '30000000-0000-0000-0000-000000000002'
const R3 = '30000000-0000-0000-0000-000000000003'
const R4 = '30000000-0000-0000-0000-000000000004'
const R5 = '30000000-0000-0000-0000-000000000005'
const R6 = '30000000-0000-0000-0000-000000000006'
const R7 = '30000000-0000-0000-0000-000000000007'
const R8 = '30000000-0000-0000-0000-000000000008'

// Cost IDs
const C1 = '40000000-0000-0000-0000-000000000001'
const C2 = '40000000-0000-0000-0000-000000000002'
const C3 = '40000000-0000-0000-0000-000000000003'
const C4 = '40000000-0000-0000-0000-000000000004'
const C5 = '40000000-0000-0000-0000-000000000005'
const C6 = '40000000-0000-0000-0000-000000000006'
const C7 = '40000000-0000-0000-0000-000000000007'
const C8 = '40000000-0000-0000-0000-000000000008'

// ──────────────────────────────────────────────
// Demo Users
// ──────────────────────────────────────────────
export const DEMO_USERS = ['alex rivers', 'jamie chen', 'sam taylor', 'morgan kelly', 'riley brooks']

export const DEMO_PASSWORD = 'demo'

// ──────────────────────────────────────────────
// Artists
// ──────────────────────────────────────────────
export const DEMO_ARTISTS: Artist[] = [
  {
    id: A1,
    artist_name: 'Neon Veil',
    spotify_id: 'demo_neon_veil',
    spotify_url: 'https://open.spotify.com/artist/demo1',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/8B5CF6/FFFFFF?text=NV',
    genres: ['indie rock', 'dream pop'],
    popularity: 72,
    followers_count: 185000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-01-15T00:00:00Z',
    created_by: 'alex rivers',
    is_active: true,
  },
  {
    id: A2,
    artist_name: 'Glass Amber',
    spotify_id: 'demo_glass_amber',
    spotify_url: 'https://open.spotify.com/artist/demo2',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/F59E0B/FFFFFF?text=GA',
    genres: ['alt rock', 'shoegaze'],
    popularity: 64,
    followers_count: 92000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-01T00:00:00Z',
    created_by: 'jamie chen',
    is_active: true,
  },
  {
    id: A3,
    artist_name: 'Hollow Pine',
    spotify_id: 'demo_hollow_pine',
    spotify_url: 'https://open.spotify.com/artist/demo3',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/10B981/FFFFFF?text=HP',
    genres: ['folk', 'americana'],
    popularity: 58,
    followers_count: 45000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-02-01T00:00:00Z',
    created_by: 'alex rivers',
    is_active: true,
  },
  {
    id: A4,
    artist_name: 'Static Bloom',
    spotify_id: 'demo_static_bloom',
    spotify_url: 'https://open.spotify.com/artist/demo4',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/EF4444/FFFFFF?text=SB',
    genres: ['electronic', 'synth pop'],
    popularity: 81,
    followers_count: 310000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-03-01T00:00:00Z',
    created_by: 'sam taylor',
    is_active: true,
  },
  {
    id: A5,
    artist_name: 'Copper Saints',
    spotify_id: 'demo_copper_saints',
    spotify_url: 'https://open.spotify.com/artist/demo5',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/F97316/FFFFFF?text=CS',
    genres: ['punk', 'post-punk'],
    popularity: 47,
    followers_count: 28000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-03-15T00:00:00Z',
    created_by: 'morgan kelly',
    is_active: true,
  },
  {
    id: A6,
    artist_name: 'Velvet Dusk',
    spotify_id: 'demo_velvet_dusk',
    spotify_url: 'https://open.spotify.com/artist/demo6',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/EC4899/FFFFFF?text=VD',
    genres: ['r&b', 'neo-soul'],
    popularity: 69,
    followers_count: 155000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-04-01T00:00:00Z',
    created_by: 'riley brooks',
    is_active: true,
  },
  {
    id: A7,
    artist_name: 'Rust & Ruin',
    spotify_id: 'demo_rust_ruin',
    spotify_url: 'https://open.spotify.com/artist/demo7',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/78716C/FFFFFF?text=RR',
    genres: ['metal', 'stoner rock'],
    popularity: 55,
    followers_count: 67000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-05-01T00:00:00Z',
    created_by: 'alex rivers',
    is_active: true,
  },
  {
    id: A8,
    artist_name: 'Luna Moth',
    spotify_id: 'demo_luna_moth',
    spotify_url: 'https://open.spotify.com/artist/demo8',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/6366F1/FFFFFF?text=LM',
    genres: ['indie pop', 'bedroom pop'],
    popularity: 61,
    followers_count: 78000,
    last_checked: '2026-03-10T00:00:00Z',
    created_at: '2025-06-01T00:00:00Z',
    created_by: 'jamie chen',
    is_active: true,
  },
]

// ──────────────────────────────────────────────
// Shows  (6 past, 6 upcoming relative to March 14 2026)
// ──────────────────────────────────────────────
export const DEMO_SHOWS: Show[] = [
  // ── Past shows ──
  {
    id: S1,
    title: 'Neon Veil — Infinite Mirror Tour',
    date_time: '2025-06-14T23:00:00Z', // 7 PM ET
    time_local: '19:00',
    city: 'Boston',
    venue: 'The Sinclair',
    ticket_url: 'https://example.com/tickets/1',
    poster_url: null,
    notes: 'Sold-out show, amazing light production',
    show_artists: [
      { artist: 'Neon Veil', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/8B5CF6/FFFFFF?text=NV', spotify_id: 'demo_neon_veil', spotify_url: 'https://open.spotify.com/artist/demo1' },
      { artist: 'Luna Moth', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/6366F1/FFFFFF?text=LM', spotify_id: 'demo_luna_moth', spotify_url: 'https://open.spotify.com/artist/demo8' },
    ],
    created_at: '2025-05-01T00:00:00Z',
  },
  {
    id: S2,
    title: 'Summer Bones Fest',
    date_time: '2025-07-19T22:00:00Z', // 6 PM ET
    time_local: '18:00',
    city: 'Cambridge',
    venue: 'The Middle East',
    ticket_url: 'https://example.com/tickets/2',
    poster_url: null,
    notes: 'Multi-stage festival, day pass',
    show_artists: [
      { artist: 'Copper Saints', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/F97316/FFFFFF?text=CS', spotify_id: 'demo_copper_saints', spotify_url: 'https://open.spotify.com/artist/demo5' },
      { artist: 'Rust & Ruin', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/78716C/FFFFFF?text=RR', spotify_id: 'demo_rust_ruin', spotify_url: 'https://open.spotify.com/artist/demo7' },
      { artist: 'Glass Amber', position: 'Local', image_url: '/api/image-proxy?url=https://placehold.co/300x300/F59E0B/FFFFFF?text=GA', spotify_id: 'demo_glass_amber', spotify_url: 'https://open.spotify.com/artist/demo2' },
    ],
    created_at: '2025-06-15T00:00:00Z',
  },
  {
    id: S3,
    title: 'Glass Amber Acoustic Night',
    date_time: '2025-09-05T23:30:00Z', // 7:30 PM ET
    time_local: '19:30',
    city: 'Somerville',
    venue: 'Crystal Ballroom',
    ticket_url: 'https://example.com/tickets/3',
    poster_url: null,
    notes: 'Intimate unplugged set, only 200 capacity',
    show_artists: [
      { artist: 'Glass Amber', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/F59E0B/FFFFFF?text=GA', spotify_id: 'demo_glass_amber', spotify_url: 'https://open.spotify.com/artist/demo2' },
    ],
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: S4,
    title: 'Static Bloom — Pulse World Tour',
    date_time: '2025-10-31T23:00:00Z', // 7 PM ET
    time_local: '19:00',
    city: 'Boston',
    venue: 'House of Blues',
    ticket_url: 'https://example.com/tickets/4',
    poster_url: null,
    notes: 'Halloween special with costume contest',
    show_artists: [
      { artist: 'Static Bloom', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/EF4444/FFFFFF?text=SB', spotify_id: 'demo_static_bloom', spotify_url: 'https://open.spotify.com/artist/demo4' },
      { artist: 'Velvet Dusk', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/EC4899/FFFFFF?text=VD', spotify_id: 'demo_velvet_dusk', spotify_url: 'https://open.spotify.com/artist/demo6' },
    ],
    created_at: '2025-09-15T00:00:00Z',
  },
  {
    id: S5,
    title: 'Hollow Pine — Roots & Branches',
    date_time: '2025-12-20T01:00:00Z', // 8 PM ET (Dec 19)
    time_local: '20:00',
    city: 'Boston',
    venue: 'Brighton Music Hall',
    ticket_url: 'https://example.com/tickets/5',
    poster_url: null,
    notes: 'Holiday acoustic special',
    show_artists: [
      { artist: 'Hollow Pine', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/10B981/FFFFFF?text=HP', spotify_id: 'demo_hollow_pine', spotify_url: 'https://open.spotify.com/artist/demo3' },
    ],
    created_at: '2025-11-01T00:00:00Z',
  },
  {
    id: S6,
    title: 'Velvet Dusk & Friends',
    date_time: '2026-01-25T01:00:00Z', // 8 PM ET (Jan 24)
    time_local: '20:00',
    city: 'Cambridge',
    venue: 'The Sinclair',
    ticket_url: 'https://example.com/tickets/6',
    poster_url: null,
    notes: null,
    show_artists: [
      { artist: 'Velvet Dusk', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/EC4899/FFFFFF?text=VD', spotify_id: 'demo_velvet_dusk', spotify_url: 'https://open.spotify.com/artist/demo6' },
      { artist: 'Luna Moth', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/6366F1/FFFFFF?text=LM', spotify_id: 'demo_luna_moth', spotify_url: 'https://open.spotify.com/artist/demo8' },
      { artist: 'Hollow Pine', position: 'Local', image_url: '/api/image-proxy?url=https://placehold.co/300x300/10B981/FFFFFF?text=HP', spotify_id: 'demo_hollow_pine', spotify_url: 'https://open.spotify.com/artist/demo3' },
    ],
    created_at: '2025-12-15T00:00:00Z',
  },

  // ── Upcoming shows ──
  {
    id: S7,
    title: 'Neon Veil — New Album Release Show',
    date_time: '2026-03-28T23:00:00Z', // 7 PM ET
    time_local: '19:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: 'https://example.com/tickets/7',
    poster_url: null,
    notes: 'Album release party with exclusive merch drop',
    show_artists: [
      { artist: 'Neon Veil', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/8B5CF6/FFFFFF?text=NV', spotify_id: 'demo_neon_veil', spotify_url: 'https://open.spotify.com/artist/demo1' },
      { artist: 'Glass Amber', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/F59E0B/FFFFFF?text=GA', spotify_id: 'demo_glass_amber', spotify_url: 'https://open.spotify.com/artist/demo2' },
    ],
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: S8,
    title: 'Static Bloom — Warehouse Rave',
    date_time: '2026-04-11T23:00:00Z', // 7 PM ET
    time_local: '19:00',
    city: 'Somerville',
    venue: 'Once Ballroom',
    ticket_url: 'https://example.com/tickets/8',
    poster_url: null,
    notes: '21+ event, doors at 6 PM',
    show_artists: [
      { artist: 'Static Bloom', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/EF4444/FFFFFF?text=SB', spotify_id: 'demo_static_bloom', spotify_url: 'https://open.spotify.com/artist/demo4' },
    ],
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: S9,
    title: 'Copper Saints + Rust & Ruin Double Header',
    date_time: '2026-04-25T22:00:00Z', // 6 PM ET
    time_local: '18:00',
    city: 'Boston',
    venue: 'Paradise Rock Club',
    ticket_url: 'https://example.com/tickets/9',
    poster_url: null,
    notes: 'Two sets, no opener',
    show_artists: [
      { artist: 'Copper Saints', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/F97316/FFFFFF?text=CS', spotify_id: 'demo_copper_saints', spotify_url: 'https://open.spotify.com/artist/demo5' },
      { artist: 'Rust & Ruin', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/78716C/FFFFFF?text=RR', spotify_id: 'demo_rust_ruin', spotify_url: 'https://open.spotify.com/artist/demo7' },
    ],
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: S10,
    title: 'Luna Moth — Debut Headliner',
    date_time: '2026-05-09T23:00:00Z', // 7 PM ET
    time_local: '19:00',
    city: 'Cambridge',
    venue: 'The Middle East',
    ticket_url: 'https://example.com/tickets/10',
    poster_url: null,
    notes: 'First ever headlining show!',
    show_artists: [
      { artist: 'Luna Moth', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/6366F1/FFFFFF?text=LM', spotify_id: 'demo_luna_moth', spotify_url: 'https://open.spotify.com/artist/demo8' },
      { artist: 'Hollow Pine', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/10B981/FFFFFF?text=HP', spotify_id: 'demo_hollow_pine', spotify_url: 'https://open.spotify.com/artist/demo3' },
    ],
    created_at: '2026-03-05T00:00:00Z',
  },
  {
    id: S11,
    title: 'Summer Kickoff Festival 2026',
    date_time: '2026-06-13T20:00:00Z', // 4 PM ET
    time_local: '16:00',
    city: 'Boston',
    venue: 'City Pavilion',
    ticket_url: 'https://example.com/tickets/11',
    poster_url: null,
    notes: 'Outdoor all-day festival, rain or shine',
    show_artists: [
      { artist: 'Static Bloom', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/EF4444/FFFFFF?text=SB', spotify_id: 'demo_static_bloom', spotify_url: 'https://open.spotify.com/artist/demo4' },
      { artist: 'Neon Veil', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/8B5CF6/FFFFFF?text=NV', spotify_id: 'demo_neon_veil', spotify_url: 'https://open.spotify.com/artist/demo1' },
      { artist: 'Copper Saints', position: 'Local', image_url: '/api/image-proxy?url=https://placehold.co/300x300/F97316/FFFFFF?text=CS', spotify_id: 'demo_copper_saints', spotify_url: 'https://open.spotify.com/artist/demo5' },
    ],
    created_at: '2026-03-10T00:00:00Z',
  },
  {
    id: S12,
    title: 'Glass Amber — Farewell Tour',
    date_time: '2026-07-18T23:00:00Z', // 7 PM ET
    time_local: '19:00',
    city: 'Boston',
    venue: 'Roadrunner',
    ticket_url: 'https://example.com/tickets/12',
    poster_url: null,
    notes: 'Final Boston date before the band takes a hiatus',
    show_artists: [
      { artist: 'Glass Amber', position: 'Headliner', image_url: '/api/image-proxy?url=https://placehold.co/300x300/F59E0B/FFFFFF?text=GA', spotify_id: 'demo_glass_amber', spotify_url: 'https://open.spotify.com/artist/demo2' },
      { artist: 'Velvet Dusk', position: 'Support', image_url: '/api/image-proxy?url=https://placehold.co/300x300/EC4899/FFFFFF?text=VD', spotify_id: 'demo_velvet_dusk', spotify_url: 'https://open.spotify.com/artist/demo6' },
    ],
    created_at: '2026-03-12T00:00:00Z',
  },
]

// ──────────────────────────────────────────────
// RSVPs
// ──────────────────────────────────────────────
export const DEMO_RSVPS: RSVP[] = [
  // S1 — Neon Veil Infinite Mirror (past)
  { show_id: S1, name: 'alex rivers', status: 'going', updated_at: '2025-06-10T00:00:00Z' },
  { show_id: S1, name: 'jamie chen', status: 'going', updated_at: '2025-06-11T00:00:00Z' },
  { show_id: S1, name: 'sam taylor', status: 'going', updated_at: '2025-06-12T00:00:00Z' },
  { show_id: S1, name: 'morgan kelly', status: 'going', updated_at: '2025-06-13T00:00:00Z' },

  // S2 — Summer Bones Fest (past)
  { show_id: S2, name: 'alex rivers', status: 'going', updated_at: '2025-07-15T00:00:00Z' },
  { show_id: S2, name: 'jamie chen', status: 'going', updated_at: '2025-07-15T00:00:00Z' },
  { show_id: S2, name: 'riley brooks', status: 'going', updated_at: '2025-07-16T00:00:00Z' },

  // S3 — Glass Amber Acoustic (past)
  { show_id: S3, name: 'alex rivers', status: 'going', updated_at: '2025-09-01T00:00:00Z' },
  { show_id: S3, name: 'morgan kelly', status: 'going', updated_at: '2025-09-02T00:00:00Z' },

  // S4 — Static Bloom Pulse Tour (past)
  { show_id: S4, name: 'alex rivers', status: 'going', updated_at: '2025-10-25T00:00:00Z' },
  { show_id: S4, name: 'jamie chen', status: 'going', updated_at: '2025-10-26T00:00:00Z' },
  { show_id: S4, name: 'sam taylor', status: 'going', updated_at: '2025-10-27T00:00:00Z' },
  { show_id: S4, name: 'morgan kelly', status: 'going', updated_at: '2025-10-28T00:00:00Z' },
  { show_id: S4, name: 'riley brooks', status: 'going', updated_at: '2025-10-29T00:00:00Z' },

  // S5 — Hollow Pine Roots (past)
  { show_id: S5, name: 'alex rivers', status: 'going', updated_at: '2025-12-15T00:00:00Z' },
  { show_id: S5, name: 'sam taylor', status: 'going', updated_at: '2025-12-16T00:00:00Z' },

  // S6 — Velvet Dusk & Friends (past)
  { show_id: S6, name: 'alex rivers', status: 'going', updated_at: '2026-01-20T00:00:00Z' },
  { show_id: S6, name: 'jamie chen', status: 'going', updated_at: '2026-01-21T00:00:00Z' },
  { show_id: S6, name: 'riley brooks', status: 'going', updated_at: '2026-01-22T00:00:00Z' },

  // S7 — Neon Veil Release (upcoming)
  { show_id: S7, name: 'alex rivers', status: 'going', updated_at: '2026-03-01T00:00:00Z' },
  { show_id: S7, name: 'jamie chen', status: 'going', updated_at: '2026-03-02T00:00:00Z' },
  { show_id: S7, name: 'sam taylor', status: 'maybe', updated_at: '2026-03-03T00:00:00Z' },
  { show_id: S7, name: 'morgan kelly', status: 'going', updated_at: '2026-03-04T00:00:00Z' },

  // S8 — Static Bloom Warehouse (upcoming)
  { show_id: S8, name: 'alex rivers', status: 'going', updated_at: '2026-03-05T00:00:00Z' },
  { show_id: S8, name: 'riley brooks', status: 'maybe', updated_at: '2026-03-06T00:00:00Z' },

  // S9 — Copper Saints Double Header (upcoming)
  { show_id: S9, name: 'alex rivers', status: 'going', updated_at: '2026-03-07T00:00:00Z' },
  { show_id: S9, name: 'jamie chen', status: 'going', updated_at: '2026-03-08T00:00:00Z' },
  { show_id: S9, name: 'sam taylor', status: 'going', updated_at: '2026-03-09T00:00:00Z' },
  { show_id: S9, name: 'morgan kelly', status: 'not_going', updated_at: '2026-03-10T00:00:00Z' },

  // S10 — Luna Moth Debut (upcoming)
  { show_id: S10, name: 'jamie chen', status: 'going', updated_at: '2026-03-10T00:00:00Z' },
  { show_id: S10, name: 'riley brooks', status: 'going', updated_at: '2026-03-11T00:00:00Z' },

  // S11 — Summer Kickoff (upcoming)
  { show_id: S11, name: 'alex rivers', status: 'going', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S11, name: 'jamie chen', status: 'maybe', updated_at: '2026-03-12T00:00:00Z' },
  { show_id: S11, name: 'sam taylor', status: 'going', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S11, name: 'morgan kelly', status: 'going', updated_at: '2026-03-13T00:00:00Z' },
  { show_id: S11, name: 'riley brooks', status: 'going', updated_at: '2026-03-14T00:00:00Z' },

  // S12 — Glass Amber Farewell (upcoming)
  { show_id: S12, name: 'alex rivers', status: 'going', updated_at: '2026-03-14T00:00:00Z' },
  { show_id: S12, name: 'sam taylor', status: 'maybe', updated_at: '2026-03-14T00:00:00Z' },
]

// ──────────────────────────────────────────────
// Releases
// ──────────────────────────────────────────────
export const DEMO_RELEASES: Release[] = [
  {
    id: R1,
    artist_id: A1,
    spotify_id: 'demo_release_1',
    name: 'Infinite Mirror',
    release_type: 'album',
    release_date: '2026-03-28',
    spotify_url: 'https://open.spotify.com/album/demo1',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/8B5CF6/FFFFFF?text=IM',
    total_tracks: 12,
    external_urls: { spotify: 'https://open.spotify.com/album/demo1' },
    artists: [{ id: 'demo_neon_veil', name: 'Neon Veil' }],
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: R2,
    artist_id: A2,
    spotify_id: 'demo_release_2',
    name: 'Amber Waves',
    release_type: 'single',
    release_date: '2026-03-07',
    spotify_url: 'https://open.spotify.com/album/demo2',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/F59E0B/FFFFFF?text=AW',
    total_tracks: 1,
    external_urls: { spotify: 'https://open.spotify.com/album/demo2' },
    artists: [{ id: 'demo_glass_amber', name: 'Glass Amber' }],
    created_at: '2026-03-07T00:00:00Z',
  },
  {
    id: R3,
    artist_id: A4,
    spotify_id: 'demo_release_3',
    name: 'Pulse Protocol',
    release_type: 'album',
    release_date: '2026-02-14',
    spotify_url: 'https://open.spotify.com/album/demo3',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/EF4444/FFFFFF?text=PP',
    total_tracks: 10,
    external_urls: { spotify: 'https://open.spotify.com/album/demo3' },
    artists: [{ id: 'demo_static_bloom', name: 'Static Bloom' }],
    created_at: '2026-02-14T00:00:00Z',
  },
  {
    id: R4,
    artist_id: A3,
    spotify_id: 'demo_release_4',
    name: 'Winter Bark',
    release_type: 'ep',
    release_date: '2026-01-10',
    spotify_url: 'https://open.spotify.com/album/demo4',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/10B981/FFFFFF?text=WB',
    total_tracks: 5,
    external_urls: { spotify: 'https://open.spotify.com/album/demo4' },
    artists: [{ id: 'demo_hollow_pine', name: 'Hollow Pine' }],
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: R5,
    artist_id: A6,
    spotify_id: 'demo_release_5',
    name: 'Midnight Glow',
    release_type: 'single',
    release_date: '2026-03-12',
    spotify_url: 'https://open.spotify.com/album/demo5',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/EC4899/FFFFFF?text=MG',
    total_tracks: 1,
    external_urls: { spotify: 'https://open.spotify.com/album/demo5' },
    artists: [{ id: 'demo_velvet_dusk', name: 'Velvet Dusk' }],
    created_at: '2026-03-12T00:00:00Z',
  },
  {
    id: R6,
    artist_id: A5,
    spotify_id: 'demo_release_6',
    name: 'Broken Halos',
    release_type: 'album',
    release_date: '2025-11-22',
    spotify_url: 'https://open.spotify.com/album/demo6',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/F97316/FFFFFF?text=BH',
    total_tracks: 9,
    external_urls: { spotify: 'https://open.spotify.com/album/demo6' },
    artists: [{ id: 'demo_copper_saints', name: 'Copper Saints' }],
    created_at: '2025-11-22T00:00:00Z',
  },
  {
    id: R7,
    artist_id: A8,
    spotify_id: 'demo_release_7',
    name: 'Soft Landing',
    release_type: 'ep',
    release_date: '2026-02-28',
    spotify_url: 'https://open.spotify.com/album/demo7',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/6366F1/FFFFFF?text=SL',
    total_tracks: 4,
    external_urls: { spotify: 'https://open.spotify.com/album/demo7' },
    artists: [{ id: 'demo_luna_moth', name: 'Luna Moth' }],
    created_at: '2026-02-28T00:00:00Z',
  },
  {
    id: R8,
    artist_id: A7,
    spotify_id: 'demo_release_8',
    name: 'Iron Cathedral',
    release_type: 'single',
    release_date: '2026-03-01',
    spotify_url: 'https://open.spotify.com/album/demo8',
    image_url: '/api/image-proxy?url=https://placehold.co/300x300/78716C/FFFFFF?text=IC',
    total_tracks: 1,
    external_urls: { spotify: 'https://open.spotify.com/album/demo8' },
    artists: [{ id: 'demo_rust_ruin', name: 'Rust & Ruin' }],
    created_at: '2026-03-01T00:00:00Z',
  },
]

// ──────────────────────────────────────────────
// Costs (for past shows where users went)
// ──────────────────────────────────────────────
export const DEMO_COSTS: ShowCost[] = [
  // S1 — Neon Veil (alex)
  { id: C1, show_id: S1, user_id: 'alex rivers', category: 'ticket', amount_minor: 4500, currency: 'USD', note: 'GA ticket', created_at: '2025-06-10T00:00:00Z', updated_at: '2025-06-10T00:00:00Z' },
  { id: C2, show_id: S1, user_id: 'alex rivers', category: 'merch', amount_minor: 3500, currency: 'USD', note: 'Tour t-shirt', created_at: '2025-06-14T23:00:00Z', updated_at: '2025-06-14T23:00:00Z' },

  // S2 — Summer Bones Fest (alex)
  { id: C3, show_id: S2, user_id: 'alex rivers', category: 'ticket', amount_minor: 7500, currency: 'USD', note: 'Day pass', created_at: '2025-07-10T00:00:00Z', updated_at: '2025-07-10T00:00:00Z' },
  { id: C4, show_id: S2, user_id: 'alex rivers', category: 'food_drink', amount_minor: 2200, currency: 'USD', note: 'Beer + tacos', created_at: '2025-07-19T22:00:00Z', updated_at: '2025-07-19T22:00:00Z' },

  // S4 — Static Bloom (alex)
  { id: C5, show_id: S4, user_id: 'alex rivers', category: 'ticket', amount_minor: 5500, currency: 'USD', note: null, created_at: '2025-10-20T00:00:00Z', updated_at: '2025-10-20T00:00:00Z' },
  { id: C6, show_id: S4, user_id: 'alex rivers', category: 'rideshare', amount_minor: 1800, currency: 'USD', note: 'Uber home', created_at: '2025-10-31T23:00:00Z', updated_at: '2025-10-31T23:00:00Z' },

  // S6 — Velvet Dusk (alex)
  { id: C7, show_id: S6, user_id: 'alex rivers', category: 'ticket', amount_minor: 3000, currency: 'USD', note: null, created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-10T00:00:00Z' },

  // S1 — Neon Veil (jamie)
  { id: C8, show_id: S1, user_id: 'jamie chen', category: 'ticket', amount_minor: 4500, currency: 'USD', note: 'GA ticket', created_at: '2025-06-11T00:00:00Z', updated_at: '2025-06-11T00:00:00Z' },
]
