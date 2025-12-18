import type { StorySlide, RecapData, StoryTheme } from './types'

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
  slides.push({
    id: 'intro',
    kind: 'intro',
    title: `Your ${recap.year} Recap`,
    headline: 'A year of live music',
    subtext: 'Tap to continue',
    emoji: '🎵',
    theme: getNextTheme(),
    durationMs: 5000,
  })

  // Slide 2: Total Shows
  slides.push({
    id: 'total-shows',
    kind: 'stat',
    title: 'Total Shows',
    headline: `${recap.totalShows}`,
    subtext: recap.totalShows === 1 ? 'show attended' : 'shows attended',
    emoji: '🎤',
    theme: getNextTheme(),
  })

  // Slide 3: Average per Month
  slides.push({
    id: 'avg-per-month',
    kind: 'stat',
    title: 'Monthly Average',
    headline: `${recap.avgPerMonth.toFixed(1)}`,
    subtext: 'shows per month',
    emoji: '📅',
    theme: getNextTheme(),
  })

  // Slide 4: Busiest Month
  if (recap.busiestMonth) {
    slides.push({
      id: 'busiest-month',
      kind: 'stat',
      title: 'Busiest Month',
      headline: recap.busiestMonth,
      subtext: 'You were in the zone!',
      emoji: '🔥',
      theme: getNextTheme(),
    })
  }

  // Slide 5: Top Venue
  if (recap.topVenue) {
    slides.push({
      id: 'top-venue',
      kind: 'stat',
      title: 'Top Venue',
      headline: recap.topVenue,
      subtext: 'Your favorite spot',
      emoji: '🏟️',
      theme: getNextTheme(),
    })
  }

  // Slide 6: Rank (optional)
  if (recap.rank) {
    const { position, total } = recap.rank
    const ordinal = getOrdinal(position)
    slides.push({
      id: 'rank',
      kind: 'rank',
      title: 'Your Ranking',
      headline: `${ordinal}`,
      subtext: `out of ${total} attendees`,
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
      slides.push({
        id: 'monthly-trend',
        kind: 'chart',
        title: 'Your Year in Shows',
        theme: getNextTheme(),
        durationMs: 8000, // Give more time for chart slides
        chart: {
          type: 'bar',
          data: chartData,
          ariaLabel: `Bar chart showing monthly show attendance for ${recap.year}`,
        },
      })
    }
  }

  // Slide 8: Top Artists (optional)
  if (recap.topArtists && recap.topArtists.length > 0) {
    const topThree = recap.topArtists.slice(0, 3)
    slides.push({
      id: 'top-artists',
      kind: 'list',
      title: 'Top Artists',
      theme: getNextTheme(),
      durationMs: 7000,
      items: topThree.map((artist, index) => ({
        label: artist.name,
        value: `${artist.shows} ${artist.shows === 1 ? 'show' : 'shows'}`,
        badge: artist.isHeadliner ? 'Headliner' : index === 0 ? '#1' : undefined,
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

    slides.push({
      id: 'comparison',
      kind: 'comparison',
      title: 'How You Stack Up',
      theme: getNextTheme(),
      durationMs: 8000,
      userShows: recap.totalShows,
      userName: recap.userName,
      leaderboard: topUsers,
    })
  }

  // Slide 11: Outro
  slides.push({
    id: 'outro',
    kind: 'outro',
    title: `That's a wrap!`,
    headline: `${recap.year} was amazing`,
    subtext: 'Share your recap',
    emoji: '✨',
    theme: 'midnight',
    durationMs: 10000, // Longer for sharing
  })

  return slides
}

/**
 * Format a RecapData object into a shareable text summary
 */
export function formatRecapSummary(recap: RecapData): string {
  const parts: string[] = []

  parts.push(`${recap.year} Recap: ${recap.totalShows} shows.`)

  if (recap.busiestMonth) {
    parts.push(`Busiest month: ${recap.busiestMonth}.`)
  }

  if (recap.topVenue) {
    parts.push(`Top venue: ${recap.topVenue}.`)
  }

  parts.push(`Avg ${recap.avgPerMonth.toFixed(1)} per month.`)

  if (recap.rank) {
    parts.push(`Ranked ${recap.rank.position} of ${recap.rank.total}.`)
  }

  return parts.join(' ')
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
  const j = n % 10
  const k = n % 100
  if (j === 1 && k !== 11) return n + 'st'
  if (j === 2 && k !== 12) return n + 'nd'
  if (j === 3 && k !== 13) return n + 'rd'
  return n + 'th'
}
