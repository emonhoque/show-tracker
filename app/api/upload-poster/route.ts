import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 10MB.'
      }, { status: 400 })
    }

    // Demo mode - return mock upload response
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `posters/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`

    return NextResponse.json({
      url: `https://demo.showtracker.com/${filename}`,
      filename: filename,
      demo: true
    })

  } catch (error) {
    console.error('Error uploading poster:', error)
    return NextResponse.json({
      error: 'Failed to upload poster'
    }, { status: 500 })
  }
}
