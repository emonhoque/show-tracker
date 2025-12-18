import type { StorySlide, RecapData, StoryTheme } from './types'
import {
  getIntroCopy,
  getTotalShowsCopy,
  getMonthlyAvgCopy,
  getBusiestMonthCopy,
  getTopVenueCopy,
  getRankingCopy,
  getMonthlyChartCopy,
  getTopArtistsCopy,
  getArtistBadge,
  getComparisonCopy,
  getOutroCopy,
  generateCopySummary,
} from './recapCopy'

/**
 * Builds an array of story slides from RecapData
 * Handles missing optional fields gracefully
 */
export function buildRecapSlides(recap: RecapData): StorySlide[] {
  const slides: StorySlide[] = []
  const themes: StoryTheme[] = ['midnight', 'neon', 'sunset', 'forest', 'mono']
  let themeIndex = 0

  const getNextTheme = (): StoryTheme => {
    const theme = themes[themeIndex % themes.length]
    themeIndex++
    return theme
  }

  // Slide 1: Intro
  const introCopy = getIntroCopy(recap.totalShows, recap.year)
  slides.push({
    id: 'intro',
    kind: 'intro',
    title: introCopy.title,
    headline: introCopy.headline,
    subtext: introCopy.subtext,
    emoji: '🎵',
    theme: getNextTheme(),
    durationMs: 5000,
  })

  // Slide 2: Total Shows
  const totalShowsCopy = getTotalShowsCopy(recap.totalShows)
  slides.push({
    id: 'total-shows',
    kind: 'stat',
    title: totalShowsCopy.title,
    headline: totalShowsCopy.headline,
    subtext: totalShowsCopy.subtext,
    emoji: '🎤',
    theme: getNextTheme(),
  })

  // Slide 3: Average per Month
  const monthlyAvgCopy = getMonthlyAvgCopy(recap.avgPerMonth)
  slides.push({
    id: 'avg-per-month',
    kind: 'stat',
    title: monthlyAvgCopy.title,
    headline: monthlyAvgCopy.headline,
    subtext: monthlyAvgCopy.subtext,
    emoji: '📅',
    theme: getNextTheme(),
  })

  // Slide 4: Busiest Month
  if (recap.busiestMonth) {
    const busiestMonthCount = recap.busiestMonthCount ?? 
      (recap.monthCounts ? Math.max(...Object.values(recap.monthCounts)) : 1)
    const busiestMonthCopy = getBusiestMonthCopy(recap.busiestMonth, busiestMonthCount)
    slides.push({
      id: 'busiest-month',
      kind: 'stat',
      title: busiestMonthCopy.title,
      headline: busiestMonthCopy.headline,
      subtext: busiestMonthCopy.subtext,
      emoji: '🔥',
      theme: getNextTheme(),
    })
  }

  // Slide 5: Top Venue
  if (recap.topVenue) {
    const topVenueCount = recap.topVenueCount ?? 1
    const topVenueCopy = getTopVenueCopy(recap.topVenue, topVenueCount)
    slides.push({
      id: 'top-venue',
      kind: 'stat',
      title: topVenueCopy.title,
      headline: topVenueCopy.headline,
      subtext: topVenueCopy.subtext,
      emoji: '🏟️',
      theme: getNextTheme(),
    })
  }

  // Slide 6: Rank (optional)
  if (recap.rank) {
    const { position, total } = recap.rank
    const rankingCopy = getRankingCopy(position, total)
    slides.push({
      id: 'rank',
      kind: 'rank',
      title: rankingCopy.title,
      headline: rankingCopy.headline,
      subtext: `${rankingCopy.subtext} · ${rankingCopy.footer}`,
      emoji: '🏆',
      theme: getNextTheme(),
    })
  }

  // Slide 7: Monthly Trend Chart (optional)
  if (recap.monthCounts && Object.keys(recap.monthCounts).length > 0) {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const chartData = monthOrder.map(month => ({
      label: month,
      value: recap.monthCounts?.[month] ?? 0,
    }))

    // Only add if there's at least some data
    if (chartData.some(d => d.value > 0)) {
      const chartCopy = getMonthlyChartCopy(recap.monthCounts, recap.busiestMonth)
      slides.push({
        id: 'monthly-trend',
        kind: 'chart',
        title: chartCopy.title,
        theme: getNextTheme(),
        durationMs: 8000,
        chart: {
          type: 'bar',
          data: chartData,
          ariaLabel: `${chartCopy.subtext}. Bar chart showing monthly show attendance for ${recap.year}`,
        },
      })
    }
  }

  // Slide 8: Top Artists (optional)
  if (recap.topArtists && recap.topArtists.length > 0) {
    const topThree = recap.topArtists.slice(0, 3)
    const artistsCopy = getTopArtistsCopy()
    slides.push({
      id: 'top-artists',
      kind: 'list',
      title: artistsCopy.title,
      theme: getNextTheme(),
      durationMs: 7000,
      items: topThree.map((artist, index) => ({
        label: artist.name,
        value: `${artist.shows} ${artist.shows === 1 ? 'show' : 'shows'}`,
        badge: getArtistBadge(artist.shows, index === 0),
        imageUrl: artist.imageUrl,
      })),
    })
  }

  // Slide 9: Top Venues (optional)
  if (recap.topVenues && recap.topVenues.length > 1) {
    const topThree = recap.topVenues.slice(0, 3)
    slides.push({
      id: 'top-venues',
      kind: 'list',
      title: 'Favorite Venues',
      theme: getNextTheme(),
      durationMs: 7000,
      items: topThree.map((venue, index) => ({
        label: venue.name,
        value: `${venue.shows} ${venue.shows === 1 ? 'visit' : 'visits'}`,
        badge: index === 0 ? '#1' : undefined,
      })),
    })
  }

  // Slide 10: Comparison with others (optional)
  if (recap.leaderboard && recap.leaderboard.length > 1 && recap.userName) {
    // Get top 5 users for comparison
    const topUsers = recap.leaderboard.slice(0, 5).map(user => ({
      name: user.displayName,
      shows: user.totalShows,
      isCurrentUser: user.name === recap.userName,
    }))
    
    // Ensure current user is in the list if not in top 5
    const currentUserInTop = topUsers.some(u => u.isCurrentUser)
    if (!currentUserInTop) {
      const currentUserData = recap.leaderboard.find(u => u.name === recap.userName)
      if (currentUserData) {
        topUsers.pop() // Remove last one
        topUsers.push({
          name: currentUserData.displayName,
          shows: currentUserData.totalShows,
          isCurrentUser: true,
        })
      }
    }

    const userPosition = recap.leaderboard.findIndex(u => u.name === recap.userName) + 1
    const comparisonCopy = getComparisonCopy(userPosition, recap.leaderboard.length)

    slides.push({
      id: 'comparison',
      kind: 'comparison',
      title: comparisonCopy.title,
      theme: getNextTheme(),
      durationMs: 8000,
      userShows: recap.totalShows,
      userName: recap.userName,
      leaderboard: topUsers,
    })
  }

  // Slide 11: Outro
  const outroCopy = getOutroCopy(recap.year, recap.totalShows)
  slides.push({
    id: 'outro',
    kind: 'outro',
    title: outroCopy.title,
    headline: outroCopy.headline,
    subtext: outroCopy.subtext,
    emoji: '✨',
    theme: 'midnight',
    durationMs: 10000,
  })

  return slides
}

/**
 * Format a RecapData object into a shareable text summary
 */
export function formatRecapSummary(recap: RecapData): string {
  return generateCopySummary(recap)
}
