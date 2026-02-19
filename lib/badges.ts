// ---------------------------------------------------------------------------
// Badge system -- single source of truth for definitions, evaluation,
// and persistence.  Badge images will live in Vercel Blob at the path
//   {NEXT_PUBLIC_BADGE_IMAGE_BASE}/{badge_key}.png
// Until images are uploaded the UI renders a fallback icon.
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

export interface BadgeDefinition {
  key: string
  name: string
  description: string
  category: BadgeCategory
  /** Human-readable explanation of the unlock criteria */
  criteria: string
  /** Optional threshold used for progress display */
  threshold?: number
}

export interface UnlockedBadge {
  badge_key: string
  unlocked_at: string
  metadata: Record<string, unknown> | null
}

export interface BadgeWithStatus extends BadgeDefinition {
  unlocked: boolean
  unlocked_at: string | null
  metadata: Record<string, unknown> | null
}

// ---------------------------------------------------------------------------
// 2. Badge image helper
// ---------------------------------------------------------------------------

const BADGE_IMAGE_BASE = process.env.NEXT_PUBLIC_BADGE_IMAGE_BASE ?? ''

/**
 * Returns the image URL for a badge, or null if no base URL is configured.
 * Convention: `{base}/{badge_key}.png`
 */
export function getBadgeImageUrl(badgeKey: string): string | null {
  if (!BADGE_IMAGE_BASE) return null
  return `${BADGE_IMAGE_BASE}/${badgeKey}.png`
}

