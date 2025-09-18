import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { bostonToUTC } from '@/lib/time'
import { discordService, ShowData } from '@/lib/discord'
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
    const { title, date_local, time_local, city, venue, ticket_url, spotify_url, apple_music_url, google_photos_url, poster_url, notes } = body

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

    const spotifyUrlValidation = validateUrl(spotify_url || '')
    if (!spotifyUrlValidation.isValid) {
      return NextResponse.json({ error: spotifyUrlValidation.error }, { status: 400 })
    }

    const appleMusicUrlValidation = validateUrl(apple_music_url || '')
    if (!appleMusicUrlValidation.isValid) {
      return NextResponse.json({ error: appleMusicUrlValidation.error }, { status: 400 })
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

    // Convert Boston local date and time to UTC
    const utcDateTime = bostonToUTC(dateValidation.sanitizedValue!, timeValidation.sanitizedValue!)

    // Insert into database with sanitized values
    const { data, error } = await supabase
      .from('shows')
      .insert([
        {
          title: titleValidation.sanitizedValue,
          date_time: utcDateTime.toISOString(),
          time_local: timeValidation.sanitizedValue,
          city: cityValidation.sanitizedValue,
          venue: venueValidation.sanitizedValue,
          ticket_url: ticketUrlValidation.sanitizedValue || null,
          spotify_url: spotifyUrlValidation.sanitizedValue || null,
          apple_music_url: appleMusicUrlValidation.sanitizedValue || null,
          google_photos_url: googlePhotosUrlValidation.sanitizedValue || null,
          poster_url: posterUrlValidation.sanitizedValue || null,
          notes: notesValidation.sanitizedValue || null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create show' },
        { status: 500 }
      )
    }

    // Send Discord notification asynchronously (don't block the response)
    if (data) {
      const showData: ShowData = {
        id: data.id,
        title: data.title,
        date_time: data.date_time,
        venue: data.venue,
        city: data.city
      }
      
      // Send notification asynchronously - don't await to avoid blocking the response
      discordService.sendNotificationAsync('new-show', showData)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
