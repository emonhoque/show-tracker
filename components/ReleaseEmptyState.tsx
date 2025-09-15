'use client'

import { Music } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ReleaseEmptyStateProps {
  days: number
}

export function ReleaseEmptyState({ days }: ReleaseEmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No recent releases</h3>
        <p className="text-gray-600 mb-4">
          No new music releases found in the last {days} days from tracked artists.
        </p>
        <p className="text-sm text-gray-500">
          Add some artists to the community pool to see their latest releases here!
        </p>
      </CardContent>
    </Card>
  )
}
