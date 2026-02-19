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
  | 'power_user'

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
    name: 'First Timer',
    description: 'Attended your very first show.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'RSVP "going" to at least 1 past show.',
    threshold: 1,
  },
  {
    key: 'shows_5',
    name: 'Regular',
    description: 'Attended 5 shows. You are officially a regular.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 5 past shows.',
    threshold: 5,
  },
  {
    key: 'shows_10',
    name: 'Dedicated Fan',
    description: 'Attended 10 shows. True dedication.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 10 past shows.',
    threshold: 10,
  },
  {
    key: 'shows_25',
    name: 'Veteran',
    description: 'Attended 25 shows. A seasoned veteran.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 25 past shows.',
    threshold: 25,
  },
  {
    key: 'shows_50',
    name: 'Hall of Fame',
    description: 'Attended 50 shows. Hall of Fame material.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 50 past shows.',
    threshold: 50,
  },
  {
    key: 'shows_100',
    name: 'Century Club',
    description: 'Attended 100 shows. Welcome to the Century Club.',
    category: 'attendance',
    scope: 'lifetime',
    criteria: 'Attend 100 past shows.',
    threshold: 100,
  },

  // ---- Venues & Cities (lifetime) ----
  {
    key: 'venue_explorer',
    name: 'Venue Explorer',
    description: 'Visited 10 different venues.',
    category: 'venues',
    scope: 'lifetime',
    criteria: '10+ distinct venues across all attended shows.',
    threshold: 10,
  },
  {
    key: 'venue_collector',
    name: 'Venue Collector',
    description: 'Visited 20 different venues. Quite the explorer.',
    category: 'venues',
    scope: 'lifetime',
    criteria: '20+ distinct venues across all attended shows.',
    threshold: 20,
  },

  // ---- Artists (lifetime) ----
  {
    key: 'artist_devotee',
    name: 'Devoted',
    description: 'Seen the same artist at 5 different shows.',
    category: 'artists',
    scope: 'lifetime',
    criteria: 'Any artist appears on 5+ distinct attended shows.',
    threshold: 5,
  },
  {
    key: 'diverse_taste',
    name: 'Diverse Taste',
    description: 'Seen 25 unique artists across all your shows.',
    category: 'artists',
    scope: 'lifetime',
    criteria: '25+ distinct artist names across all attended shows.',
    threshold: 25,
  },

  // ---- Social (lifetime) ----
  {
    key: 'dynamic_duo',
    name: 'Dynamic Duo',
    description: 'Attended 5 shows with the same friend.',
    category: 'social',
    scope: 'lifetime',
    criteria: 'Any other user co-attended 5+ of the same shows.',
    threshold: 5,
  },

  // ---- Power User (lifetime) ----
  {
    key: 'release_watcher',
    name: 'Release Watcher',
    description: 'Following 5 or more artists for new releases.',
    category: 'power_user',
    scope: 'lifetime',
    criteria: '5+ rows in user_artists for this user.',
    threshold: 5,
  },

  // ======== YEAR-SCOPED BADGES ========

  // ---- Attendance (year) ----
  {
    key: 'yearly_warrior',
    name: 'Year Warrior',
    description: 'Attended 12 or more shows this year.',
    category: 'attendance',
    scope: 'year',
    criteria: '12+ attended shows in the target year.',
    threshold: 12,
  },

  // ---- Streaks & Timing (year) ----
  {
    key: 'back_to_back',
    name: 'Back to Back',
    description: 'Attended shows on two consecutive calendar days.',
    category: 'streaks',
    scope: 'year',
    criteria: 'Two attended shows in the same year whose dates are exactly 1 day apart.',
  },
  {
    key: 'three_in_a_week',
    name: 'Triple Threat',
    description: 'Attended 3 shows within 7 days.',
    category: 'streaks',
    scope: 'year',
    criteria: 'Sliding 7-day window within the year containing 3+ attended shows.',
  },
  {
    key: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Attended 5 shows on a Friday, Saturday, or Sunday.',
    category: 'streaks',
    scope: 'year',
    criteria: '5+ attended shows in the year falling on Fri/Sat/Sun.',
    threshold: 5,
  },
  {
    key: 'monthly_streak_3',
    name: 'Three Peat',
    description: 'Attended at least one show per month for 3 months straight.',
    category: 'streaks',
    scope: 'year',
    criteria: '3 consecutive calendar months within the year each containing 1+ attended show.',
  },
  {
    key: 'night_owl',
    name: 'Night Owl',
    description: 'Attended a show starting at 10 PM or later.',
    category: 'streaks',
    scope: 'year',
    criteria: 'An attended show in the year with time_local >= "22:00".',
  },

  // ---- Venues & Cities (year) ----
  {
    key: 'venue_regular',
    name: 'Venue Regular',
    description: 'Visited the same venue at 5 different shows.',
    category: 'venues',
    scope: 'year',
    criteria: 'Any single venue appears 5+ times in attended shows within the year.',
    threshold: 5,
  },
  {
    key: 'city_hopper',
    name: 'City Hopper',
    description: 'Attended shows in 3 or more cities.',
    category: 'venues',
    scope: 'year',
    criteria: '3+ distinct cities across attended shows within the year.',
    threshold: 3,
  },
  {
    key: 'home_turf',
    name: 'Home Turf',
    description: 'Attended 10 shows in a single city.',
    category: 'venues',
    scope: 'year',
    criteria: 'Any single city appears 10+ times in attended shows within the year.',
    threshold: 10,
  },

  // ---- Artists (year) ----
  {
    key: 'artist_fan',
    name: 'Super Fan',
    description: 'Seen the same artist at 3 different shows.',
    category: 'artists',
    scope: 'year',
    criteria: 'Any artist appears on 3+ distinct attended shows within the year.',
    threshold: 3,
  },
  {
    key: 'headliner_collector',
    name: 'Headliner Collector',
    description: 'Seen 10 unique headliners.',
    category: 'artists',
    scope: 'year',
    criteria: '10+ distinct "Headliner" artist names across attended shows within the year.',
    threshold: 10,
  },
  {
    key: 'local_champion',
    name: 'Local Champion',
    description: 'Attended 10 shows featuring a local act.',
    category: 'artists',
    scope: 'year',
    criteria: '10+ attended shows within the year that include a "Local" artist.',
    threshold: 10,
  },

  // ---- Social (year) ----
  {
    key: 'solo_adventurer',
    name: 'Solo Adventurer',
    description: 'Attended a show as the only person going.',
    category: 'social',
    scope: 'year',
    criteria: 'At least 1 attended show within the year where the user is the only "going" RSVP.',
  },
  {
    key: 'squad_goals',
    name: 'Squad Goals',
    description: 'Attended a show with 5 or more other people.',
    category: 'social',
    scope: 'year',
    criteria: 'An attended show within the year with 6+ total "going" RSVPs.',
  },
  {
    key: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Attended shows alongside 10 unique people.',
    category: 'social',
    scope: 'year',
    criteria: '10+ distinct co-attendees across attended shows within the year.',
    threshold: 10,
  },

  // ---- Power User (year) ----
  {
    key: 'cost_tracker',
    name: 'Budget Tracker',
    description: 'Tracked costs for 3 or more shows.',
    category: 'power_user',
    scope: 'year',
    criteria: '3+ distinct shows with cost entries within the year.',
    threshold: 3,
  },
  {
    key: 'big_spender',
    name: 'Big Spender',
    description: 'Tracked over $500 in total spending.',
    category: 'power_user',
    scope: 'year',
    criteria: 'SUM of amount_minor in show_costs >= 50000 ($500) within the year.',
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
  }>
}

