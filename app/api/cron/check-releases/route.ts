import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job (optional security check)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Demo mode - return mock cron response
    return NextResponse.json({
      message: 'Demo mode: Checked 7 artists, found 3 new releases',
      totalArtists: 7,
      totalNewReleases: 3,
      results: [
        { artist: 'The Weeknd', status: 'success', newReleases: 1 },
        { artist: 'Tame Impala', status: 'no_new_releases', newReleases: 0 },
        { artist: 'Arctic Monkeys', status: 'success', newReleases: 2 },
        { artist: 'Radiohead', status: 'no_new_releases', newReleases: 0 }
      ],
      demo: true
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
