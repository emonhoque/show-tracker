import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { validateUserName } from '@/lib/validation'
import {
  getCategoryLabel,
  getCategoryEmoji,
  minorToDollars,
  type CostCategory,
  type CostsSummary,
} from '@/lib/costs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const userParam = searchParams.get('user')

    if (!userParam) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 })
    }

    const nameValidation = validateUserName(userParam)
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }
    const userName = nameValidation.sanitizedValue!

    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear()
    if (isNaN(year) || year < 2020 || year > 2100) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
    }

    const startDate = `${year}-01-01T00:00:00Z`
    const endDate = `${year + 1}-01-01T00:00:00Z`

    const { data: rsvps, error: rsvpError } = await supabase
      .from('rsvps')
      .select('show_id')
      .eq('name', userName)
      .eq('status', 'going')

    if (rsvpError) {
      console.error('Error fetching RSVPs:', rsvpError)
      return NextResponse.json({ error: 'Failed to fetch RSVPs' }, { status: 500 })
    }

    const emptySummary: CostsSummary = {
      year,
      total_spend: 0,
      total_shows_with_costs: 0,
      total_attended_shows: 0,
      average_per_show: 0,
      spend_by_category: [],
      most_expensive_show: null,
      cheapest_show: null,
      cost_per_artist: null,
    }

    if (!rsvps || rsvps.length === 0) {
      return NextResponse.json(emptySummary)
    }

    const showIds = rsvps.map(r => r.show_id)

    const { data: shows, error: showsError } = await supabase
      .from('shows')
      .select('id, title, date_time, show_artists')
      .in('id', showIds)
      .gte('date_time', startDate)
      .lt('date_time', endDate)

    if (showsError) {
      console.error('Error fetching shows:', showsError)
      return NextResponse.json({ error: 'Failed to fetch shows' }, { status: 500 })
    }

    if (!shows || shows.length === 0) {
      return NextResponse.json(emptySummary)
    }

    const attendedShowIds = shows.map(s => s.id)

    const { data: costs, error: costsError } = await supabase
      .from('show_costs')
      .select('*')
      .eq('user_id', userName)
      .in('show_id', attendedShowIds)

    if (costsError) {
      console.error('Error fetching costs:', costsError)
      return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 })
    }

    let totalCents = 0
    const categoryTotalsCents: Record<string, number> = {}
    const showTotalsCents: Record<string, number> = {}

    for (const cost of (costs || [])) {
      totalCents += cost.amount_minor

      if (!categoryTotalsCents[cost.category]) {
        categoryTotalsCents[cost.category] = 0
      }
      categoryTotalsCents[cost.category] += cost.amount_minor

      if (!showTotalsCents[cost.show_id]) {
        showTotalsCents[cost.show_id] = 0
      }
      showTotalsCents[cost.show_id] += cost.amount_minor
    }

    const totalSpend = minorToDollars(totalCents)

    const spendByCategory = Object.entries(categoryTotalsCents)
      .map(([category, cents]) => ({
        category: category as CostCategory,
        label: getCategoryLabel(category),
        emoji: getCategoryEmoji(category),
        total: minorToDollars(cents),
      }))
      .sort((a, b) => b.total - a.total)

    let mostExpensiveShow: CostsSummary['most_expensive_show'] = null
    let cheapestShow: CostsSummary['cheapest_show'] = null
    if (Object.keys(showTotalsCents).length > 0) {
      const sorted = Object.entries(showTotalsCents).sort(([, a], [, b]) => b - a)
      const [maxShowId, maxCents] = sorted[0]
      const maxShow = shows.find(s => s.id === maxShowId)
      if (maxShow) {
        mostExpensiveShow = {
          show_id: maxShowId,
          title: maxShow.title,
          total: minorToDollars(maxCents),
        }
      }
      const [minShowId, minCents] = sorted[sorted.length - 1]
      const minShow = shows.find(s => s.id === minShowId)
      if (minShow) {
        cheapestShow = {
          show_id: minShowId,
          title: minShow.title,
          total: minorToDollars(minCents),
        }
      }
    }

    let costPerArtist: number | null = null
    const totalArtists = shows.reduce((acc, show) => {
      if (show.show_artists && Array.isArray(show.show_artists)) {
        return acc + show.show_artists.length
      }
      return acc
    }, 0)
    if (totalArtists > 0 && totalSpend > 0) {
      costPerArtist = Math.round((totalSpend / totalArtists) * 100) / 100
    }

    const showsWithCosts = new Set(
      (costs || []).map(c => c.show_id)
    ).size

    const summary: CostsSummary = {
      year,
      total_spend: totalSpend,
      total_shows_with_costs: showsWithCosts,
      total_attended_shows: shows.length,
      average_per_show: shows.length > 0
        ? Math.round((totalSpend / shows.length) * 100) / 100
        : 0,
      spend_by_category: spendByCategory,
      most_expensive_show: mostExpensiveShow,
      cheapest_show: cheapestShow,
      cost_per_artist: costPerArtist,
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
