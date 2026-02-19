import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { validateUserName } from '@/lib/validation'
import { COST_CATEGORIES } from '@/lib/costs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userParam = searchParams.get('user')

    if (!userParam) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 })
    }

    const nameValidation = validateUserName(userParam)
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }
    const userName = nameValidation.sanitizedValue!

    const { data: costs, error } = await supabase
      .from('show_costs')
      .select('*')
      .eq('show_id', id)
      .eq('user_id', userName)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching costs:', error)
      return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 })
    }

    return NextResponse.json(costs || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: showId } = await params
    const body = await request.json()
    const { user, category, amount_minor, note } = body

    if (!user) {
      return NextResponse.json({ error: 'User is required' }, { status: 400 })
    }

    const nameValidation = validateUserName(user)
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }
    const userName = nameValidation.sanitizedValue!

    const validCategories = COST_CATEGORIES.map(c => c.value)
    if (!category || !validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    if (!amount_minor || typeof amount_minor !== 'number' || amount_minor <= 0 || !Number.isInteger(amount_minor)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const { data: show, error: showError } = await supabase
      .from('shows')
      .select('id')
      .eq('id', showId)
      .single()

    if (showError || !show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 })
    }

    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .select('status')
      .eq('show_id', showId)
      .eq('name', userName)
      .single()

    if (rsvpError || !rsvp || rsvp.status !== 'going') {
      return NextResponse.json(
        { error: 'You must RSVP as "going" to add costs for this show' },
        { status: 403 }
      )
    }

    const sanitizedNote = note ? String(note).trim().slice(0, 200) : null

    const { data, error } = await supabase
      .from('show_costs')
      .insert({
        show_id: showId,
        user_id: userName,
        category,
        amount_minor,
        currency: 'USD',
        note: sanitizedNote,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save cost' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
