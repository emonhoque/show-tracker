import { NextRequest, NextResponse } from 'next/server'
import { validateUserName, validateRsvpStatus } from '@/lib/validation'

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

    // Demo mode - return mock success response
    return NextResponse.json({
      id: `rsvp_${Date.now()}`,
      show_id,
      name: nameValidation.sanitizedValue,
      status: statusValidation.sanitizedValue,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
