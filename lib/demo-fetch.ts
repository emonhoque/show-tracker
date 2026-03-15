/**
 * DEMO MODE — Client-side fetch interceptor.
 *
 * When demo mode is active, this module intercepts fetch() calls to /api/*
 * and routes them to the in-memory demo-store instead.
 * No network requests are made; no real database is touched.
 */

import * as store from './demo-store'
import { bostonToUTC } from './time'
import { DEMO_YEAR } from './demo-data'

// Helper to build a JSON Response that looks like NextResponse.json()
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function error(message: string, status = 400): Response {
  return json({ error: message }, status)
}

/**
 * Attempt to handle a fetch request in demo mode.
 * Returns a Response if matched, or null if the request should pass through.
 */
export async function demoFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response | null> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const method = init?.method?.toUpperCase() || 'GET'

  // Only intercept /api/* requests
  const apiMatch = url.match(/\/api\/(.*)/)
  if (!apiMatch) return null
  const path = '/' + apiMatch[1].split('?')[0] // strip query string
  const params = new URL(url, 'http://localhost').searchParams

  // Parse JSON body if present
  let body: Record<string, unknown> = {}
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string)
    } catch {
      // FormData or non-JSON body — ignore
    }
  }

  // ─── Shows ───────────────────────────────

  if (path === '/shows/upcoming' && method === 'GET') {
    return json(store.getUpcomingShows())
  }

  if (path === '/shows/past' && method === 'GET') {
    const page = parseInt(params.get('page') || '1')
    const limit = parseInt(params.get('limit') || '20')
    return json(store.getPastShows(page, limit))
  }

  if (path === '/shows' && method === 'POST') {
    const dateLocal = body.date_local as string
    const timeLocal = body.time_local as string
    const dateTime = bostonToUTC(dateLocal, timeLocal)
    const show = store.addShow({
      title: body.title as string,
      date_time: dateTime.toISOString(),
      time_local: timeLocal,
      city: (body.city as string) || 'Boston',
      venue: body.venue as string,
      ticket_url: (body.ticket_url as string) || null,
      spotify_url: null,
      apple_music_url: null,
      google_photos_url: (body.google_photos_url as string) || null,
      poster_url: (body.poster_url as string) || null,
      notes: (body.notes as string) || null,
      show_artists: (body.show_artists as []) || [],
    })
    return json(show, 201)
  }

  // PUT /shows/[id]
  const showPutMatch = path.match(/^\/shows\/([^/]+)$/)
  if (showPutMatch && method === 'PUT') {
    const id = showPutMatch[1]
    const dateLocal = body.date_local as string
    const timeLocal = body.time_local as string
    const dateTime = bostonToUTC(dateLocal, timeLocal)
    const updated = store.updateShow(id, {
      title: body.title as string,
      date_time: dateTime.toISOString(),
      time_local: timeLocal,
      city: (body.city as string) || 'Boston',
      venue: body.venue as string,
      ticket_url: (body.ticket_url as string) || null,
      google_photos_url: (body.google_photos_url as string) || null,
      poster_url: (body.poster_url as string) || null,
      notes: (body.notes as string) || null,
      show_artists: (body.show_artists as []) || [],
    })
    return updated ? json(updated) : error('Show not found', 404)
  }

  // DELETE /shows/[id]
  const showDeleteMatch = path.match(/^\/shows\/([^/]+)$/)
  if (showDeleteMatch && method === 'DELETE') {
    const ok = store.deleteShow(showDeleteMatch[1])
    return ok ? json({ message: 'Show deleted successfully' }) : error('Show not found', 404)
  }

  // POST /shows/[id]/duplicate
  const dupMatch = path.match(/^\/shows\/([^/]+)\/duplicate$/)
  if (dupMatch && method === 'POST') {
    const dup = store.duplicateShow(dupMatch[1])
    return dup ? json(dup, 201) : error('Show not found', 404)
  }

  // GET /shows/[id]/costs
  const showCostsGetMatch = path.match(/^\/shows\/([^/]+)\/costs$/)
  if (showCostsGetMatch && method === 'GET') {
    const user = params.get('user') || ''
    return json(store.getShowCosts(showCostsGetMatch[1], user))
  }

  // POST /shows/[id]/costs
  if (showCostsGetMatch && method === 'POST') {
    const cost = store.addCost({
      show_id: showCostsGetMatch[1],
      user_id: body.user as string,
      category: body.category as ShowCostCategory,
      amount_minor: body.amount_minor as number,
      currency: 'USD',
      note: (body.note as string) || null,
    })
    return json(cost, 201)
  }

  // ─── RSVPs ──────────────────────────────

  if (path === '/rsvp' && method === 'POST') {
    const rsvp = store.setRsvp(
      body.show_id as string,
      body.name as string,
      body.status as 'going' | 'maybe' | 'not_going',
    )
    return json(rsvp)
  }

  if (path === '/rsvp/remove' && method === 'POST') {
    store.removeRsvp(body.show_id as string, body.name as string)
    return json({ success: true })
  }

  // GET /rsvps/[show_id]
  const rsvpShowMatch = path.match(/^\/rsvps\/([^/]+)$/)
  if (rsvpShowMatch && method === 'GET') {
    return json(store.getRsvpSummary(rsvpShowMatch[1]))
  }

  // ─── Artists ────────────────────────────

  if (path === '/artists' && method === 'GET') {
    return json(store.getArtists())
  }

  if (path === '/artists' && method === 'POST') {
    // In demo mode, we simulate "finding" the artist in our demo pool
    const spotifyId = body.spotifyId as string
    const existing = store.getArtists().find(a => a.spotify_id === spotifyId)
    if (existing) return json(existing)
    // Can't add truly new artists in demo mode — just return a not-found-style response
    return error('Artist not found in demo data', 404)
  }

  if (path === '/artists/search' && method === 'GET') {
    const q = params.get('q') || ''
    return json({ artists: store.searchArtistsDemo(q) })
  }

  // DELETE /artists/[id]
  const artistDeleteMatch = path.match(/^\/artists\/([^/]+)$/)
  if (artistDeleteMatch && method === 'DELETE') {
    const ok = store.deleteArtist(artistDeleteMatch[1])
    return ok ? json({ message: 'Artist deleted successfully' }) : error('Artist not found', 404)
  }

  // ─── Releases ───────────────────────────

  if (path === '/releases' && method === 'GET') {
    const page = parseInt(params.get('page') || '1')
    const limit = parseInt(params.get('limit') || '50')
    const days = parseInt(params.get('days') || '30')
    const weeks = parseInt(params.get('weeks') || '0')
    const effectiveDays = weeks > 0 ? weeks * 7 : days
    return json(store.getReleases(page, limit, effectiveDays))
  }

  if (path === '/releases' && method === 'POST') {
    // Simulate a "check for new releases" action — just return current data
    return json({ message: 'Releases refreshed', total: store.getAllReleases().length })
  }

  // ─── Costs ──────────────────────────────

  // PATCH /costs/[costId]
  const costPatchMatch = path.match(/^\/costs\/([^/]+)$/)
  if (costPatchMatch && method === 'PATCH') {
    const updated = store.updateCost(costPatchMatch[1], body.user as string, {
      category: body.category as ShowCostCategory | undefined,
      amount_minor: body.amount_minor as number | undefined,
      note: body.note as string | undefined,
    })
    return updated ? json(updated) : error('Cost not found', 404)
  }

  // DELETE /costs/[costId]
  if (costPatchMatch && method === 'DELETE') {
    const user = params.get('user') || ''
    const ok = store.deleteCost(costPatchMatch[1], user)
    return ok ? json({ success: true }) : error('Cost not found', 404)
  }

  if (path === '/costs/shows' && method === 'GET') {
    const user = params.get('user') || ''
    const year = params.get('year') ? parseInt(params.get('year')!) : undefined
    return json(store.getCostShows(user, year))
  }

  if (path === '/costs/summary' && method === 'GET') {
    const user = params.get('user') || ''
    const year = params.get('year') ? parseInt(params.get('year')!) : undefined
    return json(store.getCostSummary(user, year))
  }

  // ─── Recap ──────────────────────────────

  if (path === '/recap' && method === 'GET') {
    const user = params.get('user') || ''
    const year = parseInt(params.get('year') || String(DEMO_YEAR))
    return json(store.getRecap(user, year))
  }

  // ─── Calendar export ────────────────────

  const calExportMatch = path.match(/^\/calendar\/export\/([^/]+)$/)
  if (calExportMatch && method === 'GET') {
    const show = store.getShowById(calExportMatch[1])
    if (!show) return error('Show not found', 404)
    // Return a simple ICS stub
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${show.title}`,
      `DTSTART:${show.date_time.replace(/[-:]/g, '').split('.')[0]}Z`,
      `LOCATION:${show.venue}\\, ${show.city}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    return new Response(icsContent, {
      headers: { 'Content-Type': 'text/calendar', 'Content-Disposition': 'attachment; filename=show.ics' },
    })
  }

  // ─── Upload poster (no-op in demo) ─────

  if (path === '/upload-poster' && method === 'POST') {
    return json({ url: '/api/image-proxy?url=https://placehold.co/400x600/333/FFF?text=Poster', filename: 'demo-poster.jpg' })
  }

  // ─── Image proxy (pass through) ────────
  // Let the real image-proxy route handle this since it doesn't touch the DB

  // ─── Cron (no-op in demo) ──────────────
  if (path === '/cron/check-releases') {
    return json({ message: 'Demo mode — cron disabled', totalArtists: 0, totalNewReleases: 0, results: [] })
  }

  // Not matched — pass through to real fetch
  return null
}

// Type alias to avoid importing the full module
type ShowCostCategory = 'ticket' | 'travel' | 'merch' | 'food_drink' | 'lodging' | 'parking' | 'rideshare' | 'other'
