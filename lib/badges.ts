// ---------------------------------------------------------------------------
// Badge system -- single source of truth for definitions, evaluation,
// and persistence.  Badge images will live in Vercel Blob at the path
//   {NEXT_PUBLIC_BADGE_IMAGE_BASE}/{badge_key}.png
// Until images are uploaded the UI renders a fallback icon.
//
// Badges have a "scope": either "lifetime" (computed across all time)
// or "year" (computed per calendar year). Year-scoped badges can be
// unlocked once per year; lifetime badges once ever.
// ---------------------------------------------------------------------------

import { supabase } from '@/lib/db'

// ---------------------------------------------------------------------------
// 1. Types
// ---------------------------------------------------------------------------

export type BadgeCategory =
  | 'attendance'
  | 'streaks'
  | 'venues'
  | 'artists'
  | 'social'
  | 'merch'

export type BadgeScope = 'lifetime' | 'year'

export interface BadgeDefinition {
  key: string
  name: string
  description: string
  category: BadgeCategory
  scope: BadgeScope
  /** Human-readable explanation of the unlock criteria */
  criteria: string
  /** Optional threshold used for progress display */
  threshold?: number
}

export interface UnlockedBadge {
  badge_key: string
  scope_year: number | null
  unlocked_at: string
  metadata: Record<string, unknown> | null
}

export interface BadgeWithStatus extends BadgeDefinition {
  unlocked: boolean
  unlocked_at: string | null
  scope_year: number | null
  metadata: Record<string, unknown> | null
}

// ---------------------------------------------------------------------------
// 2. Badge image helper
// ---------------------------------------------------------------------------

const BADGE_IMAGE_BASE = process.env.NEXT_PUBLIC_BADGE_IMAGE_BASE ?? ''

/**
 * Returns the image URL for a badge, or null if no base URL is configured.
 * Convention: `{base}/{badge_key}.png`  (same image regardless of year)
 */
export function getBadgeImageUrl(badgeKey: string): string | null {
  if (!BADGE_IMAGE_BASE) return null
  return `${BADGE_IMAGE_BASE}/${badgeKey}.png`
}

