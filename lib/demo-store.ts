/**
 * DEMO MODE — In-memory store that seeds from demo-data.ts on page load.
 *
 * All mutations happen in this runtime copy.
 * Refreshing the browser resets everything back to the defaults.
 */

import { Show, RSVP, RSVPSummary, Artist, Release } from './types'
import { ShowCost, COST_CATEGORIES } from './costs'
import {
  DEMO_SHOWS,
  DEMO_RSVPS,
  DEMO_ARTISTS,
  DEMO_RELEASES,
  DEMO_COSTS,
} from './demo-data'

// Deep-clone helper so mutations don't touch the originals
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// ── Runtime state ──
let shows: Show[] = clone(DEMO_SHOWS)
let rsvps: RSVP[] = clone(DEMO_RSVPS)
let artists: Artist[] = clone(DEMO_ARTISTS)
let releases: Release[] = clone(DEMO_RELEASES)
let costs: ShowCost[] = clone(DEMO_COSTS)

// ── Reset (called implicitly on module re-evaluation, i.e. page refresh) ──
export function resetDemoStore() {
  shows = clone(DEMO_SHOWS)
  rsvps = clone(DEMO_RSVPS)
  artists = clone(DEMO_ARTISTS)
  releases = clone(DEMO_RELEASES)
  costs = clone(DEMO_COSTS)
}

// ═══════════════════════════════════════════════
//  Shows
// ═══════════════════════════════════════════════

export function getUpcomingShows(): (Show & { rsvps: RSVPSummary })[] {
  const now = new Date().toISOString()
  return shows
    .filter(s => s.date_time >= now)
    .sort((a, b) => a.date_time.localeCompare(b.date_time))
    .map(s => ({ ...s, rsvps: getRsvpSummary(s.id) }))
}

