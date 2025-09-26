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

export async function DELETE(
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

    // Delete the show (RSVPs will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('shows')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete show' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Show deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { title, date_local, time_local, city, venue, ticket_url, google_photos_url, poster_url, notes, show_artists } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Show ID is required' },
        { status: 400 }
      )
    }

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

    // Convert Boston local date and time to UTC
    const utcDateTime = bostonToUTC(dateValidation.sanitizedValue!, timeValidation.sanitizedValue!)

    // Update the show with sanitized values
    const { data, error } = await supabase
      .from('shows')
      .update({
        title: titleValidation.sanitizedValue,
        date_time: utcDateTime.toISOString(),
        time_local: timeValidation.sanitizedValue,
        city: cityValidation.sanitizedValue,
        venue: venueValidation.sanitizedValue,
        ticket_url: ticketUrlValidation.sanitizedValue || null,
        google_photos_url: googlePhotosUrlValidation.sanitizedValue || null,
        poster_url: posterUrlValidation.sanitizedValue || null,
        notes: notesValidation.sanitizedValue || null,
        show_artists: show_artists || []
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update show' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Show not found' },
        { status: 404 }
      )
    }

    // Send Discord notification asynchronously (don't block the response)
    const showData: ShowData = {
      id: data.id,
      title: data.title,
      date_time: data.date_time,
      venue: data.venue,
      city: data.city
    }
    
    // Send notification asynchronously - don't await to avoid blocking the response
    discordService.sendNotificationAsync('updated-show', showData)

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
