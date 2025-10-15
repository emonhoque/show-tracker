import { NextRequest, NextResponse } from 'next/server'
import { validateUserName } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { show_id, name } = body

    // Validate required fields
    if (!show_id || !name) {
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

    // Demo mode - return mock success response
    return NextResponse.json({
      success: true,
      demo: true,
      message: 'RSVP removed in demo mode'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