// ---------------------------------------------------------------------------
// 3. Badge registry
// ---------------------------------------------------------------------------

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ======== LIFETIME BADGES ========

  // ---- Attendance Milestones (lifetime) ----
  {
    key: 'first_show',
    name: 'Debut',
    description: 'You made it to your first show.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'RSVP "going" to at least 1 past show.',
    threshold: 1,
  },
  {
    key: 'shows_5',
    name: 'Getting Hooked',
    description: '5 shows deep — no turning back now.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 5 past shows.',
    threshold: 5,
  },
  {
    key: 'shows_10',
    name: 'Double Digits',
    description: '10 shows in the books.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 10 past shows.',
    threshold: 10,
  },
  {
    key: 'shows_25',
    name: 'Veteran',
    description: '25 shows — you\'ve earned your stripes.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 25 past shows.',
    threshold: 25,
  },
  {
    key: 'shows_50',
    name: 'Fifty Club',
    description: '50 shows. Legend status.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 50 past shows.',
    threshold: 50,
  },
  {
    key: 'shows_100',
    name: 'Century',
    description: '100 shows. That\'s commitment.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 100 past shows.',
    threshold: 100,
  },

  // ---- Venues & Cities (lifetime) ----
  {
    key: 'venue_explorer',
    name: '10 Venues',
    description: 'You\'ve been to 10 different spots.',
    category: 'venues',
    scope: 'lifetime',
    criteria: '10+ distinct venues across all attended shows.',
    threshold: 10,
  },
  {
    key: 'venue_collector',
    name: '20 Venues',
    description: '20 venues and counting.',
    category: 'venues',
    scope: 'lifetime',
    criteria: '20+ distinct venues across all attended shows.',
    threshold: 20,
  },

  // ---- Artists (lifetime) ----
  {
    key: 'artist_devotee',
    name: 'Ride or Die',
    description: 'Seen the same artist at 5 different shows.',
    category: 'artists',
    scope: 'lifetime',
    criteria: 'Any artist appears on 5+ distinct attended shows.',
    threshold: 5,
  },
  {
    key: 'diverse_taste',
    name: 'All Over the Map',
    description: '25 unique artists across all your shows.',
    category: 'artists',
    scope: 'lifetime',
    criteria: '25+ distinct artist names across all attended shows.',
    threshold: 25,
  },

  // ---- Social (lifetime) ----
  {
    key: 'dynamic_duo',
    name: 'Dynamic Duo',
    description: '5 shows with the same person.',
    category: 'social',
    scope: 'lifetime',
    criteria: 'Any other user co-attended 5+ of the same shows.',
    threshold: 5,
  },

  // ======== YEAR-SCOPED BADGES ========

  // ---- Attendance (year) ----
  {
    key: 'yearly_warrior',
    name: 'Year Warrior',
    description: '12+ shows this year. One a month.',
    category: 'attendance',
    scope: 'year',
    criteria: '12+ attended shows in the target year.',
    threshold: 12,
  },

  // ---- Streaks & Timing (year) ----
  {
    key: 'back_to_back',
    name: 'Back to Back',
    description: 'Shows on consecutive nights.',
    category: 'streaks',
    scope: 'year',
    criteria: 'Two attended shows in the same year whose dates are exactly 1 day apart.',
  },
  {
    key: 'three_in_a_week',
    name: 'Three-Peat',
    description: '3 shows in a single week.',
    category: 'streaks',
    scope: 'year',
    criteria: 'Sliding 7-day window within the year containing 3+ attended shows.',
  },
  {
    key: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: '5 weekend shows this year.',
    category: 'streaks',
    scope: 'year',
    criteria: '5+ attended shows in the year falling on Fri/Sat/Sun.',
    threshold: 5,
  },
  {
    key: 'monthly_streak_3',
    name: 'On a Roll',
    description: 'A show every month for 3 months straight.',
    category: 'streaks',
    scope: 'year',
    criteria: '3 consecutive calendar months within the year each containing 1+ attended show.',
  },
  {
    key: 'night_owl',
    name: 'Night Owl',
    description: 'Caught a show starting at 10 PM or later.',
    category: 'streaks',
    scope: 'year',
    criteria: 'An attended show in the year with time_local >= "22:00".',
  },

  // ---- Venues & Cities (year) ----
  {
    key: 'venue_regular',
    name: 'Regular',
    description: 'Same venue 5 times this year.',
    category: 'venues',
    scope: 'year',
    criteria: 'Any single venue appears 5+ times in attended shows within the year.',
    threshold: 5,
  },
  {
    key: 'city_hopper',
    name: 'City Hopper',
    description: 'Shows in 3+ different cities.',
    category: 'venues',
    scope: 'year',
    criteria: '3+ distinct cities across attended shows within the year.',
    threshold: 3,
  },
  {
    key: 'home_turf',
    name: 'Home Turf',
    description: '10 shows in one city.',
    category: 'venues',
    scope: 'year',
    criteria: 'Any single city appears 10+ times in attended shows within the year.',
    threshold: 10,
  },

  // ---- Artists (year) ----
  {
    key: 'artist_fan',
    name: 'Super Fan',
    description: 'Same artist at 3 different shows.',
    category: 'artists',
    scope: 'year',
    criteria: 'Any artist appears on 3+ distinct attended shows within the year.',
    threshold: 3,
  },
  {
    key: 'headliner_collector',
    name: 'Headliner Hunter',
    description: '10 unique headliners this year.',
    category: 'artists',
    scope: 'year',
    criteria: '10+ distinct "Headliner" artist names across attended shows within the year.',
    threshold: 10,
  },
  {
    key: 'local_champion',
    name: 'Local Supporter',
    description: '10 shows with a local act on the bill.',
    category: 'artists',
    scope: 'year',
    criteria: '10+ attended shows within the year that include a "Local" artist.',
    threshold: 10,
  },

  // ---- Social (year) ----
  {
    key: 'solo_adventurer',
    name: 'Lone Wolf',
    description: 'Went to a show solo.',
    category: 'social',
    scope: 'year',
    criteria: 'At least 1 attended show within the year where the user is the only "going" RSVP.',
  },
  {
    key: 'squad_goals',
    name: 'Squad Up',
    description: 'Rolled up with 5+ other people.',
    category: 'social',
    scope: 'year',
    criteria: 'An attended show within the year with 6+ total "going" RSVPs.',
  },
  {
    key: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Shared shows with 10 different people.',
    category: 'social',
    scope: 'year',
    criteria: '10+ distinct co-attendees across attended shows within the year.',
    threshold: 10,
  },

  // ======== MERCH LIFETIME BADGES ========

  {
    key: 'first_merch',
    name: 'Souvenir',
    description: 'Your first piece of merch.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 1+ merch item.',
    threshold: 1,
  },
  {
    key: 'merch_10',
    name: 'Collector',
    description: '10 items in the collection.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 10+ merch items.',
    threshold: 10,
  },
  {
    key: 'merch_25',
    name: 'Hoarder',
    description: '25 items — you might need more closet space.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 25+ merch items.',
    threshold: 25,
  },
  {
    key: 'merch_50',
    name: 'Walking Merch Booth',
    description: '50 pieces. You ARE the merch table.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 50+ merch items.',
    threshold: 50,
  },
  {
    key: 'merch_signed',
    name: 'Autograph Hunter',
    description: 'Got your first signed item.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 1+ signed merch item.',
    threshold: 1,
  },
  {
    key: 'merch_signed_5',
    name: 'Pen Pal',
    description: '5 signed items in the collection.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 5+ signed merch items.',
    threshold: 5,
  },
  {
    key: 'merch_limited',
    name: 'Rare Find',
    description: 'Own a limited edition piece.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 1+ limited edition merch item.',
    threshold: 1,
  },
  {
    key: 'merch_artist_variety',
    name: 'Merch Sampler',
    description: 'Merch from 5 different artists.',
    category: 'merch',
    scope: 'lifetime',
    criteria: '5+ distinct artists across merch items.',
    threshold: 5,
  },
  {
    key: 'merch_artist_variety_10',
    name: 'Brand Ambassador',
    description: 'Merch from 10 different artists.',
    category: 'merch',
    scope: 'lifetime',
    criteria: '10+ distinct artists across merch items.',
    threshold: 10,
  },
  {
    key: 'merch_big_spender',
    name: 'Big Spender',
    description: 'Spent $500+ on merch total.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Total merch spend >= $500 (50000 minor units).',
    threshold: 50000,
  },
  {
    key: 'merch_whale',
    name: 'The Whale',
    description: 'Spent $1,000+ on merch total.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Total merch spend >= $1,000 (100000 minor units).',
    threshold: 100000,
  },
  {
    key: 'merch_category_variety',
    name: 'A Bit of Everything',
    description: 'Own merch across 5+ different categories.',
    category: 'merch',
    scope: 'lifetime',
    criteria: '5+ distinct categories across merch items.',
    threshold: 5,
  },
  {
    key: 'merch_custom',
    name: 'DIY Fan',
    description: 'Own a custom or fan-made piece.',
    category: 'merch',
    scope: 'lifetime',
    criteria: 'Own 1+ custom/fan-made merch item.',
    threshold: 1,
  },

  // ======== MERCH YEAR-SCOPED BADGES ========

  {
    key: 'merch_yearly_5',
    name: 'Yearly Haul',
    description: '5 merch items acquired this year.',
    category: 'merch',
    scope: 'year',
    criteria: '5+ merch items with purchase_date in the target year.',
    threshold: 5,
  },
  {
    key: 'merch_show_linked',
    name: 'Show Shopper',
    description: 'Bought merch at 3 different shows this year.',
    category: 'merch',
    scope: 'year',
    criteria: '3+ distinct show_id links on merch items with purchase_date in the target year.',
    threshold: 3,
  },

]

