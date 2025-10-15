import { NextRequest, NextResponse } from 'next/server'
import { RSVPSummary } from '@/lib/types'
import { getRsvpsByShowId } from '@/lib/mockData'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ show_id: string }> }
) {
  try {
    const { show_id } = await params

    // Return mock RSVP data
    const rsvps = getRsvpsByShowId(show_id)

    // Organize RSVPs by status
    const summary: RSVPSummary = {
      going: [],
      maybe: [],
      not_going: []
    }

    rsvps.forEach((rsvp) => {
      if (rsvp.status === 'going') {
        summary.going.push(rsvp.name)
      } else if (rsvp.status === 'maybe') {
        summary.maybe.push(rsvp.name)
      } else if (rsvp.status === 'not_going') {
        summary.not_going.push(rsvp.name)
      }
    })

    return NextResponse.json(summary)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
