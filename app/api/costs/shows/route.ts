import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { validateUserName } from '@/lib/validation'
import { type ShowWithCosts } from '@/lib/costs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const userParam = searchParams.get('user')

    if (!userParam) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 })
    }

    const nameValidation = validateUserName(userParam)
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }
    const userName = nameValidation.sanitizedValue!

    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear()
    if (isNaN(year) || year < 2020 || year > 2100) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
    }

    const startDate = `${year}-01-01T00:00:00Z`
    const endDate = `${year + 1}-01-01T00:00:00Z`

    const { data: userRsvps, error: rsvpError } = await supabase
      .from('rsvps')
      .select('show_id')
      .eq('name', userName)
      .eq('status', 'going')

    if (rsvpError) {
      console.error('Error fetching RSVPs:', rsvpError)
      return NextResponse.json({ error: 'Failed to fetch RSVPs' }, { status: 500 })
    }

    if (!userRsvps || userRsvps.length === 0) {
      return NextResponse.json({ upcoming: [], past: [] })
    }

    const showIds = userRsvps.map(r => r.show_id)

    const { data: shows, error: showsError } = await supabase
      .from('shows')
      .select('id, title, date_time, venue, city, poster_url, show_artists')
      .in('id', showIds)
      .gte('date_time', startDate)
      .lt('date_time', endDate)
      .order('date_time', { ascending: true })

    if (showsError) {
      console.error('Error fetching shows:', showsError)
      return NextResponse.json({ error: 'Failed to fetch shows' }, { status: 500 })
    }

    if (!shows || shows.length === 0) {
      return NextResponse.json({ upcoming: [], past: [] })
    }

    const attendedShowIds = shows.map(s => s.id)

    const [costsResult, allRsvpsResult] = await Promise.all([
      supabase
        .from('show_costs')
        .select('*')
        .eq('user_id', userName)
        .in('show_id', attendedShowIds)
        .order('created_at', { ascending: true }),
      supabase
        .from('rsvps')
        .select('show_id, name, status')
        .in('show_id', attendedShowIds),
    ])

    if (costsResult.error) {
      console.error('Error fetching costs:', costsResult.error)
      return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 })
    }

    const costsByShow: Record<string, typeof costsResult.data> = {}
    for (const cost of (costsResult.data || [])) {
      if (!costsByShow[cost.show_id]) {
        costsByShow[cost.show_id] = []
      }
      costsByShow[cost.show_id].push(cost)
    }

    const rsvpsByShow: Record<string, { going: string[]; maybe: string[]; not_going: string[] }> = {}
    for (const rsvp of (allRsvpsResult.data || [])) {
      if (!rsvpsByShow[rsvp.show_id]) {
        rsvpsByShow[rsvp.show_id] = { going: [], maybe: [], not_going: [] }
      }
      if (rsvp.status === 'going') rsvpsByShow[rsvp.show_id].going.push(rsvp.name)
      else if (rsvp.status === 'maybe') rsvpsByShow[rsvp.show_id].maybe.push(rsvp.name)
      else if (rsvp.status === 'not_going') rsvpsByShow[rsvp.show_id].not_going.push(rsvp.name)
    }

    const now = new Date().toISOString()

    const allShows: ShowWithCosts[] = shows.map(show => {
      const showCosts = costsByShow[show.id] || []
      const totalCents = showCosts.reduce((sum, c) => sum + c.amount_minor, 0)

      return {
        id: show.id,
        title: show.title,
        date_time: show.date_time,
        venue: show.venue,
        city: show.city,
        poster_url: show.poster_url,
        show_artists: show.show_artists || [],
        costs: showCosts,
        total_cents: totalCents,
        rsvps: rsvpsByShow[show.id] || { going: [], maybe: [], not_going: [] },
      }
    })

    const upcoming = allShows.filter(s => s.date_time >= now)
    const past = allShows.filter(s => s.date_time < now).reverse()

    return NextResponse.json({ upcoming, past })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
