import { NextRequest, NextResponse } from 'next/server'
import { validateUserName } from '@/lib/validation'
import {
  getUserBadgesGrouped,
  evaluateAndUnlockBadges,
  BADGE_DEFINITIONS,
  LIFETIME_BADGES,
  YEAR_BADGES,
  getBadgeImageUrl,
} from '@/lib/badges'

/**
 * GET /api/badges?user=<name>
 * Returns badges grouped by scope (lifetime + per-year).
 * Also triggers a fresh evaluation so the response is always up-to-date.
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

    // Fetch grouped badge data
    const grouped = await getUserBadgesGrouped(userId)

    // Attach image URLs
    const lifetime = grouped.lifetime.map((b) => ({
      ...b,
      image_url: getBadgeImageUrl(b.key),
    }))
    const years = grouped.years.map((y) => ({
      year: y.year,
      badges: y.badges.map((b) => ({
        ...b,
        image_url: getBadgeImageUrl(b.key),
      })),
      artistBadges: y.artistBadges,
    }))

    // Total / unlocked counts across all scopes
    const totalLifetime = LIFETIME_BADGES.length
    const totalYearPerYear = YEAR_BADGES.length
    const unlockedLifetime = lifetime.filter((b) => b.unlocked).length
    const unlockedByYear = years.map((y) => ({
      year: y.year,
      unlocked: y.badges.filter((b) => b.unlocked).length,
      total: totalYearPerYear,
    }))

    return NextResponse.json({
      lifetime,
      years,
      attendedYears: grouped.attendedYears,
      newlyUnlocked: newBadges,
      summary: {
        totalDefinitions: BADGE_DEFINITIONS.length,
        lifetimeUnlocked: unlockedLifetime,
        lifetimeTotal: totalLifetime,
        unlockedByYear,
      },
    })
  } catch (error) {
    console.error('Badges API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
