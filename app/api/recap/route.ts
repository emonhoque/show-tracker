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
  stats: {
    // Personal stats
    personalTotalShows: number
    personalBusiestMonth: {
      month: string
      count: number
    } | null
    personalTopVenue: {
      venue: string
      count: number
    } | null
    personalSolos: number
    personalFirstShow: {
      title: string
      date: string
    } | null
    personalLastShow: {
      title: string
      date: string
    } | null
    personalLongestGap: {
      days: number
      startDate: string
      endDate: string
    } | null
    personalBackToBackNights: {
      count: number
      examples: Array<{
        dates: string[]
      }>
    }
    personalMaxShowsInMonth: {
      month: string
      count: number
    } | null
    personalMostCommonDay: {
      day: string
      count: number
    } | null
    
    // Group stats
    totalShows: number
    groupBusiestMonth: {
      month: string
      count: number
    }
    groupTopVenue: {
      venue: string
      count: number
    }
    mostPeopleInOneShow: {
      showTitle: string
      date: string
      count: number
    }
    mostSolos: {
      name: string
      count: number
    }
    mostActiveUser: {
      name: string
      count: number
    }
    groupTotal: number
    averageShowsPerPerson: number
    mostPopularDay: {
      day: string
      count: number
    } | null
    biggestStreak: {
      user: string
      streak: number
    } | null
  }
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
              const userName = rsvp.name.trim()
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
    const personalSummary = currentUser && userStats.has(currentUser) ? (() => {
      const user = userStats.get(currentUser)!
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

    // Calculate comprehensive stats
    const stats = (() => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December']
      
      // Personal stats for current user
      const currentUserStat = currentUser ? userStats.get(currentUser) : null
      
      // Personal stats
      const personalTotalShows = currentUserStat ? currentUserStat.shows.size : 0
      
      // Personal busiest month
      let personalBusiestMonth = null
      if (currentUserStat) {
        let maxCount = 0
        let maxMonth = ''
        currentUserStat.monthlyCounts.forEach((count, index) => {
          if (count > maxCount) {
            maxCount = count
            maxMonth = monthNames[index]
          }
        })
        if (maxCount > 0) {
          personalBusiestMonth = { month: maxMonth, count: maxCount }
        }
      }
      
      // Personal top venue
      let personalTopVenue = null
      if (currentUserStat) {
        let maxVenueCount = 0
        let maxVenue = ''
        currentUserStat.venueCounts.forEach((count, venue) => {
          if (count > maxVenueCount) {
            maxVenueCount = count
            maxVenue = venue
          }
        })
        if (maxVenueCount > 0) {
          personalTopVenue = { venue: maxVenue, count: maxVenueCount }
        }
      }
      
      // Personal solos count
      let personalSolos = 0
      if (shows && currentUser) {
        shows.forEach(show => {
          const goingRSVPs = show.rsvps?.filter((rsvp: any) => rsvp.status === 'going') || []
          if (goingRSVPs.length === 1 && goingRSVPs[0].name.trim() === currentUser) {
            personalSolos++
          }
        })
      }
      
      // Personal first and last shows
      let personalFirstShow = null
      let personalLastShow = null
      if (currentUser && shows) {
        const userShows = shows.filter(show => 
          show.rsvps?.some((rsvp: any) => rsvp.name.trim() === currentUser && rsvp.status === 'going')
        ).sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
        
        if (userShows.length > 0) {
          const firstDate = new Date(userShows[0].date_time)
          const firstBostonDate = toZonedTime(firstDate, BOSTON_TZ)
          personalFirstShow = {
            title: userShows[0].title,
            date: firstBostonDate.toLocaleDateString()
          }
          
          const lastDate = new Date(userShows[userShows.length - 1].date_time)
          const lastBostonDate = toZonedTime(lastDate, BOSTON_TZ)
          personalLastShow = {
            title: userShows[userShows.length - 1].title,
            date: lastBostonDate.toLocaleDateString()
          }
        }
      }
      
      // Personal longest gap
      let personalLongestGap = null
      if (currentUser && shows) {
        const userShows = shows.filter(show => 
          show.rsvps?.some((rsvp: any) => rsvp.name.trim() === currentUser && rsvp.status === 'going')
        ).sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
        
        let maxGap = 0
        let maxGapStart = ''
        let maxGapEnd = ''
        
        for (let i = 0; i < userShows.length - 1; i++) {
          const currentDate = new Date(userShows[i].date_time)
          const nextDate = new Date(userShows[i + 1].date_time)
          const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff > maxGap) {
            const currentBostonDate = toZonedTime(currentDate, BOSTON_TZ)
            const nextBostonDate = toZonedTime(nextDate, BOSTON_TZ)
            maxGap = daysDiff
            maxGapStart = currentBostonDate.toLocaleDateString()
            maxGapEnd = nextBostonDate.toLocaleDateString()
          }
        }
        
        if (maxGap > 0) {
          personalLongestGap = {
            days: maxGap,
            startDate: maxGapStart,
            endDate: maxGapEnd
          }
        }
      }
      
      // Personal back-to-back nights
      let personalBackToBackNights = { count: 0, examples: [] as Array<{ dates: string[] }> }
      if (currentUser && shows) {
        const userShowDates: Date[] = []
        shows.forEach(show => {
          const showDate = new Date(show.date_time)
          const bostonDate = toZonedTime(showDate, BOSTON_TZ)
          
          if (show.rsvps?.some((rsvp: any) => rsvp.name.trim() === currentUser && rsvp.status === 'going')) {
            userShowDates.push(bostonDate)
          }
        })
        
        const sortedDates = [...userShowDates].sort((a, b) => a.getTime() - b.getTime())
        let consecutiveCount = 0
        const consecutiveGroups: Date[][] = []
        let currentGroup: Date[] = []
        
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const currentDate = sortedDates[i]
          const nextDate = sortedDates[i + 1]
          const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff === 1) {
            if (currentGroup.length === 0) {
              currentGroup.push(currentDate)
            }
            currentGroup.push(nextDate)
            consecutiveCount++
          } else {
            if (currentGroup.length > 0) {
              consecutiveGroups.push([...currentGroup])
              currentGroup = []
            }
          }
        }
        
        if (currentGroup.length > 0) {
          consecutiveGroups.push(currentGroup)
        }
        
        if (consecutiveCount > 0) {
          personalBackToBackNights.count = consecutiveCount
          consecutiveGroups.forEach(group => {
            if (group.length >= 2) {
              personalBackToBackNights.examples.push({
                dates: group.map(date => date.toLocaleDateString())
              })
            }
          })
        }
      }
      
      // Personal max shows in single month
      let personalMaxShowsInMonth = null
      if (currentUserStat) {
        let maxCount = 0
        let maxMonth = ''
        currentUserStat.monthlyCounts.forEach((count, index) => {
          if (count > maxCount) {
            maxCount = count
            maxMonth = monthNames[index]
          }
        })
        if (maxCount > 0) {
          personalMaxShowsInMonth = { month: maxMonth, count: maxCount }
        }
      }
      
      // Personal most common day of week
      let personalMostCommonDay = null
      if (currentUser && shows) {
        const dayCounts = new Map<string, number>()
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        
        shows.forEach(show => {
          if (show.rsvps?.some((rsvp: any) => rsvp.name.trim() === currentUser && rsvp.status === 'going')) {
            const showDate = new Date(show.date_time)
            const bostonDate = toZonedTime(showDate, BOSTON_TZ)
            const dayOfWeek = dayNames[bostonDate.getDay()]
            dayCounts.set(dayOfWeek, (dayCounts.get(dayOfWeek) || 0) + 1)
          }
        })
        
        let maxDayCount = 0
        let maxDay = ''
        dayCounts.forEach((count, day) => {
          if (count > maxDayCount) {
            maxDayCount = count
            maxDay = day
          }
        })
        
        if (maxDayCount > 0) {
          personalMostCommonDay = { day: maxDay, count: maxDayCount }
        }
      }
      
      // Group stats
      const totalShows = shows?.length || 0
      
      // Group busiest month (across all users)
      let groupBusiestMonth = { month: '', count: 0 }
      const monthlyTotals = new Array(12).fill(0)
      users.forEach(user => {
        user.monthlyCounts.forEach((count, index) => {
          monthlyTotals[index] += count
        })
      })
      
      monthlyTotals.forEach((count, index) => {
        if (count > groupBusiestMonth.count) {
          groupBusiestMonth = { month: monthNames[index], count }
        }
      })
      
      // Group top venue (across all users)
      const venueCounts = new Map<string, number>()
      users.forEach(user => {
        user.venueCounts.forEach((count, venue) => {
          venueCounts.set(venue, (venueCounts.get(venue) || 0) + count)
        })
      })
      
      let groupTopVenue = { venue: '', count: 0 }
      venueCounts.forEach((count, venue) => {
        if (count > groupTopVenue.count) {
          groupTopVenue = { venue, count }
        }
      })
      
      // Group-oriented stats
      let mostPeopleInOneShow = { showTitle: '', date: '', count: 0 }
      let mostSolos = { name: '', count: 0 }
      let mostActiveUser = { name: '', count: 0 }
      let groupTotal = 0
      
      // Most people in one show
      if (shows) {
        shows.forEach(show => {
          const goingCount = show.rsvps?.filter((rsvp: any) => rsvp.status === 'going').length || 0
          if (goingCount > mostPeopleInOneShow.count) {
            const showDate = new Date(show.date_time)
            const bostonDate = toZonedTime(showDate, BOSTON_TZ)
            mostPeopleInOneShow = {
              showTitle: show.title,
              date: bostonDate.toLocaleDateString(),
              count: goingCount
            }
          }
        })
      }
      
      // Most solos (users who went alone most often)
      const soloCounts = new Map<string, number>()
      if (shows) {
        shows.forEach(show => {
          const goingRSVPs = show.rsvps?.filter((rsvp: any) => rsvp.status === 'going') || []
          if (goingRSVPs.length === 1) {
            const userName = goingRSVPs[0].name.trim()
            soloCounts.set(userName, (soloCounts.get(userName) || 0) + 1)
          }
        })
      }
      
      soloCounts.forEach((count, name) => {
        if (count > mostSolos.count) {
          // Use the same method as charts - get displayName from userStats
          const userStat = userStats.get(name)
          const displayName = userStat ? userStat.displayName : name
          mostSolos = { name: displayName, count }
        }
      })
      
      // Most active user and group totals
      users.forEach(user => {
        groupTotal += user.shows.size
        if (user.shows.size > mostActiveUser.count) {
          mostActiveUser = { name: user.displayName, count: user.shows.size }
        }
      })
      
      const averageShowsPerPerson = users.length > 0 ? groupTotal / users.length : 0
      
      // Time-based stats
      let firstShowOfYear = { title: '', date: '' }
      let lastShowOfYear = { title: '', date: '' }
      
      if (shows && shows.length > 0) {
        const sortedShows = [...shows].sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
        
        const firstDate = new Date(sortedShows[0].date_time)
        const firstBostonDate = toZonedTime(firstDate, BOSTON_TZ)
        firstShowOfYear = {
          title: sortedShows[0].title,
          date: firstBostonDate.toLocaleDateString()
        }
        
        const lastDate = new Date(sortedShows[sortedShows.length - 1].date_time)
        const lastBostonDate = toZonedTime(lastDate, BOSTON_TZ)
        lastShowOfYear = {
          title: sortedShows[sortedShows.length - 1].title,
          date: lastBostonDate.toLocaleDateString()
        }
      }
      
      // Longest gap between shows
      let longestGap = { days: 0, startDate: '', endDate: '' }
      if (shows && shows.length > 1) {
        const sortedShows = [...shows].sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
        
        for (let i = 0; i < sortedShows.length - 1; i++) {
          const currentDate = new Date(sortedShows[i].date_time)
          const nextDate = new Date(sortedShows[i + 1].date_time)
          const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff > longestGap.days) {
            const currentBostonDate = toZonedTime(currentDate, BOSTON_TZ)
            const nextBostonDate = toZonedTime(nextDate, BOSTON_TZ)
            longestGap = {
              days: daysDiff,
              startDate: currentBostonDate.toLocaleDateString(),
              endDate: nextBostonDate.toLocaleDateString()
            }
          }
        }
      }
      
      // Back-to-back nights
      const backToBackNights = { count: 0, examples: [] as Array<{ user: string; dates: string[] }> }
      const userShowDates = new Map<string, Date[]>()
      
      // Collect all show dates for each user
      if (shows) {
        shows.forEach(show => {
          const showDate = new Date(show.date_time)
          const bostonDate = toZonedTime(showDate, BOSTON_TZ)
          
          show.rsvps?.forEach((rsvp: any) => {
            if (rsvp.status === 'going') {
              const userName = rsvp.name.trim()
              if (!userShowDates.has(userName)) {
                userShowDates.set(userName, [])
              }
              userShowDates.get(userName)!.push(bostonDate)
            }
          })
        })
      }
      
      // Check for consecutive days
      userShowDates.forEach((dates, userName) => {
        const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime())
        let consecutiveCount = 0
        const consecutiveGroups: Date[][] = []
        let currentGroup: Date[] = []
        
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const currentDate = sortedDates[i]
          const nextDate = sortedDates[i + 1]
          const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff === 1) {
            if (currentGroup.length === 0) {
              currentGroup.push(currentDate)
            }
            currentGroup.push(nextDate)
            consecutiveCount++
          } else {
            if (currentGroup.length > 0) {
              consecutiveGroups.push([...currentGroup])
              currentGroup = []
            }
          }
        }
        
        if (currentGroup.length > 0) {
          consecutiveGroups.push(currentGroup)
        }
        
        if (consecutiveCount > 0) {
          backToBackNights.count += consecutiveCount
          consecutiveGroups.forEach(group => {
            if (group.length >= 2) {
              // Use the same method as charts - get displayName from userStats
              const userStat = userStats.get(userName)
              const displayName = userStat ? userStat.displayName : userName
              backToBackNights.examples.push({
                user: displayName,
                dates: group.map(date => date.toLocaleDateString())
              })
            }
          })
        }
      })
      
      // Max shows in a single month for one person
      let maxShowsInSingleMonth = { user: '', month: '', count: 0 }
      users.forEach(user => {
        user.monthlyCounts.forEach((count, index) => {
          if (count > maxShowsInSingleMonth.count) {
            maxShowsInSingleMonth = {
              user: user.displayName,
              month: monthNames[index],
              count
            }
          }
        })
      })
      
      // Group most popular day of week
      let mostPopularDay = null
      if (shows) {
        const dayCounts = new Map<string, number>()
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        
        shows.forEach(show => {
          const goingCount = show.rsvps?.filter((rsvp: any) => rsvp.status === 'going').length || 0
          if (goingCount > 0) {
            const showDate = new Date(show.date_time)
            const bostonDate = toZonedTime(showDate, BOSTON_TZ)
            const dayOfWeek = dayNames[bostonDate.getDay()]
            dayCounts.set(dayOfWeek, (dayCounts.get(dayOfWeek) || 0) + goingCount)
          }
        })
        
        let maxDayCount = 0
        let maxDay = ''
        dayCounts.forEach((count, day) => {
          if (count > maxDayCount) {
            maxDayCount = count
            maxDay = day
          }
        })
        
        if (maxDayCount > 0) {
          mostPopularDay = { day: maxDay, count: maxDayCount }
        }
      }
      
      // Group biggest streak (longest run of months with at least one show)
      let biggestStreak = null
      if (users.length > 0) {
        let maxStreak = 0
        let maxStreakUser = ''
        
        users.forEach(user => {
          const userStat = userStats.get(user.name)!
          let currentStreak = 0
          let maxUserStreak = 0
          
          userStat.monthlyCounts.forEach(count => {
            if (count > 0) {
              currentStreak++
              maxUserStreak = Math.max(maxUserStreak, currentStreak)
            } else {
              currentStreak = 0
            }
          })
          
          if (maxUserStreak > maxStreak) {
            maxStreak = maxUserStreak
            maxStreakUser = user.displayName
          }
        })
        
        if (maxStreak > 0) {
          biggestStreak = { user: maxStreakUser, streak: maxStreak }
        }
      }
      
      return {
        // Personal stats
        personalTotalShows,
        personalBusiestMonth,
        personalTopVenue,
        personalSolos,
        personalFirstShow,
        personalLastShow,
        personalLongestGap,
        personalBackToBackNights,
        personalMaxShowsInMonth,
        personalMostCommonDay,
        
        // Group stats
        totalShows,
        groupBusiestMonth,
        groupTopVenue,
        mostPeopleInOneShow,
        mostSolos,
        mostActiveUser,
        groupTotal,
        averageShowsPerPerson,
        mostPopularDay,
        biggestStreak
      }
    })()

    const recapData: RecapData = {
      year,
      personalSummary,
      leaderboard,
      monthlyData,
      stats
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
