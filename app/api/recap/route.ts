import { NextRequest, NextResponse } from 'next/server'

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

    // Demo mode - return mock recap data
    return NextResponse.json({
      year,
      personalSummary: {
        totalShows: 12,
        busiestMonth: 8,
        busiestMonthName: 'September',
        topVenue: 'The Paradise Rock Club'
      },
      leaderboard: [
        { name: 'Alice', displayName: 'Alice', totalShows: 15, mostActiveMonthCount: 4 },
        { name: 'Bob', displayName: 'Bob', totalShows: 12, mostActiveMonthCount: 3 },
        { name: 'Charlie', displayName: 'Charlie', totalShows: 8, mostActiveMonthCount: 2 }
      ],
      monthlyData: [
        { name: 'Alice', displayName: 'Alice', monthlyCounts: [1, 2, 1, 0, 2, 1, 3, 2, 4, 1, 0, 1], color: 'hsl(220, 70%, 50%)' },
        { name: 'Bob', displayName: 'Bob', monthlyCounts: [0, 1, 2, 1, 1, 2, 2, 1, 3, 0, 1, 0], color: 'hsl(120, 60%, 50%)' }
      ],
      stats: {
        personalTotalShows: 12,
        personalBusiestMonth: { month: 'September', count: 4 },
        personalTopVenue: { venue: 'The Paradise Rock Club', count: 3 },
        personalSolos: 2,
        personalFirstShow: { title: 'Summer Festival', date: '1/15/2025' },
        personalLastShow: { title: 'Year End Show', date: '12/28/2025' },
        personalLongestGap: { days: 45, startDate: '6/1/2025', endDate: '7/16/2025' },
        personalBackToBackNights: { count: 2, examples: [{ dates: ['9/15/2025', '9/16/2025'] }] },
        personalMaxShowsInMonth: { month: 'September', count: 4 },
        personalMostCommonDay: { day: 'Saturday', count: 8 },
        personalTopArtists: [
          { artist: 'The Weeknd', count: 3, image_url: 'https://i.scdn.co/image/abc123' },
          { artist: 'Tame Impala', count: 2 }
        ],
        personalMostSeenArtist: { artist: 'The Weeknd', count: 3 },
        personalUniqueArtists: 10,
        personalArtistDiversity: 0.83,
        personalTopArtistsByPosition: {
          Headliner: [{ artist: 'The Weeknd', count: 3 }],
          Support: [{ artist: 'Local Band', count: 2 }],
          Local: [{ artist: 'DJ Mix', count: 1 }]
        },
        totalShows: 20,
        groupBusiestMonth: { month: 'September', count: 35 },
        groupTopVenue: { venue: 'The Paradise Rock Club', count: 12 },
        mostPeopleInOneShow: { showTitle: 'Big Festival', date: '9/15/2025', count: 5 },
        mostSolos: { name: 'Charlie', count: 6 },
        mostActiveUser: { name: 'Alice', count: 15 },
        groupTotal: 35,
        averageShowsPerPerson: 11.7,
        mostPopularDay: { day: 'Saturday', count: 25 },
        biggestStreak: { user: 'Alice', streak: 8 },
        groupTopArtists: [
          { artist: 'The Weeknd', count: 8 },
          { artist: 'Tame Impala', count: 6 }
        ],
        groupMostSeenArtist: { artist: 'The Weeknd', count: 8 },
        groupUniqueArtists: 25,
        groupArtistDiversity: 0.71,
        mostDiverseUser: { name: 'Bob', diversity: 0.92 },
        groupTopArtistsByPosition: {
          Headliner: [{ artist: 'The Weeknd', count: 8 }],
          Support: [{ artist: 'Local Band', count: 5 }],
          Local: [{ artist: 'DJ Mix', count: 3 }]
        }
      },
      demo: true
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
