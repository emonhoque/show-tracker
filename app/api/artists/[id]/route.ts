import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 })
    }

    // Delete the artist
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting artist:', error)
      return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Artist deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/artists/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
