import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { toZonedTime } from 'date-fns-tz'

const BOSTON_TZ = 'America/New_York'

export interface RecapData {
  year: number
  personalSummary: {
    totalShows: number
    busiestMonth?: number
    busiestMonthName?: string
    topVenue?: string
  }
  leaderboard: Array<{
    name: string
    displayName: string
    totalShows: number
    mostActiveMonthCount: number
  }>
  monthlyData: Array<{
    name: string
    displayName: string
    monthlyCounts: number[]
    color: string
  }>
}

// Predefined color palette for consistent, distinguishable colors
const COLOR_PALETTE = [
  'hsl(220, 70%, 50%)',  // Blue
  'hsl(120, 60%, 50%)',  // Green
  'hsl(0, 70%, 50%)',    // Red
  'hsl(45, 80%, 50%)',   // Orange
  'hsl(280, 70%, 50%)',  // Purple
  'hsl(180, 70%, 50%)',  // Cyan
  'hsl(30, 80%, 50%)',   // Dark Orange
  'hsl(300, 60%, 50%)',  // Magenta
  'hsl(60, 80%, 45%)',   // Yellow
  'hsl(200, 70%, 50%)',  // Light Blue
  'hsl(140, 60%, 45%)',  // Forest Green
  'hsl(320, 70%, 50%)',  // Pink
  'hsl(40, 90%, 50%)',   // Gold
  'hsl(260, 70%, 50%)',  // Indigo
  'hsl(160, 70%, 50%)',  // Teal
]

// Generate stable color for user based on name
function generateUserColor(name: string): string {
  // Simple hash function for consistent colors
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use hash to select from predefined palette
  const colorIndex = Math.abs(hash) % COLOR_PALETTE.length
  return COLOR_PALETTE[colorIndex]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const currentUser = searchParams.get('user') || null
    
    // Validate year
    if (isNaN(year) || year < 2023 || year > new Date().getFullYear()) {
      return NextResponse.json(
        { error: 'Invalid year' },
        { status: 400 }
      )
    }

    // Define the year boundaries in Boston time
    const yearStart = new Date(`${year}-01-01T00:00:00`)
    const yearEnd = new Date(`${year}-12-31T23:59:59`)
    
    // Convert to UTC for database query
    const yearStartUTC = toZonedTime(yearStart, BOSTON_TZ)
    const yearEndUTC = toZonedTime(yearEnd, BOSTON_TZ)

    // Get all shows in the year with their RSVPs
    const { data: shows, error: showsError } = await supabase
      .from('shows')
      .select(`
        id,
        title,
        date_time,
        venue,
        rsvps(name, status)
      `)
      .gte('date_time', yearStartUTC.toISOString())
      .lte('date_time', yearEndUTC.toISOString())
      .order('date_time', { ascending: true })

    if (showsError) {
      console.error('Database error:', showsError)
      return NextResponse.json(
        { error: 'Failed to fetch recap data' },
        { status: 500 }
      )
    }

    // Process the data
    const userStats = new Map<string, {
      name: string
      displayName: string
      shows: Set<string> // Use Set to avoid duplicate shows per user
      monthlyCounts: number[]
      venueCounts: Map<string, number>
    }>()

    // Initialize monthly counts (0-11 for Jan-Dec)
    const initializeMonthlyCounts = () => new Array(12).fill(0)

    if (shows) {
      shows.forEach(show => {
        // Convert show date to Boston time to get the correct month
        const showDate = new Date(show.date_time)
        const bostonDate = toZonedTime(showDate, BOSTON_TZ)
        const monthIndex = bostonDate.getMonth() // 0-11

        // Process RSVPs for this show
        if (show.rsvps && Array.isArray(show.rsvps)) {
          show.rsvps.forEach((rsvp: { name: string; status: string }) => {
            // Only count "going" status
            if (rsvp.status === 'going') {
              const userName = rsvp.name.toLowerCase().trim()
              const displayName = rsvp.name.trim()
              
              if (!userStats.has(userName)) {
                userStats.set(userName, {
                  name: userName,
                  displayName: displayName,
                  shows: new Set(),
                  monthlyCounts: initializeMonthlyCounts(),
                  venueCounts: new Map()
                })
              }
              
              const userStat = userStats.get(userName)!
              
              // Add show to user's set (handles duplicates automatically)
              userStat.shows.add(show.id)
              
              // Increment monthly count
              userStat.monthlyCounts[monthIndex]++
              
              // Count venues
              const venue = show.venue
              userStat.venueCounts.set(venue, (userStat.venueCounts.get(venue) || 0) + 1)
            }
          })
        }
      })
    }

    // Convert to arrays and calculate stats
    const users = Array.from(userStats.values())
    
    // Calculate personal summary for the current user
    const personalSummary = currentUser && userStats.has(currentUser.toLowerCase()) ? (() => {
      const user = userStats.get(currentUser.toLowerCase())!
      const totalShows = user.shows.size
      
      // Find busiest month
      let busiestMonth = -1
      let maxCount = 0
      user.monthlyCounts.forEach((count, index) => {
        if (count > maxCount) {
          maxCount = count
          busiestMonth = index
        }
      })
      
      // Find top venue
      let topVenue = ''
      let maxVenueCount = 0
      user.venueCounts.forEach((count, venue) => {
        if (count > maxVenueCount) {
          maxVenueCount = count
          topVenue = venue
        }
      })
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December']
      
      return {
        totalShows,
        busiestMonth: busiestMonth >= 0 ? busiestMonth : undefined,
        busiestMonthName: busiestMonth >= 0 ? monthNames[busiestMonth] : undefined,
        topVenue: topVenue || undefined
      }
    })() : { totalShows: 0 }

    // Build leaderboard
    const leaderboard = users
      .map(user => {
        // Find most active month count for tie-breaking
        const mostActiveMonthCount = Math.max(...user.monthlyCounts)
        return {
          name: user.name,
          displayName: user.displayName,
          totalShows: user.shows.size,
          mostActiveMonthCount
        }
      })
      .sort((a, b) => {
        // Sort by total shows (desc), then by most active month count (desc), then alphabetically
        if (b.totalShows !== a.totalShows) {
          return b.totalShows - a.totalShows
        }
        if (b.mostActiveMonthCount !== a.mostActiveMonthCount) {
          return b.mostActiveMonthCount - a.mostActiveMonthCount
        }
        return a.displayName.localeCompare(b.displayName)
      })

    // Build monthly data for chart (limit to top 8 users)
    const topUsers = leaderboard.slice(0, 8)
    const monthlyData = topUsers.map(user => {
      const userStat = userStats.get(user.name)!
      return {
        name: user.name,
        displayName: user.displayName,
        monthlyCounts: userStat.monthlyCounts,
        color: generateUserColor(user.name)
      }
    })

    const recapData: RecapData = {
      year,
      personalSummary,
      leaderboard,
      monthlyData
    }

    return NextResponse.json(recapData)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