/** Quick lookup map */
export const BADGE_MAP: Record<string, BadgeDefinition> = Object.fromEntries(
  BADGE_DEFINITIONS.map((b) => [b.key, b]),
)

export const LIFETIME_BADGES = BADGE_DEFINITIONS.filter((b) => b.scope === 'lifetime')
export const YEAR_BADGES = BADGE_DEFINITIONS.filter((b) => b.scope === 'year')

// ---------------------------------------------------------------------------
// 4. Data fetching helpers
// ---------------------------------------------------------------------------

interface AttendedShow {
  id: string
  date_time: string
  time_local: string
  venue: string
  city: string
  show_artists: Array<{
    artist: string
    position: 'Headliner' | 'Support' | 'Local'
    spotify_id?: string
    image_url?: string
  }>
}

interface CoAttendance {
  show_id: string
  name: string
}

/**
 * Fetch all past shows that the user RSVP'd "going" to.
 */
async function fetchAttendedShows(userId: string): Promise<AttendedShow[]> {
  const { data: rsvpData, error: rsvpError } = await supabase
    .from('rsvps')
    .select('show_id')
    .eq('name', userId)
    .eq('status', 'going')

  if (rsvpError || !rsvpData) return []

  const showIds = rsvpData.map((r) => r.show_id)
  if (showIds.length === 0) return []

  const { data: shows, error: showsError } = await supabase
    .from('shows')
    .select('id, date_time, time_local, venue, city, show_artists')
    .lt('date_time', new Date().toISOString())
    .in('id', showIds)
    .order('date_time', { ascending: true })

  if (showsError || !shows) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return shows.map((s: any) => ({
    ...s,
    show_artists: Array.isArray(s.show_artists) ? s.show_artists : [],
  }))
}

async function fetchCoAttendance(showIds: string[]): Promise<CoAttendance[]> {
  if (showIds.length === 0) return []
  const { data, error } = await supabase
    .from('rsvps')
    .select('show_id, name')
    .in('show_id', showIds)
    .eq('status', 'going')

  if (error || !data) return []
  return data as CoAttendance[]
}

// ---------------------------------------------------------------------------
// Merch data for badge evaluation
// ---------------------------------------------------------------------------

interface MerchForBadges {
  id: string
  artist_name: string
  artist_spotify_id: string | null
  artist_image_url: string | null
  category: string
  is_signed: boolean
  is_limited_edition: boolean
  is_custom: boolean
  purchase_price_minor: number | null
  purchase_date: string | null
  show_id: string | null
}

async function fetchMerchItems(userId: string): Promise<MerchForBadges[]> {
  const { data, error } = await supabase
    .from('merch_items')
    .select('id, artist_name, category, is_signed, is_limited_edition, is_custom, purchase_price_minor, purchase_date, show_id, artists(spotify_id, image_url)')
    .eq('user_id', userId)

  if (error || !data) return []
  return (data as Record<string, unknown>[]).map((row) => {
    const artist = row.artists as { spotify_id: string; image_url: string | null } | null
    return {
      id: row.id as string,
      artist_name: row.artist_name as string,
      artist_spotify_id: artist?.spotify_id ?? null,
      artist_image_url: artist?.image_url ?? null,
      category: row.category as string,
      is_signed: row.is_signed as boolean,
      is_limited_edition: row.is_limited_edition as boolean,
      is_custom: row.is_custom as boolean,
      purchase_price_minor: row.purchase_price_minor as number | null,
      purchase_date: row.purchase_date as string | null,
      show_id: row.show_id as string | null,
    }
  })
}

/**
 * Fetch all unlocked badges for a user, keyed by "badge_key|scope_year"
 */
async function fetchUnlockedBadges(
  userId: string,
): Promise<Map<string, UnlockedBadge>> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_key, scope_year, unlocked_at, metadata')
    .eq('user_id', userId)

  const map = new Map<string, UnlockedBadge>()
  if (error || !data) return map

  for (const row of data) {
    const key = unlockKey(row.badge_key, row.scope_year)
    map.set(key, row as UnlockedBadge)
  }
  return map
}

/** Composite key for deduplication: "badge_key|null" or "badge_key|2025" */
function unlockKey(badgeKey: string, scopeYear: number | null): string {
  return `${badgeKey}|${scopeYear ?? 'null'}`
}