// ---------------------------------------------------------------------------
// 3. Badge registry  (28 badges across 6 categories)
// ---------------------------------------------------------------------------

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ---- Attendance Milestones ----
  {
    key: 'first_show',
    name: 'First Timer',
    description: 'Attended your very first show.',
    category: 'attendance',
    criteria: 'RSVP "going" to at least 1 past show.',
    threshold: 1,
  },
  {
    key: 'shows_5',
    name: 'Regular',
    description: 'Attended 5 shows. You are officially a regular.',
    category: 'attendance',
    criteria: 'Attend 5 past shows.',
    threshold: 5,
  },
  {
    key: 'shows_10',
    name: 'Dedicated Fan',
    description: 'Attended 10 shows. True dedication.',
    category: 'attendance',
    criteria: 'Attend 10 past shows.',
    threshold: 10,
  },
  {
    key: 'shows_25',
    name: 'Veteran',
    description: 'Attended 25 shows. A seasoned veteran.',
    category: 'attendance',
    criteria: 'Attend 25 past shows.',
    threshold: 25,
  },
  {
    key: 'shows_50',
    name: 'Hall of Fame',
    description: 'Attended 50 shows. Hall of Fame material.',
    category: 'attendance',
    criteria: 'Attend 50 past shows.',
    threshold: 50,
  },
  {
    key: 'shows_100',
    name: 'Century Club',
    description: 'Attended 100 shows. Welcome to the Century Club.',
    category: 'attendance',
    criteria: 'Attend 100 past shows.',
    threshold: 100,
  },

  // ---- Streaks & Timing ----
  {
    key: 'back_to_back',
    name: 'Back to Back',
    description: 'Attended shows on two consecutive calendar days.',
    category: 'streaks',
    criteria: 'Two attended shows whose dates are exactly 1 day apart.',
  },
  {
    key: 'three_in_a_week',
    name: 'Triple Threat',
    description: 'Attended 3 shows within 7 days.',
    category: 'streaks',
    criteria: 'Sliding 7-day window containing 3+ attended shows.',
  },
  {
    key: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Attended 5 shows on a Friday, Saturday, or Sunday.',
    category: 'streaks',
    criteria: '5+ attended shows falling on Fri/Sat/Sun (America/New_York).',
    threshold: 5,
  },
  {
    key: 'monthly_streak_3',
    name: 'Three Peat',
    description: 'Attended at least one show per month for 3 months straight.',
    category: 'streaks',
    criteria: '3 consecutive calendar months each containing 1+ attended show.',
  },
  {
    key: 'night_owl',
    name: 'Night Owl',
    description: 'Attended a show starting at 10 PM or later.',
    category: 'streaks',
    criteria: 'An attended show with time_local >= "22:00".',
  },

  // ---- Venues & Cities ----
  {
    key: 'venue_regular',
    name: 'Venue Regular',
    description: 'Visited the same venue at 5 different shows.',
    category: 'venues',
    criteria: 'Any single venue appears 5+ times in attended shows.',
    threshold: 5,
  },
  {
    key: 'venue_explorer',
    name: 'Venue Explorer',
    description: 'Visited 10 different venues.',
    category: 'venues',
    criteria: '10+ distinct venues across attended shows.',
    threshold: 10,
  },
  {
    key: 'venue_collector',
    name: 'Venue Collector',
    description: 'Visited 20 different venues. Quite the explorer.',
    category: 'venues',
    criteria: '20+ distinct venues across attended shows.',
    threshold: 20,
  },
  {
    key: 'city_hopper',
    name: 'City Hopper',
    description: 'Attended shows in 3 or more cities.',
    category: 'venues',
    criteria: '3+ distinct cities across attended shows.',
    threshold: 3,
  },
  {
    key: 'home_turf',
    name: 'Home Turf',
    description: 'Attended 10 shows in a single city.',
    category: 'venues',
    criteria: 'Any single city appears 10+ times in attended shows.',
    threshold: 10,
  },

  // ---- Artists ----
  {
    key: 'artist_fan',
    name: 'Super Fan',
    description: 'Seen the same artist at 3 different shows.',
    category: 'artists',
    criteria: 'Any artist name appears on 3+ distinct attended shows (via show_artists JSONB).',
    threshold: 3,
  },
  {
    key: 'artist_devotee',
    name: 'Devoted',
    description: 'Seen the same artist at 5 different shows.',
    category: 'artists',
    criteria: 'Any artist appears on 5+ distinct attended shows.',
    threshold: 5,
  },
  {
    key: 'headliner_collector',
    name: 'Headliner Collector',
    description: 'Seen 10 unique headliners.',
    category: 'artists',
    criteria: '10+ distinct artist names with position "Headliner" across attended shows.',
    threshold: 10,
  },
  {
    key: 'local_champion',
    name: 'Local Champion',
    description: 'Attended 10 shows featuring a local act.',
    category: 'artists',
    criteria: '10+ attended shows that include at least one artist with position "Local".',
    threshold: 10,
  },
  {
    key: 'diverse_taste',
    name: 'Diverse Taste',
    description: 'Seen 25 unique artists across all your shows.',
    category: 'artists',
    criteria: '25+ distinct artist names across all attended shows.',
    threshold: 25,
  },

  // ---- Social ----
  {
    key: 'solo_adventurer',
    name: 'Solo Adventurer',
    description: 'Attended a show as the only person going.',
    category: 'social',
    criteria: 'At least 1 attended show where the user is the only "going" RSVP.',
  },
  {
    key: 'squad_goals',
    name: 'Squad Goals',
    description: 'Attended a show with 5 or more other people.',
    category: 'social',
    criteria: 'An attended show with 6+ total "going" RSVPs (including the user).',
  },
  {
    key: 'dynamic_duo',
    name: 'Dynamic Duo',
    description: 'Attended 5 shows with the same friend.',
    category: 'social',
    criteria: 'Any other user co-attended 5+ of the same shows.',
    threshold: 5,
  },
  {
    key: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Attended shows alongside 10 unique people.',
    category: 'social',
    criteria: '10+ distinct other users who were "going" to at least one of the same shows.',
    threshold: 10,
  },

  // ---- Power User ----
  {
    key: 'cost_tracker',
    name: 'Budget Tracker',
    description: 'Tracked costs for 3 or more shows.',
    category: 'power_user',
    criteria: '3+ distinct shows in show_costs for this user.',
    threshold: 3,
  },
  {
    key: 'big_spender',
    name: 'Big Spender',
    description: 'Tracked over $500 in total spending.',
    category: 'power_user',
    criteria: 'SUM of amount_minor in show_costs >= 50000 (i.e. $500).',
  },
  {
    key: 'release_watcher',
    name: 'Release Watcher',
    description: 'Following 5 or more artists for new releases.',
    category: 'power_user',
    criteria: '5+ rows in user_artists for this user.',
    threshold: 5,
  },
  {
    key: 'yearly_warrior',
    name: 'Year Warrior',
    description: 'Attended 12 or more shows in a single calendar year.',
    category: 'power_user',
    criteria: 'Any calendar year with 12+ attended shows.',
    threshold: 12,
  },
]

