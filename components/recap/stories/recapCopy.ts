/**
 * Dynamic Copy System for Recap Stories
 * 
 * Generates personalized, data-driven copy for each slide.
 * Tone: Confident but friendly. Short sentences. No fluff.
 * Never shames low numbers. Rewards consistency as much as volume.
 */

import type { RecapData } from './types'

// ============================================
// INTRO SLIDE COPY
// ============================================

export function getIntroCopy(totalShows: number, year: number): { title: string; headline: string; subtext: string } {
  const title = `Your ${year} Recap`
  
  let headline: string
  if (totalShows === 0) {
    headline = 'A quiet year, musically'
  } else if (totalShows <= 4) {
    headline = 'A year of live music'
  } else if (totalShows <= 11) {
    headline = 'You showed up for live music'
  } else if (totalShows <= 19) {
    headline = 'You stayed busy'
  } else {
    headline = 'You basically lived at shows'
  }
  
  const subtext = totalShows > 0 ? 'Tap through your year in shows' : 'Next year is wide open'
  
  return { title, headline, subtext }
}

// ============================================
// TOTAL SHOWS SLIDE COPY
// ============================================

export function getTotalShowsCopy(totalShows: number): { title: string; headline: string; subtext: string } {
  const title = 'Total Shows'
  const headline = `${totalShows}`
  
  let subtext: string
  if (totalShows === 0) {
    subtext = 'No shows this year, but next year is wide open'
  } else if (totalShows === 1) {
    subtext = 'You made it out at least once'
  } else if (totalShows <= 4) {
    subtext = 'A few solid nights out'
  } else if (totalShows <= 11) {
    subtext = 'A strong concert year'
  } else if (totalShows <= 19) {
    subtext = 'You stayed busy'
  } else {
    subtext = "That's a serious run"
  }
  
  return { title, headline, subtext }
}

// ============================================
// MONTHLY AVERAGE SLIDE COPY
// ============================================

export function getMonthlyAvgCopy(avgPerMonth: number): { title: string; headline: string; subtext: string } {
  const title = 'Monthly Average'
  const headline = avgPerMonth.toFixed(1)
  
  let subtext: string
  if (avgPerMonth < 0.5) {
    subtext = 'More of a special occasion thing'
  } else if (avgPerMonth < 1.0) {
    subtext = 'Every now and then'
  } else if (avgPerMonth < 1.5) {
    subtext = 'About once a month'
  } else if (avgPerMonth < 2.5) {
    subtext = 'Almost every other week'
  } else {
    subtext = 'You were locked in'
  }
  
  return { title, headline, subtext }
}

// ============================================
// BUSIEST MONTH SLIDE COPY
// ============================================

export function getBusiestMonthCopy(
  busiestMonth: string,
  busiestMonthCount: number
): { title: string; headline: string; subtext: string } {
  const title = 'Busiest Month'
  const headline = busiestMonth
  
  let subtext: string
  if (busiestMonthCount === 1) {
    subtext = 'You picked your moment'
  } else if (busiestMonthCount === 2) {
    subtext = 'A good month to go out'
  } else if (busiestMonthCount === 3) {
    subtext = 'You were in a groove'
  } else {
    subtext = 'You were everywhere'
  }
  
  // Add flavor for peak show season
  const peakSeasonMonths = ['Sep', 'Oct', 'September', 'October']
  if (peakSeasonMonths.some(m => busiestMonth.includes(m))) {
    subtext = 'Peak show season energy'
  }
  
  return { title, headline, subtext }
}

// ============================================
// TOP VENUE SLIDE COPY
// ============================================

export function getTopVenueCopy(
  topVenue: string,
  topVenueCount: number
): { title: string; headline: string; subtext: string } {
  const title = 'Top Venue'
  const headline = topVenue
  
  let subtext: string
  if (topVenueCount === 1) {
    subtext = 'One and done'
  } else if (topVenueCount === 2) {
    subtext = 'You came back for more'
  } else {
    subtext = 'Basically your second home'
  }
  
  return { title, headline, subtext }
}

// ============================================
// RANKING SLIDE COPY
// ============================================

export function getRankingCopy(
  position: number,
  total: number
): { title: string; headline: string; subtext: string; footer: string } {
  const title = 'Your Ranking'
  const headline = `#${position}`
  
  let subtext: string
  if (position === 1) {
    subtext = 'Top of the leaderboard'
  } else if (position <= 3) {
    subtext = 'Podium finish'
  } else if (position <= Math.ceil(total / 2)) {
    subtext = 'Solid showing'
  } else {
    subtext = 'Room to climb next year'
  }
  
  const footer = `Out of ${total} attendees`
  
  return { title, headline, subtext, footer }
}

// ============================================
// MONTHLY CHART SLIDE COPY
// ============================================