// ---------------------------------------------------------------------------
// 5. Badge evaluation logic
// ---------------------------------------------------------------------------

interface EvalContext {
  userId: string
  allShows: AttendedShow[]
  coAttendance: CoAttendance[]
  merchItems: MerchForBadges[]
  alreadyUnlocked: Map<string, UnlockedBadge>
}

/** A badge to be newly unlocked */
interface BadgeGrant {
  key: string
  scope_year: number | null
  metadata?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// 5b. Secret artist badges — curated list
// ---------------------------------------------------------------------------
//
// To add a new secret artist badge:
//   1. Add an entry to SECRET_ARTIST_BADGES below.
//   2. Set `spotify_id` to the artist's Spotify ID (from the URL).
//   3. Give it a unique `key` (convention: "secret_<short_name>").
//   4. Write a custom `name` and `description` — this is what shows
//      when the user unlocks it.
//   5. Optionally set `image_url` for a custom badge image, otherwise
//      the artist's Spotify image from the show data is used.
//
// These badges are HIDDEN until unlocked. The user won't know which
// artists have secret badges. They unlock once (lifetime) when the
// user has attended any show featuring that artist.
// ---------------------------------------------------------------------------

export interface SecretArtistBadge {
  /** Unique badge key stored in DB, e.g. "secret_excision" */
  key: string
  /** Spotify artist ID — matched against show_artists[].spotify_id */
  spotify_id: string
  /** Display name shown when unlocked */
  name: string
  /** Flavor text shown when unlocked */
  description: string
  /** Optional custom image URL; falls back to artist image from show data */
  image_url?: string
  /** 'lifetime' = unlocks once ever, 'year' = unlocks each year the artist is seen */
  scope: 'lifetime' | 'year'
}

/**
 * Fetch secret artist badge definitions from the database.
 * These are managed via the admin UI at /my-profile/badges/admin.
 */
export async function fetchSecretArtistBadges(): Promise<SecretArtistBadge[]> {
  const { data, error } = await supabase
    .from('secret_badge_definitions')
    .select('key, spotify_id, name, description, image_url, scope')
    .order('created_at', { ascending: true })

  if (error || !data) return []
  return data as SecretArtistBadge[]
}

/**
 * Filter shows to a specific year by date_time.
 */
function showsForYear(shows: AttendedShow[], year: number): AttendedShow[] {
  return shows.filter((s) => new Date(s.date_time).getUTCFullYear() === year)
}

/**
 * Compute lifetime badges that should be newly unlocked.
 */
function computeLifetimeBadges(ctx: EvalContext): BadgeGrant[] {
  const grants: BadgeGrant[] = []

  function grant(key: string) {
    const k = unlockKey(key, null)
    if (!ctx.alreadyUnlocked.has(k)) {
      grants.push({ key, scope_year: null })
    }
  }

  const shows = ctx.allShows
  const count = shows.length

  // ---- Attendance milestones ----
  if (count >= 1) grant('first_show')
  if (count >= 5) grant('shows_5')
  if (count >= 10) grant('shows_10')
  if (count >= 25) grant('shows_25')
  if (count >= 50) grant('shows_50')
  if (count >= 100) grant('shows_100')

  // ---- Venues (lifetime) ----
  const allVenues = new Set<string>()
  for (const s of shows) {
    allVenues.add(s.venue.toLowerCase().trim())
  }
  if (allVenues.size >= 10) grant('venue_explorer')
  if (allVenues.size >= 20) grant('venue_collector')

  // ---- Artists (lifetime) ----
  const artistShowCount = new Map<string, number>()
  const allArtists = new Set<string>()
  for (const s of shows) {
    const seenInShow = new Set<string>()
    for (const a of s.show_artists) {
      const name = a.artist.toLowerCase().trim()
      allArtists.add(name)
      if (!seenInShow.has(name)) {
        seenInShow.add(name)
        artistShowCount.set(name, (artistShowCount.get(name) ?? 0) + 1)
      }
    }
  }
  const maxArtistCount = artistShowCount.size > 0
    ? Math.max(...artistShowCount.values())
    : 0
  if (maxArtistCount >= 5) grant('artist_devotee')
  if (allArtists.size >= 25) grant('diverse_taste')

  // ---- Social (lifetime) ----
  const showGoingMap = new Map<string, Set<string>>()
  for (const ca of ctx.coAttendance) {
    if (!showGoingMap.has(ca.show_id)) showGoingMap.set(ca.show_id, new Set())
    showGoingMap.get(ca.show_id)!.add(ca.name)
  }
  const friendCounts = new Map<string, number>()
  for (const s of shows) {
    const goingSet = showGoingMap.get(s.id) ?? new Set()
    for (const name of goingSet) {
      if (name !== ctx.userId) {
        friendCounts.set(name, (friendCounts.get(name) ?? 0) + 1)
      }
    }
  }
  const maxFriendCount = friendCounts.size > 0
    ? Math.max(...friendCounts.values())
    : 0
  if (maxFriendCount >= 5) grant('dynamic_duo')

  return grants
}

/**
 * Compute year-scoped badges for a specific year.
 */
function computeYearBadges(ctx: EvalContext, year: number): BadgeGrant[] {
  const grants: BadgeGrant[] = []

  function grant(key: string) {
    const k = unlockKey(key, year)
    if (!ctx.alreadyUnlocked.has(k)) {
      grants.push({ key, scope_year: year })
    }
  }

  const shows = showsForYear(ctx.allShows, year)
  const count = shows.length
  if (count === 0) return grants

  // ---- Attendance (year) ----
  if (count >= 12) grant('yearly_warrior')

  // ---- Streaks & Timing ----
  const dates = shows.map((s) => new Date(s.date_time))

  // Back to back
  if (count >= 2) {
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.abs(dates[i].getTime() - dates[i - 1].getTime())
      const diffDays = diff / (1000 * 60 * 60 * 24)
      if (diffDays <= 1.1) {
        grant('back_to_back')
        break
      }
    }
  }

