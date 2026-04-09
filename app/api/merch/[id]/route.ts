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
  validateUrl,
} from '@/lib/validation'
import { parsePriceToMinor } from '@/lib/merch'

// GET /api/merch/[id] — Get a single merch item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const { data: item, error } = await supabase
      .from('merch_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Fetch images
    const { data: images } = await supabase
      .from('merch_item_images')
      .select('*')
      .eq('merch_item_id', id)
      .order('display_order', { ascending: true })

    // Fetch linked show
    let show = null
    if (item.show_id) {
      const { data: showData } = await supabase
        .from('shows')
        .select('id, title, date_time, venue')
        .eq('id', item.show_id)
        .single()
      show = showData
    }

    // Fetch linked artist
    let artist = null
    if (item.artist_id) {
      const { data: artistData } = await supabase
        .from('artists')
        .select('id, artist_name, image_url')
        .eq('id', item.artist_id)
        .single()
      artist = artistData
    }

    return NextResponse.json({
      ...item,
      images: images || [],
      show,
      artist,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/merch/[id] — Update a merch item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const {
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

    let priceMinor: number | null = null
    if (purchase_price) {
      priceMinor = parsePriceToMinor(String(purchase_price))
    }

    // Update the item
    const { data, error } = await supabase
      .from('merch_items')
      .update({
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
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update merch item' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Update images: replace all
    if (image_urls && Array.isArray(image_urls)) {
      if (image_urls.length > 5) {
        return NextResponse.json({ error: 'Maximum 5 images allowed per item' }, { status: 400 })
      }
      // Validate all URLs
      for (const url of image_urls) {
        const urlValidation = validateUrl(url)
        if (!urlValidation.isValid) {
          return NextResponse.json({ error: `Invalid image URL: ${urlValidation.error}` }, { status: 400 })
        }
      }

      // Delete existing images
      await supabase
        .from('merch_item_images')
        .delete()
        .eq('merch_item_id', id)

      // Insert new ones
      if (image_urls.length > 0) {
        const imageRows = image_urls.map((url: string, index: number) => ({
          merch_item_id: id,
          image_url: url,
          display_order: index,
        }))

        await supabase
          .from('merch_item_images')
          .insert(imageRows)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/merch/[id] — Delete a merch item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // Images will be cascade deleted
    const { error } = await supabase
      .from('merch_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete merch item' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