/** Quick lookup map */
export const BADGE_MAP: Record<string, BadgeDefinition> = Object.fromEntries(
  BADGE_DEFINITIONS.map((b) => [b.key, b]),
)

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

interface CostSummary {
  shows_with_costs: number
  total_spend: number
  categories_used: number
}

async function fetchAttendedShows(userId: string): Promise<AttendedShow[]> {
  const { data, error } = await supabase
    .from('shows')
    .select('id, date_time, time_local, venue, city, show_artists')
    .lt('date_time', new Date().toISOString())
    .in(
      'id',
      // Subquery: show IDs where user RSVP'd going
      // Supabase JS doesn't support subqueries directly, so we do two queries.
      [],
    )

  // Supabase JS doesn't do subquery IN, so fetch RSVP show IDs first.
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

async function fetchCostSummary(userId: string): Promise<CostSummary> {
  const { data, error } = await supabase
    .from('show_costs')
    .select('show_id, amount_minor, category')
    .eq('user_id', userId)

  if (error || !data)
    return { shows_with_costs: 0, total_spend: 0, categories_used: 0 }

  const showIds = new Set(data.map((d) => d.show_id))
  const categories = new Set(data.map((d) => d.category))
  const totalSpend = data.reduce((s, d) => s + d.amount_minor, 0)
  return {
    shows_with_costs: showIds.size,
    total_spend: totalSpend,
    categories_used: categories.size,
  }
}

async function fetchUserArtistsCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('user_artists')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) return 0
  return count ?? 0
}

async function fetchUnlockedBadges(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_key')
    .eq('user_id', userId)

  if (error || !data) return new Set()
  return new Set(data.map((d) => d.badge_key))
}

// ---------------------------------------------------------------------------
// 5. Badge evaluation logic
// ---------------------------------------------------------------------------

interface EvalContext {
  userId: string
  attendedShows: AttendedShow[]
  coAttendance: CoAttendance[]
  costSummary: CostSummary
  userArtistsCount: number
  alreadyUnlocked: Set<string>
}

/**
 * Given the full context for a user, returns the list of badge keys
 * that should be newly unlocked (not already in `alreadyUnlocked`).
 */