  // Triple threat
  if (count >= 3) {
    for (let i = 0; i <= dates.length - 3; i++) {
      const span =
        (dates[i + 2].getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24)
      if (span <= 7) {
        grant('three_in_a_week')
        break
      }
    }
  }

  // Weekend warrior
  const weekendCount = dates.filter((d) => {
    const day = d.getUTCDay()
    return day === 0 || day === 5 || day === 6
  }).length
  if (weekendCount >= 5) grant('weekend_warrior')

  // Monthly streak of 3
  if (count >= 3) {
    const monthSet = new Set<number>()
    for (const d of dates) {
      monthSet.add(d.getUTCMonth())
    }
    const monthArr = Array.from(monthSet).sort((a, b) => a - b)
    let streak = 1
    for (let i = 1; i < monthArr.length; i++) {
      if (monthArr[i] === monthArr[i - 1] + 1) {
        streak++
        if (streak >= 3) {
          grant('monthly_streak_3')
          break
        }
      } else {
        streak = 1
      }
    }
  }

  // Night owl
  for (const s of shows) {
    if (s.time_local && s.time_local >= '22:00') {
      grant('night_owl')
      break
    }
  }

  // ---- Venues & Cities (year) ----
  const venueCounts = new Map<string, number>()
  const cityCounts = new Map<string, number>()
  for (const s of shows) {
    const v = s.venue.toLowerCase().trim()
    const c = s.city.toLowerCase().trim()
    venueCounts.set(v, (venueCounts.get(v) ?? 0) + 1)
    cityCounts.set(c, (cityCounts.get(c) ?? 0) + 1)
  }
  const maxVenueCount = venueCounts.size > 0
    ? Math.max(...venueCounts.values())
    : 0
  const maxCityCount = cityCounts.size > 0
    ? Math.max(...cityCounts.values())
    : 0

  if (maxVenueCount >= 5) grant('venue_regular')
  if (cityCounts.size >= 3) grant('city_hopper')
  if (maxCityCount >= 10) grant('home_turf')

  // ---- Artists (year) ----
  const artistShowCount = new Map<string, number>()
  const headliners = new Set<string>()
  let showsWithLocal = 0

  for (const s of shows) {
    const seenInShow = new Set<string>()
    let hasLocal = false
    for (const a of s.show_artists) {
      const name = a.artist.toLowerCase().trim()
      if (!seenInShow.has(name)) {
        seenInShow.add(name)
        artistShowCount.set(name, (artistShowCount.get(name) ?? 0) + 1)
      }
      if (a.position === 'Headliner') headliners.add(name)
      if (a.position === 'Local') hasLocal = true
    }
    if (hasLocal) showsWithLocal++
  }

  const maxArtistCount = artistShowCount.size > 0
    ? Math.max(...artistShowCount.values())
    : 0
  if (maxArtistCount >= 3) grant('artist_fan')
  if (headliners.size >= 10) grant('headliner_collector')
  if (showsWithLocal >= 10) grant('local_champion')

  // ---- Social (year) ----
  const showGoingMap = new Map<string, Set<string>>()
  const yearShowIds = new Set(shows.map((s) => s.id))
  for (const ca of ctx.coAttendance) {
    if (!yearShowIds.has(ca.show_id)) continue
    if (!showGoingMap.has(ca.show_id)) showGoingMap.set(ca.show_id, new Set())
    showGoingMap.get(ca.show_id)!.add(ca.name)
  }

  let hasSolo = false
  let hasSquad = false
  const allFriends = new Set<string>()

  for (const s of shows) {
    const goingSet = showGoingMap.get(s.id) ?? new Set()
    const goingCount = goingSet.size

    if (goingCount === 1 && goingSet.has(ctx.userId)) hasSolo = true
    if (goingCount >= 6 && goingSet.has(ctx.userId)) hasSquad = true

    for (const name of goingSet) {
      if (name !== ctx.userId) allFriends.add(name)
    }
  }

  if (hasSolo) grant('solo_adventurer')
  if (hasSquad) grant('squad_goals')
  if (allFriends.size >= 10) grant('social_butterfly')

  return grants
}

/**
 * Compute lifetime merch badges.
 */