export function getMonthlyChartCopy(
  monthCounts: Record<string, number>,
  busiestMonth: string
): { title: string; subtext: string } {
  const title = 'Your Year in Shows'
  
  const values = Object.values(monthCounts)
  const nonZeroValues = values.filter(v => v > 0)
  const maxValue = Math.max(...values)
  const avgValue = nonZeroValues.length > 0 
    ? nonZeroValues.reduce((a, b) => a + b, 0) / nonZeroValues.length 
    : 0
  
  // Check if one month dominates (more than 2x the average)
  const dominantMonth = maxValue > avgValue * 2 && maxValue >= 3
  
  // Check if spread evenly (standard deviation is low)
  const variance = nonZeroValues.length > 0
    ? nonZeroValues.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / nonZeroValues.length
    : 0
  const stdDev = Math.sqrt(variance)
  const isEvenlySpread = stdDev < 1 && nonZeroValues.length >= 4
  
  let subtext: string
  if (dominantMonth) {
    subtext = `${busiestMonth} carried the year`
  } else if (isEvenlySpread) {
    subtext = 'Pretty consistent all year'
  } else {
    subtext = 'You had waves'
  }
  
  return { title, subtext }
}

// ============================================
// TOP ARTISTS SLIDE COPY
// ============================================

export function getTopArtistsCopy(): { title: string } {
  return { title: 'Top Artists' }
}

export function getArtistBadge(shows: number, isTopArtist: boolean): string | undefined {
  if (!isTopArtist) return undefined
  
  if (shows === 1) {
    return 'Debut'
  } else if (shows === 2) {
    return 'Repeat listen'
  } else {
    return 'On rotation'
  }
}

// ============================================
// COMPARISON SLIDE COPY
// ============================================

export function getComparisonCopy(
  position: number,
  total: number
): { title: string; subtext: string } {
  const title = 'How You Stack Up'
  
  let subtext: string
  if (position === 1) {
    subtext = 'Leading the pack'
  } else if (position <= 3) {
    subtext = 'Right up there with the best'
  } else if (position <= Math.ceil(total / 2)) {
    subtext = 'Holding your own'
  } else {
    subtext = 'Every show counts'
  }
  
  return { title, subtext }
}

// ============================================
// OUTRO SLIDE COPY
// ============================================

export function getOutroCopy(year: number, totalShows: number): { title: string; headline: string; subtext: string } {
  const title = "That's a wrap"
  
  let headline: string
  if (totalShows === 0) {
    headline = `${year} was a reset year`
  } else if (totalShows <= 11) {
    headline = `${year} was a good year`
  } else if (totalShows <= 19) {
    headline = `${year} was loud`
  } else {
    headline = `${year} went hard`
  }
  
  const subtext = 'Share your recap'
  
  return { title, headline, subtext }
}

// ============================================
// COPY SUMMARY (for clipboard)
// ============================================

export function generateCopySummary(recap: RecapData): string {
  const parts: string[] = []
  
  parts.push(`${recap.year} recap.`)
  parts.push(`${recap.totalShows} show${recap.totalShows !== 1 ? 's' : ''} attended.`)
  
  if (recap.busiestMonth) {
    parts.push(`Busiest month was ${recap.busiestMonth}.`)
  }
  
  if (recap.topVenue) {
    parts.push(`Favorite venue was ${recap.topVenue}.`)
  }
  
  parts.push(`Average of ${recap.avgPerMonth.toFixed(1)} shows per month.`)
  
  if (recap.rank) {
    parts.push(`Ranked ${recap.rank.position} out of ${recap.rank.total} attendees.`)
  }
  
  return parts.join(' ')
}

// ============================================
// UTILITY: Get all copy for a full recap
// ============================================

export interface FullRecapCopy {
  intro: { title: string; headline: string; subtext: string }
  totalShows: { title: string; headline: string; subtext: string }
  monthlyAvg: { title: string; headline: string; subtext: string }
  busiestMonth?: { title: string; headline: string; subtext: string }
  topVenue?: { title: string; headline: string; subtext: string }
  ranking?: { title: string; headline: string; subtext: string; footer: string }
  monthlyChart?: { title: string; subtext: string }
  topArtists?: { title: string }
  comparison?: { title: string; subtext: string }
  outro: { title: string; headline: string; subtext: string }
  summary: string
}

export function getAllRecapCopy(recap: RecapData): FullRecapCopy {
  const copy: FullRecapCopy = {
    intro: getIntroCopy(recap.totalShows, recap.year),
    totalShows: getTotalShowsCopy(recap.totalShows),
    monthlyAvg: getMonthlyAvgCopy(recap.avgPerMonth),
    outro: getOutroCopy(recap.year, recap.totalShows),
    summary: generateCopySummary(recap),
  }
  
  if (recap.busiestMonth) {
    const busiestMonthCount = recap.busiestMonthCount ?? 
      (recap.monthCounts ? Math.max(...Object.values(recap.monthCounts)) : 1)
    copy.busiestMonth = getBusiestMonthCopy(recap.busiestMonth, busiestMonthCount)
  }
  
  if (recap.topVenue) {
    const topVenueCount = recap.topVenueCount ?? 1
    copy.topVenue = getTopVenueCopy(recap.topVenue, topVenueCount)
  }
  
  if (recap.rank) {
    copy.ranking = getRankingCopy(recap.rank.position, recap.rank.total)
  }
  
  if (recap.monthCounts && Object.keys(recap.monthCounts).length > 0) {
    copy.monthlyChart = getMonthlyChartCopy(recap.monthCounts, recap.busiestMonth)
  }
  
  if (recap.topArtists && recap.topArtists.length > 0) {
    copy.topArtists = getTopArtistsCopy()
  }
  
  if (recap.rank && recap.rank.total > 1) {
    copy.comparison = getComparisonCopy(recap.rank.position, recap.rank.total)
  }
  
  return copy
}
