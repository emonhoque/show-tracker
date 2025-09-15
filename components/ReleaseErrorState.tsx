'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ReleaseErrorStateProps {
  error: string
  onRetry: () => void
}

export function ReleaseErrorState({ error, onRetry }: ReleaseErrorStateProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </CardContent>
    </Card>
  )
}
