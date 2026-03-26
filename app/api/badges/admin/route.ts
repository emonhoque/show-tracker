import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

/**
 * Auth helper — checks CRON_SECRET via Bearer header or ?secret= query param.
 */
function isAuthorized(request: NextRequest): boolean {
  const secret =
    request.headers.get('authorization')?.replace('Bearer ', '') ??
    request.nextUrl.searchParams.get('secret')
  return !!process.env.CRON_SECRET && secret === process.env.CRON_SECRET
}

/**
 * GET /api/badges/admin — list all secret badge definitions.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('secret_badge_definitions')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ definitions: data })
}

/**
 * POST /api/badges/admin — create a new secret badge definition.
 * Body: { spotify_id, name, description, image_url? }
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { spotify_id, name, description, image_url, scope } = body

  if (!spotify_id || !name || !description) {
    return NextResponse.json(
      { error: 'Missing required fields: spotify_id, name, description' },
      { status: 400 },
    )
  }

  const badgeScope = scope === 'year' ? 'year' : 'lifetime'

  // Auto-generate key from name: "Illenium Award" → "secret_illenium_award"
  const key = `secret_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`

  const { data, error } = await supabase
    .from('secret_badge_definitions')
    .insert({ key, spotify_id, name, description, image_url: image_url || null, scope: badgeScope })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A badge for this artist already exists' },
        { status: 409 },
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ definition: data }, { status: 201 })
}

/**
 * PATCH /api/badges/admin — update a secret badge definition.
 * Body: { id, name?, description?, scope? }
 */
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, name, description, scope } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 })
  }

  const updates: Record<string, string> = {}
  if (name !== undefined) updates.name = name
  if (description !== undefined) updates.description = description
  if (scope === 'year' || scope === 'lifetime') updates.scope = scope

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('secret_badge_definitions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ definition: data })
}

/**
 * DELETE /api/badges/admin — remove a secret badge definition.
 * Body: { id }
 */
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 })
  }

  const { error } = await supabase
    .from('secret_badge_definitions')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