interface CoAttendance {
  show_id: string
  name: string
}

interface YearCostSummary {
  shows_with_costs: number
  total_spend: number
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

/**
 * Fetch cost data, partitioned by show year via a join on shows.date_time.
 */
async function fetchCostsByYear(
  userId: string,
): Promise<Map<number, YearCostSummary>> {
  const { data: costs, error } = await supabase
    .from('show_costs')
    .select('show_id, amount_minor')
    .eq('user_id', userId)

  const result = new Map<number, YearCostSummary>()
  if (error || !costs || costs.length === 0) return result

  // Get show dates for these cost entries
  const costShowIds = [...new Set(costs.map((c) => c.show_id))]
  const { data: shows } = await supabase
    .from('shows')
    .select('id, date_time')
    .in('id', costShowIds)

  if (!shows) return result

  const showYearMap = new Map<string, number>()
  for (const s of shows) {
    showYearMap.set(s.id, new Date(s.date_time).getUTCFullYear())
  }

  const yearShowSets = new Map<number, Set<string>>()
  for (const c of costs) {
    const year = showYearMap.get(c.show_id)
    if (year == null) continue
    const entry = result.get(year) ?? { shows_with_costs: 0, total_spend: 0 }
    entry.total_spend += c.amount_minor
    result.set(year, entry)

    if (!yearShowSets.has(year)) yearShowSets.set(year, new Set())
    yearShowSets.get(year)!.add(c.show_id)
  }

  for (const [year, ids] of yearShowSets) {
    const entry = result.get(year)
    if (entry) entry.shows_with_costs = ids.size
  }

  return result
}

async function fetchUserArtistsCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('user_artists')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) return 0
  return count ?? 0
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
  costsByYear: Map<number, YearCostSummary>
  userArtistsCount: number
  alreadyUnlocked: Map<string, UnlockedBadge>
}

