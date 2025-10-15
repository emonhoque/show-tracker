import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Show ID is required' },
        { status: 400 }
      )
    }

    // Demo mode - return mock duplicate response
    return NextResponse.json({
      id: `show_duplicate_${Date.now()}`,
      title: 'Demo Show (Duplicate)',
      date_time: new Date().toISOString(),
      time_local: '20:00',
      city: 'Boston',
      venue: 'Paradise Rock Club',
      ticket_url: null,
      google_photos_url: null,
      poster_url: null,
      notes: 'This is a duplicated show in demo mode',
      show_artists: [],
      created_at: new Date().toISOString(),
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
