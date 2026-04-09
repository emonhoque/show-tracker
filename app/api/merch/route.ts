import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import {
  validateMerchName,
  validateArtistName,
  validateMerchCategory,
  validateMerchCondition,
  validatePurchaseSource,
  validateMerchVariant,
  validateMerchNotes,
  validateQuantity,
  validateUserName,
  validateUrl,
} from '@/lib/validation'
import { parsePriceToMinor } from '@/lib/merch'

// GET /api/merch — List merch items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user')
    const category = searchParams.get('category')
    const artist = searchParams.get('artist')
    const showId = searchParams.get('show_id')
    const signed = searchParams.get('signed')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    if (!userId) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 })
    }

    let query = supabase
      .from('merch_items')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }
    if (artist) {
      query = query.ilike('artist_name', `%${artist}%`)
    }
    if (showId) {
      query = query.eq('show_id', showId)
    }
    if (signed === 'true') {
      query = query.eq('is_signed', true)
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: items, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch merch' }, { status: 500 })
    }

    // Fetch images for all items
    const itemIds = (items || []).map(item => item.id)
    let images: Record<string, Array<{ id: string; image_url: string; display_order: number }>> = {}

    if (itemIds.length > 0) {
      const { data: imageData } = await supabase
        .from('merch_item_images')
        .select('id, merch_item_id, image_url, display_order')
        .in('merch_item_id', itemIds)
        .order('display_order', { ascending: true })

      if (imageData) {
        images = imageData.reduce((acc, img) => {
          if (!acc[img.merch_item_id]) acc[img.merch_item_id] = []
          acc[img.merch_item_id].push(img)
          return acc
        }, {} as typeof images)
      }
    }

    // Fetch linked show data
    const showIds = [...new Set((items || []).filter(i => i.show_id).map(i => i.show_id))]
    let shows: Record<string, { id: string; title: string; date_time: string; venue: string }> = {}

    if (showIds.length > 0) {
      const { data: showData } = await supabase
        .from('shows')
        .select('id, title, date_time, venue')
        .in('id', showIds)

      if (showData) {
        shows = showData.reduce((acc, s) => {
          acc[s.id] = s
          return acc
        }, {} as typeof shows)
      }
    }

    // Fetch linked artist data
    const artistIds = [...new Set((items || []).filter(i => i.artist_id).map(i => i.artist_id))]
    let artists: Record<string, { id: string; artist_name: string; image_url: string | null }> = {}

    if (artistIds.length > 0) {
      const { data: artistData } = await supabase
        .from('artists')
        .select('id, artist_name, image_url')
        .in('id', artistIds)

      if (artistData) {
        artists = artistData.reduce((acc, a) => {
          acc[a.id] = a
          return acc
        }, {} as typeof artists)
      }
    }

    const enrichedItems = (items || []).map(item => ({
      ...item,
      images: images[item.id] || [],
      show: item.show_id ? shows[item.show_id] || null : null,
      artist: item.artist_id ? artists[item.artist_id] || null : null,
    }))

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      items: enrichedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/merch — Create a new merch item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      artist_name,
      artist_id,
      show_id,
      name,
      category,
      variant,
      quantity,
      condition,
      purchase_date,
      purchase_price,
      purchase_source,
      is_signed,
      is_limited_edition,
      is_custom,
      notes,
      image_urls,
    } = body

    // Validate required fields
    const userValidation = validateUserName(user_id)
    if (!userValidation.isValid) {
      return NextResponse.json({ error: userValidation.error }, { status: 400 })
    }

    const nameValidation = validateMerchName(name)
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }

    const artistNameValidation = validateArtistName(artist_name)
    if (!artistNameValidation.isValid) {
      return NextResponse.json({ error: artistNameValidation.error }, { status: 400 })
    }

    const categoryValidation = validateMerchCategory(category)
    if (!categoryValidation.isValid) {
      return NextResponse.json({ error: categoryValidation.error }, { status: 400 })
    }

    const conditionValidation = validateMerchCondition(condition || 'new')
    if (!conditionValidation.isValid) {
      return NextResponse.json({ error: conditionValidation.error }, { status: 400 })
    }

    const sourceValidation = validatePurchaseSource(purchase_source || '')
    if (!sourceValidation.isValid) {
      return NextResponse.json({ error: sourceValidation.error }, { status: 400 })
    }

    const variantValidation = validateMerchVariant(variant || '')
    if (!variantValidation.isValid) {
      return NextResponse.json({ error: variantValidation.error }, { status: 400 })
    }

    const notesValidation = validateMerchNotes(notes || '')
    if (!notesValidation.isValid) {
      return NextResponse.json({ error: notesValidation.error }, { status: 400 })
    }

    const qty = quantity ? parseInt(quantity, 10) : 1
    const qtyValidation = validateQuantity(qty)
    if (!qtyValidation.isValid) {
      return NextResponse.json({ error: qtyValidation.error }, { status: 400 })
    }

    // Parse price
    let priceMinor: number | null = null
    if (purchase_price) {
      priceMinor = parsePriceToMinor(String(purchase_price))
    }

    // Validate image URLs if present
    if (image_urls && Array.isArray(image_urls)) {
      if (image_urls.length > 5) {
        return NextResponse.json({ error: 'Maximum 5 images allowed per item' }, { status: 400 })
      }
      for (const url of image_urls) {
        const urlValidation = validateUrl(url)
        if (!urlValidation.isValid) {
          return NextResponse.json({ error: `Invalid image URL: ${urlValidation.error}` }, { status: 400 })
        }
      }
    }

    // Insert merch item
    const { data, error } = await supabase
      .from('merch_items')
      .insert([
        {
          user_id: userValidation.sanitizedValue,
          artist_name: artistNameValidation.sanitizedValue,
          artist_id: artist_id || null,
          show_id: show_id || null,
          name: nameValidation.sanitizedValue,
          category: categoryValidation.sanitizedValue,
          variant: variantValidation.sanitizedValue || null,
          quantity: qty,
          condition: conditionValidation.sanitizedValue,
          purchase_date: purchase_date || null,
          purchase_price_minor: priceMinor,
          purchase_source: sourceValidation.sanitizedValue || null,
          is_signed: is_signed === true,
          is_limited_edition: is_limited_edition === true,
          is_custom: is_custom === true,
          notes: notesValidation.sanitizedValue || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create merch item' }, { status: 500 })
    }

    // Insert images if provided
    if (data && image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
      const imageRows = image_urls.map((url: string, index: number) => ({
        merch_item_id: data.id,
        image_url: url,
        display_order: index,
      }))

      const { error: imgError } = await supabase
        .from('merch_item_images')
        .insert(imageRows)

      if (imgError) {
        console.error('Image insert error:', imgError)
        // Don't fail the whole request, item was created
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
