import { NextRequest, NextResponse } from 'next/server'
import { validateUserName } from '@/lib/validation'
import {
  getUserBadges,
  evaluateAndUnlockBadges,
  BADGE_DEFINITIONS,
  getBadgeImageUrl,
} from '@/lib/badges'

/**
 * GET /api/badges?user=<name>
 * Returns unlocked + locked badges for the user.
 * Also triggers a lightweight evaluation so the response is always fresh.
 */
export async function GET(request: NextRequest) {
  try {
    const user = request.nextUrl.searchParams.get('user')
    if (!user) {
      return NextResponse.json(
        { error: 'Missing required query parameter: user' },
        { status: 400 },
      )
    }

    const nameValidation = validateUserName(user)
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 },
      )
    }

    const userId = nameValidation.sanitizedValue!

    // Evaluate first so the response includes any newly unlocked badges
    const newBadges = await evaluateAndUnlockBadges(userId)

    // Fetch the full badge list with status
    const badges = await getUserBadges(userId)

    // Attach image URLs
    const withImages = badges.map((b) => ({
      ...b,
      image_url: getBadgeImageUrl(b.key),
    }))

    return NextResponse.json({
      badges: withImages,
      newlyUnlocked: newBadges,
      total: BADGE_DEFINITIONS.length,
      unlocked: withImages.filter((b) => b.unlocked).length,
    })
  } catch (error) {
    console.error('Badges API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