/** A badge to be newly unlocked */
interface BadgeGrant {
  key: string
  scope_year: number | null
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

  // ---- Power User (lifetime) ----
  if (ctx.userArtistsCount >= 5) grant('release_watcher')

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

  // ---- Power User (year) ----
  const yearCosts = ctx.costsByYear.get(year)
  if (yearCosts) {
    if (yearCosts.shows_with_costs >= 3) grant('cost_tracker')
    if (yearCosts.total_spend >= 50000) grant('big_spender')
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
    const row = {
      user_id: userId,
      badge_key: g.key,
      scope_year: g.scope_year,
      unlocked_at: new Date().toISOString(),
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
    const [allShows, alreadyUnlocked, costsByYear, userArtistsCount] =
      await Promise.all([
        fetchAttendedShows(userId),
        fetchUnlockedBadges(userId),
        fetchCostsByYear(userId),
        fetchUserArtistsCount(userId),
      ])

    const showIds = allShows.map((s) => s.id)
    const coAttendance = await fetchCoAttendance(showIds)

    const ctx: EvalContext = {
      userId,
      allShows,
      coAttendance,
      costsByYear,
      userArtistsCount,
      alreadyUnlocked,
    }

    // Compute lifetime badges
    const lifetimeGrants = computeLifetimeBadges(ctx)

    // Determine which years to evaluate
    const allYears = new Set<number>()
    for (const s of allShows) {
      allYears.add(new Date(s.date_time).getUTCFullYear())
    }
    const targetYears = years
      ? years.filter((y) => allYears.has(y))
      : Array.from(allYears)

    // Compute year-scoped badges for each target year
    const yearGrants: BadgeGrant[] = []
    for (const y of targetYears) {
      yearGrants.push(...computeYearBadges(ctx, y))
    }

    const allGrants = [...lifetimeGrants, ...yearGrants]

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
export async function getUserBadgesGrouped(userId: string): Promise<{
  lifetime: BadgeWithStatus[]
  years: Array<{ year: number; badges: BadgeWithStatus[] }>
  attendedYears: number[]
}> {
  const [unlockedData, allShows] = await Promise.all([
    (async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_key, scope_year, unlocked_at, metadata')
        .eq('user_id', userId)
      if (error || !data) return []
      return data as UnlockedBadge[]
    })(),
    fetchAttendedShows(userId),
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

  return { lifetime, years, attendedYears: sortedYears }
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