function computeLifetimeMerchBadges(ctx: EvalContext): BadgeGrant[] {
  const grants: BadgeGrant[] = []
  const items = ctx.merchItems

  function grant(key: string) {
    const k = unlockKey(key, null)
    if (!ctx.alreadyUnlocked.has(k)) {
      grants.push({ key, scope_year: null })
    }
  }

  if (items.length === 0) return grants

  // Item count milestones
  if (items.length >= 1) grant('first_merch')
  if (items.length >= 10) grant('merch_10')
  if (items.length >= 25) grant('merch_25')
  if (items.length >= 50) grant('merch_50')

  // Signed
  const signedCount = items.filter(i => i.is_signed).length
  if (signedCount >= 1) grant('merch_signed')
  if (signedCount >= 5) grant('merch_signed_5')

  // Limited edition
  if (items.some(i => i.is_limited_edition)) grant('merch_limited')

  // Custom
  if (items.some(i => i.is_custom)) grant('merch_custom')

  // Artist variety
  const artists = new Set(items.map(i => i.artist_name.toLowerCase().trim()))
  if (artists.size >= 5) grant('merch_artist_variety')
  if (artists.size >= 10) grant('merch_artist_variety_10')

  // Category variety
  const categories = new Set(items.map(i => i.category))
  if (categories.size >= 5) grant('merch_category_variety')

  // Spending
  const totalSpent = items.reduce((sum, i) => sum + (i.purchase_price_minor ?? 0), 0)
  if (totalSpent >= 50000) grant('merch_big_spender')
  if (totalSpent >= 100000) grant('merch_whale')

  return grants
}

/**
 * Compute year-scoped merch badges for a specific year.
 */
function computeYearMerchBadges(ctx: EvalContext, year: number): BadgeGrant[] {
  const grants: BadgeGrant[] = []

  function grant(key: string) {
    const k = unlockKey(key, year)
    if (!ctx.alreadyUnlocked.has(k)) {
      grants.push({ key, scope_year: year })
    }
  }

  // Filter merch items by purchase_date in the target year
  const yearItems = ctx.merchItems.filter(i => {
    if (!i.purchase_date) return false
    return new Date(i.purchase_date).getUTCFullYear() === year
  })

  if (yearItems.length === 0) return grants

  // Yearly haul
  if (yearItems.length >= 5) grant('merch_yearly_5')

  // Show shopper — distinct shows linked
  const linkedShows = new Set(yearItems.filter(i => i.show_id).map(i => i.show_id))
  if (linkedShows.size >= 3) grant('merch_show_linked')

  return grants
}

/**
 * Compute secret artist badges. Lifetime definitions unlock once ever;
 * year-scoped definitions unlock per year the artist is seen.
 */
function computeSecretArtistBadges(
  ctx: EvalContext,
  definitions: SecretArtistBadge[],
  targetYears: number[],
): BadgeGrant[] {
  if (definitions.length === 0) return []

  const grants: BadgeGrant[] = []

  // Collect all spotify IDs seen across ALL shows (for lifetime)
  const seenAllTime = new Map<string, { artist_name: string; image_url?: string }>()
  // Collect spotify IDs seen per year (for year-scoped)
  const seenByYear = new Map<number, Map<string, { artist_name: string; image_url?: string }>>()

  for (const s of ctx.allShows) {
    const year = new Date(s.date_time).getUTCFullYear()
    if (!seenByYear.has(year)) seenByYear.set(year, new Map())
    const yearMap = seenByYear.get(year)!
    for (const a of s.show_artists) {
      if (!a.spotify_id) continue
      const info = { artist_name: a.artist, image_url: a.image_url }
      if (!seenAllTime.has(a.spotify_id)) seenAllTime.set(a.spotify_id, info)
      if (!yearMap.has(a.spotify_id)) yearMap.set(a.spotify_id, info)
    }
  }

  for (const secret of definitions) {
    const meta = (seen: { artist_name: string; image_url?: string }) => ({
      artist_name: seen.artist_name,
      spotify_id: secret.spotify_id,
      image_url: secret.image_url ?? seen.image_url ?? null,
    })

    if (secret.scope === 'year') {
      // Grant per year the artist appeared
      for (const year of targetYears) {
        const k = unlockKey(secret.key, year)
        if (ctx.alreadyUnlocked.has(k)) continue
        const seen = seenByYear.get(year)?.get(secret.spotify_id)
        if (!seen) continue
        grants.push({ key: secret.key, scope_year: year, metadata: meta(seen) })
      }
    } else {
      // Lifetime: unlock once
      const k = unlockKey(secret.key, null)
      if (ctx.alreadyUnlocked.has(k)) continue
      const seen = seenAllTime.get(secret.spotify_id)
      if (!seen) continue
      grants.push({ key: secret.key, scope_year: null, metadata: meta(seen) })
    }
  }

  return grants
}

/**
 * Compute secret merch badges. Uses the same secret artist definitions —
 * if the user owns merch by a secret artist, they get a "secret_merch_<key>" badge.
 * Lifetime definitions unlock once; year-scoped unlock per purchase year.
 */
