import { NextRequest, NextResponse } from 'next/server'
import {
  validateTitle,
  validateVenue,
  validateCity,
  validateUrl,
  validateNotes,
  validateDate,
  validateTime
} from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date_local, time_local, city, venue, ticket_url, google_photos_url, poster_url, notes, show_artists } = body

    // Validate and sanitize all inputs
    const titleValidation = validateTitle(title)
    if (!titleValidation.isValid) {
      return NextResponse.json({ error: titleValidation.error }, { status: 400 })
    }

    const venueValidation = validateVenue(venue)
    if (!venueValidation.isValid) {
      return NextResponse.json({ error: venueValidation.error }, { status: 400 })
    }

    const cityValidation = validateCity(city)
    if (!cityValidation.isValid) {
      return NextResponse.json({ error: cityValidation.error }, { status: 400 })
    }

    const dateValidation = validateDate(date_local)
    if (!dateValidation.isValid) {
      return NextResponse.json({ error: dateValidation.error }, { status: 400 })
    }

    const timeValidation = validateTime(time_local)
    if (!timeValidation.isValid) {
      return NextResponse.json({ error: timeValidation.error }, { status: 400 })
    }

    const ticketUrlValidation = validateUrl(ticket_url || '')
    if (!ticketUrlValidation.isValid) {
      return NextResponse.json({ error: ticketUrlValidation.error }, { status: 400 })
    }

    const googlePhotosUrlValidation = validateUrl(google_photos_url || '')
    if (!googlePhotosUrlValidation.isValid) {
      return NextResponse.json({ error: googlePhotosUrlValidation.error }, { status: 400 })
    }

    const posterUrlValidation = validateUrl(poster_url || '')
    if (!posterUrlValidation.isValid) {
      return NextResponse.json({ error: posterUrlValidation.error }, { status: 400 })
    }

    const notesValidation = validateNotes(notes || '')
    if (!notesValidation.isValid) {
      return NextResponse.json({ error: notesValidation.error }, { status: 400 })
    }

    // Demo mode - return mock success response
    return NextResponse.json({
      id: `show_${Date.now()}`,
      title: titleValidation.sanitizedValue,
      date_time: new Date(`${dateValidation.sanitizedValue}T${timeValidation.sanitizedValue}`).toISOString(),
      time_local: timeValidation.sanitizedValue,
      city: cityValidation.sanitizedValue,
      venue: venueValidation.sanitizedValue,
      ticket_url: ticketUrlValidation.sanitizedValue || null,
      google_photos_url: googlePhotosUrlValidation.sanitizedValue || null,
      poster_url: posterUrlValidation.sanitizedValue || null,
      notes: notesValidation.sanitizedValue || null,
      show_artists: show_artists || [],
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
