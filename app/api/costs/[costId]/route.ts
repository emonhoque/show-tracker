import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { validateUserName } from '@/lib/validation'
import { COST_CATEGORIES } from '@/lib/costs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ costId: string }> }
) {
  try {
    const { costId } = await params
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

    const { data: existingCost, error: fetchError } = await supabase
      .from('show_costs')
      .select('*')
      .eq('id', costId)
      .single()

    if (fetchError || !existingCost) {
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
    }

    if (existingCost.user_id !== userName) {
      return NextResponse.json({ error: 'Not authorized to edit this cost' }, { status: 403 })
    }

    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .select('status')
      .eq('show_id', existingCost.show_id)
      .eq('name', userName)
      .single()

    if (rsvpError || !rsvp || rsvp.status !== 'going') {
      return NextResponse.json(
        { error: 'You must RSVP as "going" to edit costs for this show' },
        { status: 403 }
      )
    }

    const updates: Record<string, unknown> = {}

    if (category !== undefined) {
      const validCategories = COST_CATEGORIES.map(c => c.value)
      if (!validCategories.includes(category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
      updates.category = category
    }

    if (amount_minor !== undefined) {
      if (typeof amount_minor !== 'number' || amount_minor <= 0 || !Number.isInteger(amount_minor)) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
      }
      updates.amount_minor = amount_minor
    }

    if (note !== undefined) {
      updates.note = note ? String(note).trim().slice(0, 200) : null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('show_costs')
      .update(updates)
      .eq('id', costId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update cost' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ costId: string }> }
) {
  try {
    const { costId } = await params
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

    const { data: existingCost, error: fetchError } = await supabase
      .from('show_costs')
      .select('*')
      .eq('id', costId)
      .single()

    if (fetchError || !existingCost) {
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
    }

    if (existingCost.user_id !== userName) {
      return NextResponse.json({ error: 'Not authorized to delete this cost' }, { status: 403 })
    }

    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .select('status')
      .eq('show_id', existingCost.show_id)
      .eq('name', userName)
      .single()

    if (rsvpError || !rsvp || rsvp.status !== 'going') {
      return NextResponse.json(
        { error: 'You must RSVP as "going" to delete costs for this show' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('show_costs')
      .delete()
      .eq('id', costId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete cost' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