function computeSecretMerchBadges(
  ctx: EvalContext,
  definitions: SecretArtistBadge[],
  targetYears: number[],
): BadgeGrant[] {
  if (definitions.length === 0 || ctx.merchItems.length === 0) return []

  const grants: BadgeGrant[] = []

  // Collect all spotify IDs from merch (for lifetime)
  const merchAllTime = new Map<string, { artist_name: string; image_url?: string | null }>()
  // Collect spotify IDs per purchase year (for year-scoped)
  const merchByYear = new Map<number, Map<string, { artist_name: string; image_url?: string | null }>>()

  for (const m of ctx.merchItems) {
    if (!m.artist_spotify_id) continue
    const info = { artist_name: m.artist_name, image_url: m.artist_image_url }
    if (!merchAllTime.has(m.artist_spotify_id)) merchAllTime.set(m.artist_spotify_id, info)
    if (m.purchase_date) {
      const year = new Date(m.purchase_date).getUTCFullYear()
      if (!merchByYear.has(year)) merchByYear.set(year, new Map())
      const yearMap = merchByYear.get(year)!
      if (!yearMap.has(m.artist_spotify_id)) yearMap.set(m.artist_spotify_id, info)
    }
  }

  for (const secret of definitions) {
    const merchKey = `secret_merch_${secret.key.replace(/^secret_/, '')}`

    const meta = (info: { artist_name: string; image_url?: string | null }) => ({
      artist_name: info.artist_name,
      spotify_id: secret.spotify_id,
      image_url: secret.image_url ?? info.image_url ?? null,
    })

    if (secret.scope === 'year') {
      for (const year of targetYears) {
        const k = unlockKey(merchKey, year)
        if (ctx.alreadyUnlocked.has(k)) continue
        const info = merchByYear.get(year)?.get(secret.spotify_id)
        if (!info) continue
        grants.push({ key: merchKey, scope_year: year, metadata: meta(info) })
      }
    } else {
      const k = unlockKey(merchKey, null)
      if (ctx.alreadyUnlocked.has(k)) continue
      const info = merchAllTime.get(secret.spotify_id)
      if (!info) continue
      grants.push({ key: merchKey, scope_year: null, metadata: meta(info) })
    }
  }

  return grants
}

// ---------------------------------------------------------------------------
// 6. Persistence -- idempotent unlock
// ---------------------------------------------------------------------------

/**
 * Inserts newly earned badges. Each insert individually so Postgres can
 * enforce the COALESCE-based unique index. Duplicate violations are ignored.
 */
async function persistBadges(
  userId: string,
  grants: BadgeGrant[],
): Promise<void> {
  if (grants.length === 0) return

  for (const g of grants) {
    const row: Record<string, unknown> = {
      user_id: userId,
      badge_key: g.key,
      scope_year: g.scope_year,
      unlocked_at: new Date().toISOString(),
    }
    if (g.metadata) {
      row.metadata = g.metadata
    }

    const { error } = await supabase.from('user_badges').insert(row)

    // Silently ignore unique-violation (badge already unlocked)
    if (error && error.code !== '23505') {
      console.error('[badges] insert failed:', error)
    }
  }
}

// ---------------------------------------------------------------------------
// 7. Public API
// ---------------------------------------------------------------------------

/**
 * Evaluate and persist badges for a single user.
 * @param userId  - the user name (lowercase)
 * @param years   - optional: only evaluate these year-scoped years.
 *                  If omitted, evaluates all years the user has shows in.
 * Returns the list of newly unlocked badge identifiers.
 */
export async function evaluateAndUnlockBadges(
  userId: string,
  years?: number[],
): Promise<string[]> {
  try {
    const [allShows, alreadyUnlocked, secretDefs, merchItems] =
      await Promise.all([
        fetchAttendedShows(userId),
        fetchUnlockedBadges(userId),
        fetchSecretArtistBadges(),
        fetchMerchItems(userId),
      ])

    const showIds = allShows.map((s) => s.id)
    const coAttendance = await fetchCoAttendance(showIds)

    const ctx: EvalContext = {
      userId,
      allShows,
      coAttendance,
      merchItems,
      alreadyUnlocked,
    }

    // Compute lifetime badges
    const lifetimeGrants = computeLifetimeBadges(ctx)

    // Compute lifetime merch badges
    const lifetimeMerchGrants = computeLifetimeMerchBadges(ctx)

    // Determine which years to evaluate
    const allYears = new Set<number>()
    for (const s of allShows) {
      allYears.add(new Date(s.date_time).getUTCFullYear())
    }
    // Also include years from merch purchase dates
    for (const m of merchItems) {
      if (m.purchase_date) {
        allYears.add(new Date(m.purchase_date).getUTCFullYear())
      }
    }
    const targetYears = years
      ? years.filter((y) => allYears.has(y))
      : Array.from(allYears)

    // Compute secret artist badges (lifetime + year-scoped)
    const secretGrants = computeSecretArtistBadges(ctx, secretDefs, targetYears)

    // Compute secret merch badges (same artist definitions, merch ownership)
    const secretMerchGrants = computeSecretMerchBadges(ctx, secretDefs, targetYears)

    // Compute year-scoped badges for each target year
    const yearGrants: BadgeGrant[] = []
    for (const y of targetYears) {
      yearGrants.push(...computeYearBadges(ctx, y))
      yearGrants.push(...computeYearMerchBadges(ctx, y))
    }

    const allGrants = [...lifetimeGrants, ...lifetimeMerchGrants, ...secretGrants, ...secretMerchGrants, ...yearGrants]

    await persistBadges(userId, allGrants)

    return allGrants.map((g) =>
      g.scope_year ? `${g.key}:${g.scope_year}` : g.key,
    )
  } catch (err) {
    console.error('[badges] Evaluation failed for user:', userId, err)
    return []
  }
}

/**
 * Fetch all badges for a user, organized for the UI.
 * Returns lifetime badges and year-scoped badges per year.
 */
export interface SecretArtistBadgeWithStatus {
  key: string
  name: string
  description: string
  scope: 'lifetime' | 'year'
  scope_year: number | null
  unlocked: boolean
  unlocked_at: string | null
  image_url: string | null
  artist_name: string | null
}

