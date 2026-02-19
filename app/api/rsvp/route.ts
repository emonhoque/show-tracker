import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { isShowPast } from '@/lib/time'
import { validateUserName, validateRsvpStatus } from '@/lib/validation'
import { evaluateAndUnlockBadges } from '@/lib/badges'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { show_id, status, name } = body

    // Validate required fields
    if (!show_id || !status || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate and sanitize user name
    const nameValidation = validateUserName(name)
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }

    // Validate status
    const statusValidation = validateRsvpStatus(status)
    if (!statusValidation.isValid) {
      return NextResponse.json({ error: statusValidation.error }, { status: 400 })
    }

    // Check if the show is in the past
    const { data: show, error: showError } = await supabase
      .from('shows')
      .select('date_time')
      .eq('id', show_id)
      .single()

    if (showError || !show) {
      return NextResponse.json(
        { error: 'Show not found' },
        { status: 404 }
      )
    }

    // For past shows, only allow "going" status (for "I was there!" functionality)
    if (isShowPast(show.date_time) && status !== 'going') {
      return NextResponse.json(
        { error: 'Cannot RSVP to past shows' },
        { status: 409 }
      )
    }

    // Upsert RSVP with sanitized name
    const { data, error } = await supabase
      .from('rsvps')
      .upsert(
        { show_id, name: nameValidation.sanitizedValue, status: statusValidation.sanitizedValue, updated_at: new Date().toISOString() },
        { onConflict: 'show_id,name' }
      )
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save RSVP' },
        { status: 500 }
      )
    }

    // Fire-and-forget badge evaluation so it does not delay the response
    if (nameValidation.sanitizedValue) {
      evaluateAndUnlockBadges(nameValidation.sanitizedValue).catch((err) =>
        console.error('[badges] async eval failed:', err),
      )
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
