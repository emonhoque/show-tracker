import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

// GET /api/merch/stats — Get merch stats for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user')

    if (!userId) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 })
    }

    // Get all items for the user (select only needed fields)
    const { data: items, error } = await supabase
      .from('merch_items')
      .select('category, quantity, purchase_price_minor, artist_name, is_signed, is_limited_edition, is_custom')
      .eq('user_id', userId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    const allItems = items || []
    const totalItems = allItems.length
    const totalQuantity = allItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    const totalSpent = allItems.reduce((sum, item) => sum + (item.purchase_price_minor || 0), 0)
    const signedCount = allItems.filter(i => i.is_signed).length
    const limitedEditionCount = allItems.filter(i => i.is_limited_edition).length
    const customCount = allItems.filter(i => i.is_custom).length

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {}
    allItems.forEach(item => {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1
    })

    // Top artist
    const artistCounts: Record<string, number> = {}
    allItems.forEach(item => {
      artistCounts[item.artist_name] = (artistCounts[item.artist_name] || 0) + 1
    })

    let topArtist: { name: string; count: number } | null = null
    const artistEntries = Object.entries(artistCounts)
    if (artistEntries.length > 0) {
      const [name, count] = artistEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max)
      topArtist = { name, count }
    }

    return NextResponse.json({
      totalItems,
      totalQuantity,
      totalSpent,
      categoryBreakdown,
      topArtist,
      signedCount,
      limitedEditionCount,
      customCount,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