export function getPastShows(page: number, limit: number) {
  const now = new Date().toISOString()
  const past = shows
    .filter(s => s.date_time < now)
    .sort((a, b) => b.date_time.localeCompare(a.date_time))
  const total = past.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paged = past.slice(start, start + limit).map(s => ({
    ...s,
    rsvps: getRsvpSummary(s.id),
  }))
  return {
    shows: paged,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export function getShowById(id: string) {
  return shows.find(s => s.id === id) ?? null
}

export function addShow(data: Omit<Show, 'id' | 'created_at'>): Show {
  const newShow: Show = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  shows.push(newShow)
  return newShow
}

export function updateShow(id: string, data: Partial<Show>): Show | null {
  const idx = shows.findIndex(s => s.id === id)
  if (idx === -1) return null
  shows[idx] = { ...shows[idx], ...data }
  return shows[idx]
}

export function deleteShow(id: string): boolean {
  const before = shows.length
  shows = shows.filter(s => s.id !== id)
  // Cascade: remove rsvps & costs for this show
  rsvps = rsvps.filter(r => r.show_id !== id)
  costs = costs.filter(c => c.show_id !== id)
  return shows.length < before
}

export function duplicateShow(id: string): Show | null {
  const source = shows.find(s => s.id === id)
  if (!source) return null
  const dup: Show = {
    ...clone(source),
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  shows.push(dup)
  return dup
}

// ═══════════════════════════════════════════════
//  RSVPs
// ═══════════════════════════════════════════════

export function getRsvpSummary(showId: string): RSVPSummary {
  const showRsvps = rsvps.filter(r => r.show_id === showId)
  return {
    going: showRsvps.filter(r => r.status === 'going').map(r => r.name),
    maybe: showRsvps.filter(r => r.status === 'maybe').map(r => r.name),
    not_going: showRsvps.filter(r => r.status === 'not_going').map(r => r.name),
  }
}

export function setRsvp(showId: string, name: string, status: 'going' | 'maybe' | 'not_going'): RSVP {
  const existing = rsvps.find(r => r.show_id === showId && r.name === name)
  if (existing) {
    existing.status = status
    existing.updated_at = new Date().toISOString()
    return existing
  }
  const newRsvp: RSVP = {
    show_id: showId,
    name,
    status,
    updated_at: new Date().toISOString(),
  }
  rsvps.push(newRsvp)
  return newRsvp
}

export function removeRsvp(showId: string, name: string): boolean {
  const before = rsvps.length
  rsvps = rsvps.filter(r => !(r.show_id === showId && r.name === name))
  return rsvps.length < before
}

// ═══════════════════════════════════════════════
//  Artists
// ═══════════════════════════════════════════════

export function getArtists(): Artist[] {
  return artists.filter(a => a.is_active).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function addArtist(data: Omit<Artist, 'id' | 'created_at' | 'last_checked'>): Artist {
  const existing = artists.find(a => a.spotify_id === data.spotify_id)
  if (existing) return existing
  const newArtist: Artist = {
    ...data,
    id: crypto.randomUUID(),
    last_checked: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
  artists.push(newArtist)
  return newArtist
}

export function deleteArtist(id: string): boolean {
  const before = artists.length
  artists = artists.filter(a => a.id !== id)
  // Cascade: remove releases
  releases = releases.filter(r => r.artist_id !== id)
  return artists.length < before
}

// Fake Spotify search — returns a subset of demo artists matching the query
export function searchArtistsDemo(query: string) {
  const q = query.toLowerCase()
  return artists
    .filter(a => a.artist_name.toLowerCase().includes(q))
    .map(a => ({
      id: a.spotify_id,
      name: a.artist_name,
      external_urls: { spotify: a.spotify_url || '' },
      images: a.image_url ? [{ url: a.image_url, height: 300, width: 300 }] : [],
      genres: a.genres || [],
      popularity: a.popularity ?? 0,
      followers: { total: a.followers_count ?? 0 },
    }))
}

// ═══════════════════════════════════════════════
//  Releases
// ═══════════════════════════════════════════════

export function getReleases(page: number, limit: number, days: number) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const filtered = releases
    .filter(r => r.release_date >= cutoffStr)
    .sort((a, b) => b.release_date.localeCompare(a.release_date))

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  return {
    releases: filtered.slice(start, start + limit),
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  }
}

export function getAllReleases() {
  return releases.sort((a, b) => b.release_date.localeCompare(a.release_date))
}

// ═══════════════════════════════════════════════
//  Costs
// ═══════════════════════════════════════════════

export function getShowCosts(showId: string, userId: string): ShowCost[] {
  return costs
    .filter(c => c.show_id === showId && c.user_id === userId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export function addCost(data: Omit<ShowCost, 'id' | 'created_at' | 'updated_at'>): ShowCost {
  const newCost: ShowCost = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  costs.push(newCost)
  return newCost
}

export function updateCost(costId: string, userId: string, data: Partial<Pick<ShowCost, 'category' | 'amount_minor' | 'note'>>): ShowCost | null {
  const cost = costs.find(c => c.id === costId && c.user_id === userId)
  if (!cost) return null
  if (data.category !== undefined) cost.category = data.category
  if (data.amount_minor !== undefined) cost.amount_minor = data.amount_minor
  if (data.note !== undefined) cost.note = data.note
  cost.updated_at = new Date().toISOString()
  return cost
}

export function deleteCost(costId: string, userId: string): boolean {
  const before = costs.length
  costs = costs.filter(c => !(c.id === costId && c.user_id === userId))
  return costs.length < before
}

/**
 * Get shows with costs for a user (My Shows page).
 * Returns upcoming + past shows where the user RSVP'd "going", with their costs.
 */
export function getCostShows(userId: string, year?: number) {
  const now = new Date().toISOString()
  const userGoingIds = new Set(
    rsvps.filter(r => r.name === userId && r.status === 'going').map(r => r.show_id)
  )

  const relevantShows = shows.filter(s => {
    if (!userGoingIds.has(s.id)) return false
    if (year) {
      const showYear = new Date(s.date_time).getFullYear()
      if (showYear !== year) return false
    }
    return true
  })

  const buildShowWithCosts = (s: Show) => {
    const showCosts = costs.filter(c => c.show_id === s.id && c.user_id === userId)
    return {
      id: s.id,
      title: s.title,
      date_time: s.date_time,
      venue: s.venue,
      city: s.city,
      poster_url: s.poster_url,
      show_artists: s.show_artists,
      costs: showCosts,
      total_cents: showCosts.reduce((sum, c) => sum + c.amount_minor, 0),
      rsvps: getRsvpSummary(s.id),
    }
  }

  const upcoming = relevantShows
    .filter(s => s.date_time >= now)
    .sort((a, b) => a.date_time.localeCompare(b.date_time))
    .map(buildShowWithCosts)

  const past = relevantShows
    .filter(s => s.date_time < now)
    .sort((a, b) => b.date_time.localeCompare(a.date_time))
    .map(buildShowWithCosts)

  return { upcoming, past }
}

/**
 * Cost summary for a user (My Shows page summary card).
 */
export function getCostSummary(userId: string, year?: number) {
  const { upcoming, past } = getCostShows(userId, year)
  const allShows = [...upcoming, ...past]
  const showsWithCosts = allShows.filter(s => s.costs.length > 0)

  const totalMinor = allShows.reduce((sum, s) => sum + s.total_cents, 0)
  const totalDollars = totalMinor / 100

  // Build category breakdown
  const categoryMap = new Map<string, number>()
  for (const s of allShows) {
    for (const c of s.costs) {
      categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + c.amount_minor)
    }
  }

  const { COST_CATEGORIES } = require('./costs')
  const spendByCategory = Array.from(categoryMap.entries()).map(([cat, total]) => {
    const info = COST_CATEGORIES.find((c: { value: string }) => c.value === cat)
    return {
      category: cat,
      label: info?.label || cat,
      emoji: info?.emoji || '📦',
      total: total / 100,
    }
  }).sort((a: { total: number }, b: { total: number }) => b.total - a.total)

  // Most/least expensive show
  const sorted = showsWithCosts.sort((a, b) => b.total_cents - a.total_cents)
  const mostExpensive = sorted[0]
    ? { show_id: sorted[0].id, title: sorted[0].title, total: sorted[0].total_cents / 100 }
    : null
  const cheapest = sorted.length > 1
    ? { show_id: sorted[sorted.length - 1].id, title: sorted[sorted.length - 1].title, total: sorted[sorted.length - 1].total_cents / 100 }
    : null

  // Artist count
  let totalArtists = 0
  for (const s of allShows) {
    totalArtists += (s.show_artists?.length || 0)
  }

  return {
    year: year || new Date().getFullYear(),
    total_spend: totalDollars,
    total_shows_with_costs: showsWithCosts.length,
    total_attended_shows: allShows.length,
    average_per_show: allShows.length > 0 ? totalDollars / allShows.length : 0,
    spend_by_category: spendByCategory,
    most_expensive_show: mostExpensive,
    cheapest_show: cheapest,
    cost_per_artist: totalArtists > 0 ? totalDollars / totalArtists : null,
  }
}

// ═══════════════════════════════════════════════
//  Recap
// ═══════════════════════════════════════════════

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const COLOR_PALETTE = [
  'hsl(220, 70%, 50%)',
  'hsl(120, 60%, 50%)',
  'hsl(0, 70%, 50%)',
  'hsl(45, 80%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(180, 70%, 50%)',
  'hsl(30, 80%, 50%)',
  'hsl(300, 60%, 50%)',
]

function userColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length]
}

export function getRecap(userName: string, year: number) {
  // Filter shows in the given year where the user was "going"
  const userGoingIds = new Set(
    rsvps.filter(r => r.name === userName && r.status === 'going').map(r => r.show_id)
  )
  const yearShows = shows.filter(s => {
    const sy = new Date(s.date_time).getFullYear()
    return sy === year
  })
  const personalShows = yearShows.filter(s => userGoingIds.has(s.id))
    .sort((a, b) => a.date_time.localeCompare(b.date_time))

  // All attendees for year shows
  const yearRsvps = rsvps.filter(r => {
    const show = shows.find(s => s.id === r.show_id)
    return show && new Date(show.date_time).getFullYear() === year && r.status === 'going'
  })

  // Attendee → shows count
  const attendeeCounts = new Map<string, number>()
  for (const r of yearRsvps) {
    attendeeCounts.set(r.name, (attendeeCounts.get(r.name) || 0) + 1)
  }

  // Monthly counts per user
  const allAttendees = Array.from(attendeeCounts.keys()).sort()
  const monthlyByUser = new Map<string, number[]>()
  for (const name of allAttendees) {
    monthlyByUser.set(name, new Array(12).fill(0))
  }
  for (const r of yearRsvps) {
    const show = shows.find(s => s.id === r.show_id)
    if (!show) continue
    const month = new Date(show.date_time).getMonth()
    const counts = monthlyByUser.get(r.name)
    if (counts) counts[month]++
  }

  // Personal monthly
  const personalMonthlyCounts = new Array(12).fill(0)
  for (const s of personalShows) {
    personalMonthlyCounts[new Date(s.date_time).getMonth()]++
  }
  const busiestMonthIdx = personalMonthlyCounts.indexOf(Math.max(...personalMonthlyCounts))

  // Top venue
  const venueCounts = new Map<string, number>()
  for (const s of personalShows) {
    venueCounts.set(s.venue, (venueCounts.get(s.venue) || 0) + 1)
  }
  const topVenueEntry = Array.from(venueCounts.entries()).sort((a, b) => b[1] - a[1])[0]

  // Solos
  let solos = 0
  for (const s of personalShows) {
    const goers = rsvps.filter(r => r.show_id === s.id && r.status === 'going')
    if (goers.length === 1 && goers[0].name === userName) solos++
  }

  // Streaks, back to back, day of week
  const personalDates = personalShows.map(s => new Date(s.date_time))
  let backToBackCount = 0
  const backToBackExamples: Array<{ dates: string[] }> = []
  let longestGap: { days: number; startDate: string; endDate: string } | null = null
  for (let i = 1; i < personalDates.length; i++) {
    const diff = Math.round((personalDates[i].getTime() - personalDates[i - 1].getTime()) / 86400000)
    if (diff === 1) {
      backToBackCount++
      if (backToBackExamples.length < 3) {
        backToBackExamples.push({
          dates: [personalDates[i - 1].toISOString(), personalDates[i].toISOString()],
        })
      }
    }
    if (!longestGap || diff > longestGap.days) {
      longestGap = { days: diff, startDate: personalDates[i - 1].toISOString(), endDate: personalDates[i].toISOString() }
    }
  }

  const dayCounts = new Array(7).fill(0)
  for (const d of personalDates) dayCounts[d.getDay()]++
  const mostCommonDayIdx = dayCounts.indexOf(Math.max(...dayCounts))

  // Artists
  const artistCounts = new Map<string, { count: number; image_url?: string }>()
  const artistByPosition: Record<string, Map<string, { count: number; image_url?: string }>> = {
    Headliner: new Map(), Support: new Map(), Local: new Map(),
  }
  let totalArtistsSeen = 0
  for (const s of personalShows) {
    for (const a of s.show_artists || []) {
      totalArtistsSeen++
      const prev = artistCounts.get(a.artist) || { count: 0, image_url: a.image_url }
      artistCounts.set(a.artist, { count: prev.count + 1, image_url: a.image_url })
      const posMap = artistByPosition[a.position]
      if (posMap) {
        const pp = posMap.get(a.artist) || { count: 0, image_url: a.image_url }
        posMap.set(a.artist, { count: pp.count + 1, image_url: a.image_url })
      }
    }
  }

  const sortedArtists = Array.from(artistCounts.entries())
    .map(([artist, { count, image_url }]) => ({ artist, count, image_url }))
    .sort((a, b) => b.count - a.count)

  const mapToArray = (m: Map<string, { count: number; image_url?: string }>) =>
    Array.from(m.entries())
      .map(([artist, { count, image_url }]) => ({ artist, count, image_url }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

  // Group stats
  const groupVenueCounts = new Map<string, number>()
  for (const s of yearShows) {
    const goers = rsvps.filter(r => r.show_id === s.id && r.status === 'going')
    if (goers.length > 0) groupVenueCounts.set(s.venue, (groupVenueCounts.get(s.venue) || 0) + 1)
  }
  const groupTopVenue = Array.from(groupVenueCounts.entries()).sort((a, b) => b[1] - a[1])[0]

  const groupMonthlyCounts = new Array(12).fill(0)
  for (const s of yearShows) {
    const goers = rsvps.filter(r => r.show_id === s.id && r.status === 'going')
    if (goers.length > 0) groupMonthlyCounts[new Date(s.date_time).getMonth()]++
  }
  const groupBusiestIdx = groupMonthlyCounts.indexOf(Math.max(...groupMonthlyCounts))

  // Most people in one show
  let maxPeopleShow = { showTitle: '', date: '', count: 0 }
  for (const s of yearShows) {
    const goers = rsvps.filter(r => r.show_id === s.id && r.status === 'going')
    if (goers.length > maxPeopleShow.count) {
      maxPeopleShow = { showTitle: s.title, date: s.date_time, count: goers.length }
    }
  }

  // Solo counts per user
  const soloMap = new Map<string, number>()
  for (const s of yearShows) {
    const goers = rsvps.filter(r => r.show_id === s.id && r.status === 'going')
    if (goers.length === 1) soloMap.set(goers[0].name, (soloMap.get(goers[0].name) || 0) + 1)
  }
  const mostSoloEntry = Array.from(soloMap.entries()).sort((a, b) => b[1] - a[1])[0]

  // Group artist stats
  const groupArtistCounts = new Map<string, { count: number; image_url?: string }>()
  const groupArtistByPosition: Record<string, Map<string, { count: number; image_url?: string }>> = {
    Headliner: new Map(), Support: new Map(), Local: new Map(),
  }
  for (const s of yearShows) {
    const goers = rsvps.filter(r => r.show_id === s.id && r.status === 'going')
    if (goers.length === 0) continue
    for (const a of s.show_artists || []) {
      const prev = groupArtistCounts.get(a.artist) || { count: 0, image_url: a.image_url }
      groupArtistCounts.set(a.artist, { count: prev.count + 1, image_url: a.image_url })
      const posMap = groupArtistByPosition[a.position]
      if (posMap) {
        const pp = posMap.get(a.artist) || { count: 0, image_url: a.image_url }
        posMap.set(a.artist, { count: pp.count + 1, image_url: a.image_url })
      }
    }
  }
  const groupSortedArtists = Array.from(groupArtistCounts.entries())
    .map(([artist, { count, image_url }]) => ({ artist, count, image_url }))
    .sort((a, b) => b.count - a.count)

  // Leaderboard
  const leaderboard = Array.from(attendeeCounts.entries())
    .map(([name, totalShows]) => {
      const mc = monthlyByUser.get(name) || new Array(12).fill(0)
      return {
        name,
        displayName: name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        totalShows,
        mostActiveMonthCount: Math.max(...mc),
      }
    })
    .sort((a, b) => b.totalShows - a.totalShows)

  const monthlyData = allAttendees.map(name => ({
    name,
    displayName: name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    monthlyCounts: monthlyByUser.get(name) || new Array(12).fill(0),
    color: userColor(name),
  }))

  // Most active user
  const mostActive = leaderboard[0] || { name: '', count: 0 }

  // Average shows
  const averageShows = allAttendees.length > 0
    ? Array.from(attendeeCounts.values()).reduce((a, b) => a + b, 0) / allAttendees.length
    : 0

  // Group day of week
  const groupDayCounts = new Array(7).fill(0)
  for (const s of yearShows) {
    const goers = rsvps.filter(r => r.show_id === s.id && r.status === 'going')
    if (goers.length > 0) groupDayCounts[new Date(s.date_time).getDay()]++
  }
  const groupMostPopularDay = groupDayCounts.indexOf(Math.max(...groupDayCounts))

  return {
    year,
    personalSummary: {
      totalShows: personalShows.length,
      busiestMonth: busiestMonthIdx,
      busiestMonthName: MONTH_NAMES[busiestMonthIdx],
      topVenue: topVenueEntry?.[0],
    },
    leaderboard,
    monthlyData,
    stats: {
      personalTotalShows: personalShows.length,
      personalBusiestMonth: personalShows.length > 0
        ? { month: MONTH_NAMES[busiestMonthIdx], count: personalMonthlyCounts[busiestMonthIdx] }
        : null,
      personalTopVenue: topVenueEntry ? { venue: topVenueEntry[0], count: topVenueEntry[1] } : null,
      personalSolos: solos,
      personalFirstShow: personalShows[0]
        ? { title: personalShows[0].title, date: personalShows[0].date_time }
        : null,
      personalLastShow: personalShows.length > 0
        ? { title: personalShows[personalShows.length - 1].title, date: personalShows[personalShows.length - 1].date_time }
        : null,
      personalLongestGap: longestGap,
      personalBackToBackNights: { count: backToBackCount, examples: backToBackExamples },
      personalMaxShowsInMonth: personalShows.length > 0
        ? { month: MONTH_NAMES[busiestMonthIdx], count: personalMonthlyCounts[busiestMonthIdx] }
        : null,
      personalMostCommonDay: personalShows.length > 0
        ? { day: DAY_NAMES[mostCommonDayIdx], count: dayCounts[mostCommonDayIdx] }
        : null,
      personalTopArtists: sortedArtists.slice(0, 5),
      personalMostSeenArtist: sortedArtists[0] || null,
      personalUniqueArtists: artistCounts.size,
      personalArtistDiversity: personalShows.length > 0 ? artistCounts.size / totalArtistsSeen : 0,
      personalTopArtistsByPosition: {
        Headliner: mapToArray(artistByPosition.Headliner),
        Support: mapToArray(artistByPosition.Support),
        Local: mapToArray(artistByPosition.Local),
      },
      // Group stats
      totalShows: yearShows.filter(s => rsvps.some(r => r.show_id === s.id && r.status === 'going')).length,
      groupBusiestMonth: { month: MONTH_NAMES[groupBusiestIdx], count: groupMonthlyCounts[groupBusiestIdx] },
      groupTopVenue: groupTopVenue ? { venue: groupTopVenue[0], count: groupTopVenue[1] } : { venue: 'N/A', count: 0 },
      mostPeopleInOneShow: maxPeopleShow,
      mostSolos: mostSoloEntry ? { name: mostSoloEntry[0], count: mostSoloEntry[1] } : { name: 'N/A', count: 0 },
      mostActiveUser: { name: mostActive.name, count: mostActive.totalShows },
      groupTotal: yearShows.length,
      averageShowsPerPerson: Math.round(averageShows * 10) / 10,
      mostPopularDay: groupDayCounts.some(c => c > 0)
        ? { day: DAY_NAMES[groupMostPopularDay], count: groupDayCounts[groupMostPopularDay] }
        : null,
      biggestStreak: null, // simplified for demo
      groupTopArtists: groupSortedArtists.slice(0, 5),
      groupMostSeenArtist: groupSortedArtists[0] || null,
      groupUniqueArtists: groupArtistCounts.size,
      groupArtistDiversity: 0,
      mostDiverseUser: null,
      groupTopArtistsByPosition: {
        Headliner: mapToArray(groupArtistByPosition.Headliner),
        Support: mapToArray(groupArtistByPosition.Support),
        Local: mapToArray(groupArtistByPosition.Local),
      },
    },
  }
}
