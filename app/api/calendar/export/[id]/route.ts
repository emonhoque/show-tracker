import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { showToCalendarEvent, generateICSContent, validateShowForCalendar, getDefaultDuration } from '@/lib/calendar'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get the show from database
    const { data: show, error } = await supabase
      .from('shows')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !show) {
      return NextResponse.json(
        { error: 'Show not found' },
        { status: 404 }
      )
    }

    // Validate show data
    const validation = validateShowForCalendar(show)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: `Invalid show data: ${validation.errors.join(', ')}` },
        { status: 400 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const duration = parseFloat(searchParams.get('duration') || getDefaultDuration(show).toString())
    const timezone = searchParams.get('timezone') || 'America/New_York'

    // Validate duration
    if (isNaN(duration) || duration <= 0 || duration > 24) {
      return NextResponse.json(
        { error: 'Invalid duration. Must be between 0 and 24 hours.' },
        { status: 400 }
      )
    }

    // Convert show to calendar event
    const event = showToCalendarEvent(show, { duration, timezone })

    // Generate ICS content
    const icsContent = generateICSContent(event, `show-${show.id}`)

    // Create filename
    const dateStr = show.date_time.split('T')[0]
    const titleSlug = show.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const filename = `${titleSlug}_${dateStr}.ics`

    // Return ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Calendar export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate calendar file' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
