import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { bostonToUTC } from '@/lib/time'
import { discordService, ShowData } from '@/lib/discord'

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

    // Get the original show
    const { data: originalShow, error: fetchError } = await supabase
      .from('shows')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching original show:', fetchError)
      return NextResponse.json(
        { error: 'Show not found' },
        { status: 404 }
      )
    }

    if (!originalShow) {
      return NextResponse.json(
        { error: 'Show not found' },
        { status: 404 }
      )
    }

    // Create a duplicate with the same details but new ID and timestamp
    const duplicateData = {
      title: originalShow.title,
      date_time: originalShow.date_time,
      time_local: originalShow.time_local,
      city: originalShow.city,
      venue: originalShow.venue,
      ticket_url: originalShow.ticket_url,
      google_photos_url: originalShow.google_photos_url,
      poster_url: originalShow.poster_url,
      notes: originalShow.notes,
      show_artists: originalShow.show_artists || []
    }

    // Insert the duplicate
    const { data: duplicate, error: insertError } = await supabase
      .from('shows')
      .insert([duplicateData])
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { error: 'Failed to duplicate show' },
        { status: 500 }
      )
    }

    // Send Discord notification asynchronously (don't block the response)
    if (duplicate) {
      const showData: ShowData = {
        id: duplicate.id,
        title: duplicate.title,
        date_time: duplicate.date_time,
        venue: duplicate.venue,
        city: duplicate.city
      }
      
      // Send notification asynchronously - don't await to avoid blocking the response
      discordService.sendNotificationAsync('new-show', showData)
    }

    return NextResponse.json(duplicate)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