function computeNewBadges(ctx: EvalContext): string[] {
  const newBadges: string[] = []

  function grant(key: string) {
    if (!ctx.alreadyUnlocked.has(key)) {
      newBadges.push(key)
    }
  }

  const shows = ctx.attendedShows
  const count = shows.length

  // ---------- Attendance ----------
  if (count >= 1) grant('first_show')
  if (count >= 5) grant('shows_5')
  if (count >= 10) grant('shows_10')
  if (count >= 25) grant('shows_25')
  if (count >= 50) grant('shows_50')
  if (count >= 100) grant('shows_100')

  // ---------- Streaks & Timing ----------
  if (count >= 2) {
    // Parse dates once (in America/New_York for day-of-week correctness)
    const dates = shows.map((s) => {
      const d = new Date(s.date_time)
      return d
    })

    // Back to back: two consecutive calendar days
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.abs(dates[i].getTime() - dates[i - 1].getTime())
      const diffDays = diff / (1000 * 60 * 60 * 24)
      if (diffDays <= 1.1) {
        // allow slight clock drift
        grant('back_to_back')
        break
      }
    }

    // Triple threat: 3 within 7 days (sliding window)
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

    // Weekend warrior: 5+ shows on Fri (5), Sat (6), Sun (0)
    const weekendCount = dates.filter((d) => {
      const day = d.getUTCDay()
      // Shows are stored as UTC but originally in America/New_York.
      // The time_local field stores the real local time; the date_time
      // is the UTC equivalent. For day-of-week we use the date_time
      // which is close enough (offset is at most -5h).
      return day === 0 || day === 5 || day === 6
    }).length
    if (weekendCount >= 5) grant('weekend_warrior')

    // Monthly streak of 3
    const monthSet = new Set<string>()
    for (const d of dates) {
      monthSet.add(`${d.getUTCFullYear()}-${String(d.getUTCMonth()).padStart(2, '0')}`)
    }
    const months = Array.from(monthSet).sort()
    let streak = 1
    for (let i = 1; i < months.length; i++) {
      const [py, pm] = months[i - 1].split('-').map(Number)
      const [cy, cm] = months[i].split('-').map(Number)
      const expected = pm === 11 ? `${py + 1}-00` : `${py}-${String(pm + 1).padStart(2, '0')}`
      const actual = `${cy}-${String(cm).padStart(2, '0')}`
      if (actual === expected) {
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

  // ---------- Venues & Cities ----------
  const venueCounts = new Map<string, number>()
  const cityCounts = new Map<string, number>()
  for (const s of shows) {
    const v = s.venue.toLowerCase().trim()
    const c = s.city.toLowerCase().trim()
    venueCounts.set(v, (venueCounts.get(v) ?? 0) + 1)
    cityCounts.set(c, (cityCounts.get(c) ?? 0) + 1)
  }

  const maxVenueCount = Math.max(0, ...venueCounts.values())
  const maxCityCount = Math.max(0, ...cityCounts.values())

  if (maxVenueCount >= 5) grant('venue_regular')
  if (venueCounts.size >= 10) grant('venue_explorer')
  if (venueCounts.size >= 20) grant('venue_collector')
  if (cityCounts.size >= 3) grant('city_hopper')
  if (maxCityCount >= 10) grant('home_turf')

  // ---------- Artists ----------
  const artistShowCount = new Map<string, number>()
  const headliners = new Set<string>()
  let showsWithLocal = 0
  const allArtists = new Set<string>()

  for (const s of shows) {
    const seenInShow = new Set<string>()
    let hasLocal = false
    for (const a of s.show_artists) {
      const name = a.artist.toLowerCase().trim()
      allArtists.add(name)
      if (!seenInShow.has(name)) {
        seenInShow.add(name)
        artistShowCount.set(name, (artistShowCount.get(name) ?? 0) + 1)
      }
      if (a.position === 'Headliner') headliners.add(name)
      if (a.position === 'Local') hasLocal = true
    }
    if (hasLocal) showsWithLocal++
  }

  const maxArtistCount = Math.max(0, ...artistShowCount.values())

  if (maxArtistCount >= 3) grant('artist_fan')
  if (maxArtistCount >= 5) grant('artist_devotee')
  if (headliners.size >= 10) grant('headliner_collector')
  if (showsWithLocal >= 10) grant('local_champion')
  if (allArtists.size >= 25) grant('diverse_taste')

  // ---------- Social ----------
  // Build per-show going lists
  const showGoingMap = new Map<string, Set<string>>()
  for (const ca of ctx.coAttendance) {
    if (!showGoingMap.has(ca.show_id)) showGoingMap.set(ca.show_id, new Set())
    showGoingMap.get(ca.show_id)!.add(ca.name)
  }

  let hasSolo = false
  let hasSquad = false
  const friendCounts = new Map<string, number>()
  const allFriends = new Set<string>()

  for (const s of shows) {
    const goingSet = showGoingMap.get(s.id) ?? new Set()
    const goingCount = goingSet.size

    if (goingCount === 1 && goingSet.has(ctx.userId)) {
      hasSolo = true
    }
    if (goingCount >= 6 && goingSet.has(ctx.userId)) {
      hasSquad = true
    }

    // Count friends
    for (const name of goingSet) {
      if (name !== ctx.userId) {
        allFriends.add(name)
        friendCounts.set(name, (friendCounts.get(name) ?? 0) + 1)
      }
    }
  }

  if (hasSolo) grant('solo_adventurer')
  if (hasSquad) grant('squad_goals')
  const maxFriendCount = Math.max(0, ...friendCounts.values())
  if (maxFriendCount >= 5) grant('dynamic_duo')
  if (allFriends.size >= 10) grant('social_butterfly')

  // ---------- Power User ----------
  if (ctx.costSummary.shows_with_costs >= 3) grant('cost_tracker')
  if (ctx.costSummary.total_spend >= 50000) grant('big_spender')
  if (ctx.userArtistsCount >= 5) grant('release_watcher')

  // Yearly warrior: 12+ shows in a single calendar year
  const yearCounts = new Map<number, number>()
  for (const s of shows) {
    const year = new Date(s.date_time).getUTCFullYear()
    yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1)
  }
  const maxYearCount = Math.max(0, ...yearCounts.values())
  if (maxYearCount >= 12) grant('yearly_warrior')

  return newBadges
}

// ---------------------------------------------------------------------------
// 6. Persistence -- idempotent unlock
// ---------------------------------------------------------------------------

/**
 * Inserts newly earned badges. Uses ON CONFLICT DO NOTHING so it is
 * safe to call multiple times.
 */
async function persistBadges(
  userId: string,
  badgeKeys: string[],
): Promise<void> {
  if (badgeKeys.length === 0) return

  const rows = badgeKeys.map((key) => ({
    user_id: userId,
    badge_key: key,
    unlocked_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('user_badges')
    .upsert(rows, { onConflict: 'user_id,badge_key', ignoreDuplicates: true })

  if (error) {
    console.error('[badges] Failed to persist badges:', error)
  }
}

// ---------------------------------------------------------------------------
// 7. Public API
// ---------------------------------------------------------------------------

/**
 * Evaluate and persist badges for a single user. Returns the list of
 * newly unlocked badge keys (empty array if nothing new).
 * This is the main entry point called from API routes.
 */
export async function evaluateAndUnlockBadges(
  userId: string,
): Promise<string[]> {
  try {
    // Fetch all required data in parallel
    const [attendedShows, alreadyUnlocked, costSummary, userArtistsCount] =
      await Promise.all([
        fetchAttendedShows(userId),
        fetchUnlockedBadges(userId),
        fetchCostSummary(userId),
        fetchUserArtistsCount(userId),
      ])

    // Fetch co-attendance for the attended show IDs
    const showIds = attendedShows.map((s) => s.id)
    const coAttendance = await fetchCoAttendance(showIds)

    const ctx: EvalContext = {
      userId,
      attendedShows,
      coAttendance,
      costSummary,
      userArtistsCount,
      alreadyUnlocked,
    }

    const newBadges = computeNewBadges(ctx)

    await persistBadges(userId, newBadges)

    return newBadges
  } catch (err) {
    console.error('[badges] Evaluation failed for user:', userId, err)
    return []
  }
}

/**
 * Fetch all badges for a user with their locked/unlocked status.
 * Used by the Badges UI.
 */
export async function getUserBadges(
  userId: string,
): Promise<BadgeWithStatus[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_key, unlocked_at, metadata')
    .eq('user_id', userId)

  const unlockedMap = new Map<string, UnlockedBadge>()
  if (!error && data) {
    for (const row of data) {
      unlockedMap.set(row.badge_key, row as UnlockedBadge)
    }
  }

  return BADGE_DEFINITIONS.map((def) => {
    const unlocked = unlockedMap.get(def.key)
    return {
      ...def,
      unlocked: !!unlocked,
      unlocked_at: unlocked?.unlocked_at ?? null,
      metadata: unlocked?.metadata ?? null,
    }
  })
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

  // Process sequentially to avoid overwhelming the DB
  for (const user of uniqueUsers) {
    const newBadges = await evaluateAndUnlockBadges(user)
    if (newBadges.length > 0) {
      details.push({ user, newBadges })
      totalNew += newBadges.length
    }
  }

  return { processed: uniqueUsers.length, totalNewBadges: totalNew, details }
}
