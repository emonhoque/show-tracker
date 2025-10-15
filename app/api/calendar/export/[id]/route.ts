import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Demo mode - return sample ICS content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Show Tracker//Demo Mode//EN
BEGIN:VEVENT
UID:demo-show-${id}@showtracker.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20251115T200000Z
DTEND:20251115T230000Z
SUMMARY:Demo Show - The Weeknd @ Paradise Rock Club
LOCATION:The Paradise Rock Club, Boston, MA
DESCRIPTION:This is a demo calendar event. In production mode this would be a real show.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    // Return ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="demo-show-${id}.ics"`,
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