export async function getUserBadgesGrouped(userId: string): Promise<{
  lifetime: BadgeWithStatus[]
  years: Array<{
    year: number
    badges: BadgeWithStatus[]
  }>
  secretArtists: SecretArtistBadgeWithStatus[]
  attendedYears: number[]
}> {
  const [unlockedData, allShows, secretDefs] = await Promise.all([
    (async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_key, scope_year, unlocked_at, metadata')
        .eq('user_id', userId)
      if (error || !data) return []
      return data as UnlockedBadge[]
    })(),
    fetchAttendedShows(userId),
    fetchSecretArtistBadges(),
  ])

  // Build unlock lookup
  const unlockedMap = new Map<string, UnlockedBadge>()
  for (const row of unlockedData) {
    const k = unlockKey(row.badge_key, row.scope_year)
    unlockedMap.set(k, row)
  }

  // Lifetime badges
  const lifetime: BadgeWithStatus[] = LIFETIME_BADGES.map((def) => {
    const u = unlockedMap.get(unlockKey(def.key, null))
    return {
      ...def,
      unlocked: !!u,
      unlocked_at: u?.unlocked_at ?? null,
      scope_year: null,
      metadata: u?.metadata ?? null,
    }
  })

  // Determine all relevant years
  const attendedYears = new Set<number>()
  for (const s of allShows) {
    attendedYears.add(new Date(s.date_time).getUTCFullYear())
  }
  // Also include years from unlocked year-scoped badges
  for (const row of unlockedData) {
    if (row.scope_year != null) attendedYears.add(row.scope_year)
  }

  const sortedYears = Array.from(attendedYears).sort((a, b) => b - a)

  // Secret artist badges
  const secretArtists: SecretArtistBadgeWithStatus[] = []
  for (const def of secretDefs) {
    if (def.scope === 'year') {
      // One entry per attended year
      for (const year of sortedYears) {
        const u = unlockedMap.get(unlockKey(def.key, year))
        const meta = u?.metadata as Record<string, unknown> | null
        secretArtists.push({
          key: def.key,
          name: def.name,
          description: def.description,
          scope: 'year',
          scope_year: year,
          unlocked: !!u,
          unlocked_at: u?.unlocked_at ?? null,
          image_url: def.image_url ?? (meta?.image_url as string | null) ?? null,
          artist_name: (meta?.artist_name as string) ?? null,
        })

        // Secret merch badge for this artist + year
        const merchKey = `secret_merch_${def.key.replace(/^secret_/, '')}`
        const mu = unlockedMap.get(unlockKey(merchKey, year))
        const mMeta = mu?.metadata as Record<string, unknown> | null
        secretArtists.push({
          key: merchKey,
          name: `${def.name} (Merch)`,
          description: `Own merch from this artist`,
          scope: 'year',
          scope_year: year,
          unlocked: !!mu,
          unlocked_at: mu?.unlocked_at ?? null,
          image_url: def.image_url ?? (mMeta?.image_url as string | null) ?? null,
          artist_name: (mMeta?.artist_name as string) ?? null,
        })
      }
    } else {
      const u = unlockedMap.get(unlockKey(def.key, null))
      const meta = u?.metadata as Record<string, unknown> | null
      secretArtists.push({
        key: def.key,
        name: def.name,
        description: def.description,
        scope: 'lifetime',
        scope_year: null,
        unlocked: !!u,
        unlocked_at: u?.unlocked_at ?? null,
        image_url: def.image_url ?? (meta?.image_url as string | null) ?? null,
        artist_name: (meta?.artist_name as string) ?? null,
      })

      // Secret merch badge for this artist (lifetime)
      const merchKey = `secret_merch_${def.key.replace(/^secret_/, '')}`
      const mu = unlockedMap.get(unlockKey(merchKey, null))
      const mMeta = mu?.metadata as Record<string, unknown> | null
      secretArtists.push({
        key: merchKey,
        name: `${def.name} (Merch)`,
        description: `Own merch from this artist`,
        scope: 'lifetime',
        scope_year: null,
        unlocked: !!mu,
        unlocked_at: mu?.unlocked_at ?? null,
        image_url: def.image_url ?? (mMeta?.image_url as string | null) ?? null,
        artist_name: (mMeta?.artist_name as string) ?? null,
      })
    }
  }

  const years = sortedYears.map((year) => {
    const badges: BadgeWithStatus[] = YEAR_BADGES.map((def) => {
      const u = unlockedMap.get(unlockKey(def.key, year))
      return {
        ...def,
        unlocked: !!u,
        unlocked_at: u?.unlocked_at ?? null,
        scope_year: year,
        metadata: u?.metadata ?? null,
      }
    })
    return { year, badges }
  })

  return { lifetime, years, secretArtists, attendedYears: sortedYears }
}

/**
 * Backfill: discover all distinct user IDs from rsvps and evaluate
 * badges for each. Returns a summary.
 */
export async function backfillAllUsers(): Promise<{
  processed: number
  totalNewBadges: number
  details: Array<{ user: string; newBadges: string[] }>
}> {
  const { data: users, error } = await supabase
    .from('rsvps')
    .select('name')
    .eq('status', 'going')

  if (error || !users) {
    return { processed: 0, totalNewBadges: 0, details: [] }
  }

  const uniqueUsers = [...new Set(users.map((u) => u.name))]
  const details: Array<{ user: string; newBadges: string[] }> = []
  let totalNew = 0

  for (const user of uniqueUsers) {
    const newBadges = await evaluateAndUnlockBadges(user)
    if (newBadges.length > 0) {
      details.push({ user, newBadges })
      totalNew += newBadges.length
    }
  }

  return { processed: uniqueUsers.length, totalNewBadges: totalNew, details }
}
