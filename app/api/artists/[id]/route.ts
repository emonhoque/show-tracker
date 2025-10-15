import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 })
    }

    // Demo mode - return mock success response
    return NextResponse.json({
      message: 'Artist deleted successfully',
      demo: true
    })
  } catch (error) {
    console.error('Error in DELETE /api/artists/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
