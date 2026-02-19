import { NextRequest, NextResponse } from 'next/server'
import { backfillAllUsers } from '@/lib/badges'

/**
 * POST /api/badges/backfill
 * Recomputes badges for every user who has at least one "going" RSVP.
 * Protected by the same CRON_SECRET used for other server-side jobs.
 */
export async function POST(request: NextRequest) {
  try {
    // Simple auth: require CRON_SECRET header or query param
    const secret =
      request.headers.get('authorization')?.replace('Bearer ', '') ??
      request.nextUrl.searchParams.get('secret')

    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await backfillAllUsers()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Backfill error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
