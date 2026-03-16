import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('shows')
      .select('date_time')
      .order('date_time', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch years' }, { status: 500 })
    }

    const years = Array.from(
      new Set((data || []).map((row) => new Date(row.date_time).getFullYear()))
    ).sort((a, b) => b - a)

    return NextResponse.json({ years })
  } catch (error) {
    console.error('Error fetching years:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
